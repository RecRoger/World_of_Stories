import { useState } from 'react';
import { Link } from 'react-router';
import { optionCost, optionItem, publishChain, type Chapter } from '@wos/shared';
import { IconButton } from '@/components/ui/icon-button';
import { WritingDots } from '@/components/ui/writing-dots';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, PublishIcon, TrashIcon, UnpublishIcon } from '@/components/icons';
import { useMe } from '@/features/auth/api';
import { canManage } from '@/features/auth/roles';
import { useCities } from '@/features/cities/api';
import { useItems } from '@/features/items/api';
import { useCityPlaces } from '@/features/places/api';
import { linkButtonClass } from '@/features/locations/inline-editor';
import { ApiError } from '@/lib/api';
import { formatMoney, publicationLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useDeleteChapter, usePublishChapter } from './api';
import { ANIMATION_LABELS, asAnimation } from './animations';
import { isFinalChapter } from './chapter-form';
import './chapter-card.scss';

type ChapterCardProps = {
  npcId: string;
  /** Autor del NPC: responde por los capítulos que aún no tienen autor. */
  npcAuthor: string;
  chapter: Chapter;
  chapters: Chapter[];
  isRoot: boolean;
  open: boolean;
  onToggle: () => void;
  /** Ir al capítulo al que lleva una decisión (lo abre y cierra este). */
  onGo: (chapterId: string) => void;
  onEdit: () => void;
};

type Confirm = { kind: 'delete' } | { kind: 'publish'; names: string[] } | null;

const sectionTitle = 'chapter-card__section-title';
const small = 'chapter-card__tag';

/**
 * Un capítulo en el acordeón de la historia: la cabecera dice a qué capítulos sigue; abierto, muestra sus
 * fragmentos, sus decisiones (que llevan a otros capítulos) o su lugar de finalización.
 */
