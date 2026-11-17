import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Tale } from '@wos/shared';
import { IconButton } from '@/components/ui/icon-button';
import { WritingDots } from '@/components/ui/writing-dots';
import { ArrowLeftIcon, ArrowRightIcon, PencilIcon, PublishIcon, TrashIcon, UnpublishIcon } from '@/components/icons';
import { useMe } from '@/features/auth/api';
import { canManage } from '@/features/auth/roles';
import { ApiError } from '@/lib/api';
import { publicationLabel } from '@/lib/format';
import { useAddTale, useDeleteTale, usePublishTale, useUpdateTale } from './api';
import { InlineEditor, linkButtonClass } from './inline-editor';
import { TALE_LABELS, taleToText, type TaleKind } from './narrative';
import type { LocationEntity, LocationResource } from './resource';
import './tale-carousel.scss';

type Mode = 'view' | 'edit' | 'add' | 'confirm-delete';

type TaleCarouselProps = { resource: LocationResource; entity: LocationEntity; kind: TaleKind };

/**
 * Carrusel de extractos (descripciones, viajes o entradas) de una ciudad o un lugar, de uno en uno.
 * Añadir: cualquier escritor. Editar, publicar y eliminar: el autor del extracto o un admin.
 */
export function TaleCarousel({ resource, entity, kind }: TaleCarouselProps) {
  const { data: user } = useMe();
  const tales = entity[kind] ?? [];
  const labels = TALE_LABELS[kind];
  const target = { resource, id: entity.id, kind };
  const add = useAddTale(target);
  const update = useUpdateTale(target);
  const publish = usePublishTale(target);
  const remove = useDeleteTale(target);

  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('view');
  const i = Math.min(index, Math.max(tales.length - 1, 0));
  const tale: Tale | undefined = tales[i];
  const busy = publish.isPending || remove.isPending;
  const error = publish.error ?? remove.error;

  const go = (next: number) => {
    setIndex(next);
    setMode('view');
    publish.reset();
    remove.reset();
  };

  // Al escribir (editar o añadir), el textarea ocupa todo el recuadro, también el sitio del paginador:
  // sin autor, fecha ni navegación, y con Cancelar / Guardar siempre visibles abajo
  if (mode === 'add' || (mode === 'edit' && tale)) {
    const editing = mode === 'edit' && tale;
    return (
      <div className="tale-carousel__editor">
        <InlineEditor
          fill
          multiline
          submitLabel="Guardar"
          label={editing ? `Texto: ${labels.item}` : `Nuevo texto de ${labels.item}`}
          initialValue={editing ? taleToText(tale.tale) : ''}
          onCancel={() => setMode('view')}
          onSubmit={async (text) => {
            if (editing) {
              await update.mutateAsync({ taleId: tale.id, text });
              setMode('view');
            } else {
              await add.mutateAsync(text);
              go(tales.length); // el nuevo queda al final
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="tale-carousel">
      {!tale ? (
        <div className={cn('tale-carousel__box', 'tale-carousel__box--empty')}>
          Aún no hay {labels.plural} en {resource.words.this}.
        </div>
      ) : (
        <article aria-label={`${labels.item} ${i + 1} de ${tales.length}`} aria-busy={busy} className="tale-carousel__box">
          <div className="tale-carousel__meta">
            <div className="tale-carousel__byline">
              <em className="tale-carousel__author">{tale.author}</em>
              <span>{publicationLabel(tale.published, tale.publishDate, labels.published)}</span>
            </div>

            {canManage(user, tale.author) && mode === 'view' && (
              <div className="tale-carousel__tools">
                {busy && (
                  <WritingDots
                    label={remove.isPending ? `Eliminando ${labels.item}` : tale.published ? 'Despublicando' : 'Publicando'}
                    className="tale-carousel__dots"
                  />
                )}
                <IconButton label={`Editar ${labels.item}`} aria-disabled={busy} onClick={() => !busy && setMode('edit')}>
                  <PencilIcon width={20} height={20} />
                </IconButton>
                <IconButton
                  label={tale.published ? `Despublicar ${labels.item}` : `Publicar ${labels.item}`}
                  aria-disabled={busy}
                  onClick={() => !busy && publish.mutate({ taleId: tale.id, published: !tale.published })}
                >
                  {tale.published ? <UnpublishIcon width={20} height={20} /> : <PublishIcon width={20} height={20} />}
                </IconButton>
                <IconButton label={`Eliminar ${labels.item}`} aria-disabled={busy} onClick={() => !busy && setMode('confirm-delete')}>
                  <TrashIcon width={20} height={20} />
                </IconButton>
              </div>
            )}

            {mode === 'confirm-delete' && (
              <div className="tale-carousel__confirm">
                <span>¿Eliminar?</span>
                <button
                  type="button"
                  className={linkButtonClass}
                  onClick={() => {
                    setMode('view');
                    remove.mutate(tale.id, { onSuccess: () => setIndex(Math.max(i - 1, 0)) });
                  }}
                >
                  Sí, eliminar
                </button>
                <button type="button" className={linkButtonClass} autoFocus onClick={() => setMode('view')}>
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Enfocable para poder desplazarlo con el teclado cuando el texto es largo */}
          <div tabIndex={0} aria-label={`Texto: ${labels.item} ${i + 1}`} className="tale-carousel__scroll">
            {error && (
              <p role="alert" className="tale-carousel__error">
                {error instanceof ApiError ? error.message : 'No se pudo completar la acción'}
              </p>
            )}
            <TaleText tale={tale} />
          </div>
        </article>
      )}

      <div className="tale-carousel__pager">
        <div className="tale-carousel__nav">
          <IconButton label="Anterior" disabled={i <= 0} onClick={() => go(i - 1)}>
            <ArrowLeftIcon />
          </IconButton>
          <span aria-live="polite" className="tale-carousel__count">
            {tales.length > 0 ? `${i + 1} / ${tales.length}` : ''}
          </span>
          <IconButton label="Siguiente" disabled={i >= tales.length - 1} onClick={() => go(i + 1)}>
            <ArrowRightIcon />
          </IconButton>
        </div>
        <button type="button" className={cn(linkButtonClass, 'tale-carousel__add')} onClick={() => setMode('add')}>
          + {labels.add}
        </button>
      </div>
    </div>
  );
}

function TaleText({ tale }: { tale: Tale }) {
  const paragraphs = tale.tale.map((r) => r.text.trim()).filter(Boolean);
  if (!paragraphs.length) return <p className="tale-carousel__empty-text">Sin texto.</p>;
  return (
    <div className="tale-carousel__text">
      {paragraphs.map((p, n) => (
        <p key={n}>{p}</p>
      ))}
    </div>
  );
}
