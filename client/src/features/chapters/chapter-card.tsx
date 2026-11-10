import { useState } from 'react';
import { Link } from 'react-router';
import { publishChain, type Chapter } from '@wos/shared';
import { IconButton } from '@/components/ui/icon-button';
import { WritingDots } from '@/components/ui/writing-dots';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, PublishIcon, TrashIcon, UnpublishIcon } from '@/components/icons';
import { useMe } from '@/features/auth/api';
import { canManage } from '@/features/auth/roles';
import { useCities } from '@/features/cities/api';
import { useCityPlaces } from '@/features/places/api';
import { linkButtonClass } from '@/features/locations/inline-editor';
import { ApiError } from '@/lib/api';
import { publicationLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useDeleteChapter, usePublishChapter } from './api';
import { ANIMATION_LABELS, asAnimation } from './animations';
import { isFinalChapter } from './chapter-form';

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

const sectionTitle = 'font-display text-[26px] leading-none font-bold';
const small = 'text-[15px] tracking-[0.14em] text-ink-muted uppercase';

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
      className={cn('scroll-mt-6 bg-paper shadow-paper transition-opacity', remove.isPending && 'opacity-60')}
    >
      <div className="flex flex-wrap items-center">
        <button
          type="button"
          id={`chapter-toggle-${chapter.id}`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex min-w-0 flex-[1_1_300px] cursor-pointer items-center gap-4.5 border-0 bg-transparent py-5.5 pr-2 pl-7 text-left font-serif text-ink transition-colors hover:bg-ink/4"
        >
          {open ? <ChevronUpIcon className="shrink-0" /> : <ChevronDownIcon className="shrink-0" />}
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className="font-display text-[34px] leading-[1.05] font-semibold">{chapter.name}</span>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[17px] text-ink-muted">
              {isRoot && <span className={small}>Inicio</span>}
              {nexts.length ? (
                <>
                  <span>Sigue:</span>
                  {nexts.map((c) => (
                    <span key={c.id} className="text-ink">
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

        <div className="mr-4 ml-auto flex items-center justify-end py-2">
          {!confirm && (
            <div className="flex items-center gap-0.5">
              {busy && (
                <WritingDots
                  label={`${remove.isPending ? 'Eliminando' : chapter.published ? 'Despublicando' : 'Publicando'} ${chapter.name}`}
                  className="mr-2 text-3xl text-ink-muted"
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
            <div className="flex max-w-[520px] flex-wrap items-center justify-end gap-x-2.5 text-right text-[17px]">
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
        <p role="alert" className="px-7 pb-4 text-base text-danger">
          {error instanceof ApiError ? error.message : 'No se pudo completar la acción'}
        </p>
      )}

      {open && (
        <div id={panelId} className="flex flex-col gap-9 border-t border-ink p-7">
          <section className="flex flex-col gap-4">
            <h3 className={sectionTitle}>Fragmentos</h3>
            {chapter.story.length ? (
              chapter.story.map((r, i) => (
                <div key={i} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2.5">
                  <p className="m-0 flex-[1_1_380px] text-xl leading-[1.55] text-pretty whitespace-pre-wrap text-ink-soft">{r.text}</p>
                  <span className="inline-flex min-h-7 items-center border border-ink px-3 text-[15px] tracking-[0.14em] whitespace-nowrap uppercase">
                    {ANIMATION_LABELS[asAnimation(r.animation)]}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[19px] text-ink-muted italic">Este capítulo aún está en blanco.</p>
            )}
          </section>

          {!!options.length && (
            <section className="flex flex-col gap-4">
              <h3 className={sectionTitle}>Decisiones</h3>
              <div className="flex flex-col gap-3">
                {options.map((o) => {
                  const target = byId(o.value);
                  const body = (
                    <span className="flex flex-col gap-1">
                      <span className="font-display text-[23px] leading-[1.1] font-bold">{o.name}</span>
                      <span className="text-[19px] leading-normal text-ink-soft">{o.description}</span>
                    </span>
                  );
                  return target ? (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => onGo(target.id)}
                      className="flex w-full cursor-pointer items-start justify-between gap-4 border border-paper-line bg-parchment px-4.5 py-3.5 text-left font-serif text-ink transition-colors hover:bg-[#efe4c9]"
                    >
                      {body}
                      <span className="shrink-0 text-right text-base text-ink-muted">→ {target.name}</span>
                    </button>
                  ) : (
                    <div key={o.id} className="flex items-start justify-between gap-4 border border-paper-line bg-parchment px-4.5 py-3.5">
                      {body}
                      <em className="shrink-0 text-base text-ink-muted">Sin capítulo</em>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {isFinalChapter(chapter) && (
            <section className="flex flex-col gap-3">
              <h3 className={sectionTitle}>Lugar de finalización</h3>
              <Ending chapter={chapter} />
            </section>
          )}

          <footer className="flex justify-end border-t border-ink pt-3.5">
            <div className="flex flex-col gap-0.5 text-right text-[17px] text-ink-muted">
              <em className="text-ink">{chapter.author || 'Sin autor todavía'}</em>
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
  if (!end?.cityId) return <p className="text-[19px] text-ink-muted italic">Sin lugar de finalización.</p>;
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
    <p className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[19px]">
      <span className={small}>{kind}</span>
      <Link to={to} className="link-underline text-ink">
        {children}
      </Link>
    </p>
  );
}