export function ChapterCard({ npcId, npcAuthor, chapter, chapters, isRoot, open, onToggle, onGo, onEdit }: ChapterCardProps) {
  const { data: user } = useMe();
  const publish = usePublishChapter(npcId);
  const remove = useDeleteChapter(npcId);
  const [confirm, setConfirm] = useState<Confirm>(null);

  const byId = (id: string) => chapters.find((c) => c.id === id);
  const { data: catalog } = useItems();
  const itemName = (itemId: string) => catalog?.find((i) => i.id === itemId)?.name ?? 'un objeto que ya no existe';
  const options = chapter.decision?.options ?? [];
  const nexts = [...new Set(options.map((o) => o.value))].map(byId).filter((c): c is Chapter => !!c);
  // Un capítulo vacío y sin autor es de quien lo escriba primero (como en el server); publicar y borrar, de su
  // autor o, si no tiene, del autor del NPC
  const canEdit = !chapter.author || canManage(user, chapter.author);
  const manageable = canManage(user, chapter.author || npcAuthor);
  // Decisiones (de cualquier capítulo) que llevan a este: se quitan si se borra
  const incoming = chapters.flatMap((c) => c.decision?.options ?? []).filter((o) => o.value === chapter.id).length;
  const busy = publish.isPending || remove.isPending;
  const error = publish.error ?? remove.error;
  const panelId = `chapter-panel-${chapter.id}`;

  const askPublish = () => {
    if (chapter.published) return publish.mutate({ id: chapter.id, published: false });
    // Publicar arrastra a los capítulos sin publicar a los que llevan sus decisiones: se avisa antes
    const others = publishChain(chapters, chapter.id).filter((c) => c.id !== chapter.id);
    if (!others.length) return publish.mutate({ id: chapter.id, published: true });
    setConfirm({ kind: 'publish', names: others.map((c) => c.name) });
  };

  return (
    <article
      id={`chapter-${chapter.id}`}
      aria-busy={busy}
      className={cn('chapter-card', remove.isPending && 'chapter-card--busy')}
    >
      <div className="chapter-card__header">
        <button
          type="button"
          id={`chapter-toggle-${chapter.id}`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="chapter-card__toggle"
        >
          {open ? <ChevronUpIcon className="chapter-card__chevron" /> : <ChevronDownIcon className="chapter-card__chevron" />}
          <span className="chapter-card__summary">
            <span className="chapter-card__name">{chapter.name}</span>
            <span className="chapter-card__nexts">
              {isRoot && <span className={small}>Inicio</span>}
              {nexts.length ? (
                <>
                  <span>Sigue:</span>
                  {nexts.map((c) => (
                    <span key={c.id} className="chapter-card__strong">
                      → {c.name}
                    </span>
                  ))}
                </>
              ) : (
                <em>Sin capítulos siguientes</em>
              )}
            </span>
          </span>
        </button>

        <div className="chapter-card__side">
          {!confirm && (
            <div className="chapter-card__tools">
              {busy && (
                <WritingDots
                  label={`${remove.isPending ? 'Eliminando' : chapter.published ? 'Despublicando' : 'Publicando'} ${chapter.name}`}
                  className="chapter-card__dots"
                />
              )}
              {canEdit && (
                <IconButton label={`Editar ${chapter.name}`} aria-disabled={busy} onClick={() => !busy && onEdit()}>
                  <PencilIcon />
                </IconButton>
              )}
              {manageable && (
                <IconButton
                  label={chapter.published ? `Despublicar ${chapter.name}` : `Publicar ${chapter.name}`}
                  aria-disabled={busy}
                  onClick={() => !busy && askPublish()}
                >
                  {chapter.published ? <UnpublishIcon /> : <PublishIcon />}
                </IconButton>
              )}
              {/* El capítulo inicial no se borra: es donde empieza la historia */}
              {manageable && !isRoot && (
                <IconButton label={`Eliminar ${chapter.name}`} aria-disabled={busy} onClick={() => !busy && setConfirm({ kind: 'delete' })}>
                  <TrashIcon />
                </IconButton>
              )}
            </div>
          )}

          {confirm && (
            <div className="chapter-card__confirm">
              <span>
                {confirm.kind === 'delete'
                  ? incoming
                    ? `¿Eliminar este capítulo? Se quitarán ${incoming === 1 ? 'la decisión que lleva' : `las ${incoming} decisiones que llevan`} a él.`
                    : '¿Eliminar este capítulo?'
                  : `Se publicarán también: ${confirm.names.map((n) => `«${n}»`).join(', ')}.`}
              </span>
              <button
                type="button"
                className={linkButtonClass}
                onClick={() => {
                  setConfirm(null);
                  if (confirm.kind === 'delete') remove.mutate(chapter.id);
                  else publish.mutate({ id: chapter.id, published: true });
                }}
              >
                {confirm.kind === 'delete' ? 'Sí, eliminar' : 'Sí, publicar'}
              </button>
              <button type="button" className={linkButtonClass} autoFocus onClick={() => setConfirm(null)}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="chapter-card__error">
          {error instanceof ApiError ? error.message : 'No se pudo completar la acción'}
        </p>
      )}

      {open && (
        <div id={panelId} className="chapter-card__panel">
          <section className="chapter-card__section">
            <h3 className={sectionTitle}>Fragmentos</h3>
            {chapter.story.length ? (
              chapter.story.map((r, i) => (
                <div key={i} className="chapter-card__fragment">
                  <p className="chapter-card__fragment-text">{r.text}</p>
                  <span className="chapter-card__animation">
                    {ANIMATION_LABELS[asAnimation(r.animation)]}
                  </span>
                </div>
              ))
            ) : (
              <p className="chapter-card__empty">Este capítulo aún está en blanco.</p>
            )}
          </section>

          {chapter.reward && (
            <section className="chapter-card__section">
              <h3 className={sectionTitle}>Recompensa</h3>
              <p className="chapter-card__reward">
                {chapter.reward.type === 'money'
                  ? `Gana ${formatMoney(chapter.reward.amount ?? 0)}`
                  : `Gana ${(chapter.reward.items ?? [])
                      .map((s) => `${itemName(s.itemId)}${s.quantity > 1 ? ` ×${s.quantity}` : ''}`)
                      .join(', ')}`}
              </p>
            </section>
          )}

          {!!options.length && (
            <section className="chapter-card__section">
              <h3 className={sectionTitle}>Decisiones</h3>
              <div className="chapter-card__decisions">
                {options.map((o, i) => {
                  const target = byId(o.value);
                  const cost = optionCost(chapter.decision, i);
                  const usesItem = optionItem(chapter.decision, i);
                  const body = (
                    <span className="chapter-card__decision-text">
                      <span className="chapter-card__decision-name">{o.name}</span>
                      {chapter.decision?.decisionType === 'money' && (
                        <span className="chapter-card__decision-cost">{cost ? `Se paga ${formatMoney(cost)}` : 'Gratis'}</span>
                      )}
                      {chapter.decision?.decisionType === 'item' && (
                        <span className="chapter-card__decision-cost">
                          {usesItem ? `Usa ${itemName(usesItem)}${o.removeItem ? ' · se gasta' : ''}` : 'Sin usarlo'}
                        </span>
                      )}
                      <span className="chapter-card__decision-description">{o.description}</span>
                    </span>
                  );
                  return target ? (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => onGo(target.id)}
                      className="chapter-card__decision"
                    >
                      {body}
                      <span className="chapter-card__decision-target">→ {target.name}</span>
                    </button>
                  ) : (
                    <div key={o.id} className="chapter-card__decision--orphan">
                      {body}
                      <em className="chapter-card__decision-missing">Sin capítulo</em>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {isFinalChapter(chapter) && (
            <section className="chapter-card__section chapter-card__section--tight">
              <h3 className={sectionTitle}>Lugar de finalización</h3>
              <Ending chapter={chapter} />
            </section>
          )}

          <footer className="chapter-card__footer">
            <div className="chapter-card__credits">
              <em className="chapter-card__strong">{chapter.author || 'Sin autor todavía'}</em>
              <span>{publicationLabel(chapter.published, chapter.publishDate, 'Publicado')}</span>
            </div>
          </footer>
        </div>
      )}
    </article>
  );
}

/** "CIUDAD Valdoria" o "LUGAR La taberna…", con enlace a su página de la sección de escritor. */
function Ending({ chapter }: { chapter: Chapter }) {
  const end = chapter.endLocation;
  const { data: cities } = useCities();
  if (!end?.cityId) return <p className="chapter-card__empty">Sin lugar de finalización.</p>;
  const city = cities?.find((c) => c.id === end.cityId);
  if (end.placeId) return <PlaceEnding cityId={end.cityId} placeId={end.placeId} />;
  return (
    <EndingLine kind="Ciudad" to={`/write/cities/${end.cityId}/places`}>
      {city?.name ?? '…'}
    </EndingLine>
  );
}

function PlaceEnding({ cityId, placeId }: { cityId: string; placeId: string }) {
  const { data: places } = useCityPlaces(cityId);
  return (
    <EndingLine kind="Lugar" to={`/write/cities/${cityId}/places/${placeId}/events`}>
      {places?.find((p) => p.id === placeId)?.name ?? '…'}
    </EndingLine>
  );
}

function EndingLine({ kind, to, children }: { kind: string; to: string; children: string }) {
  return (
    <p className="chapter-card__ending">
      <span className={small}>{kind}</span>
      <Link to={to} className="chapter-card__ending-link">
        {children}
      </Link>
    </p>
  );
}
