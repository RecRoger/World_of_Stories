import { useState } from 'react';
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

type Mode = 'view' | 'edit' | 'add' | 'confirm-delete';

// Altura fija para que todas las tarjetas midan lo mismo; lo que no cabe se desplaza dentro de la caja
const boxClass = 'box-border flex h-[280px] flex-col gap-2.5 border border-paper-line bg-parchment px-5 pt-4 pb-5';
// Al escribir ocupa también el sitio del paginador (280 + 10 de separación + 44 de la fila), así la tarjeta no salta
const editorBoxClass = 'box-border flex h-[334px] flex-col border border-paper-line bg-parchment p-4';
const scrollClass = 'min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:var(--color-ink-shadow)_transparent] [scrollbar-width:thin]';

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
      <div className={editorBoxClass}>
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
    <div className="flex flex-col gap-2.5">
      {!tale ? (
        <div className={`${boxClass} items-center justify-center text-center text-[19px] text-ink-muted italic`}>
          Aún no hay {labels.plural} en {resource.words.this}.
        </div>
      ) : (
        <article aria-label={`${labels.item} ${i + 1} de ${tales.length}`} aria-busy={busy} className={boxClass}>
          <div className="flex min-h-11 shrink-0 items-start justify-between gap-3">
            <div className="flex flex-col gap-px pt-1 text-base leading-snug text-ink-muted">
              <em className="text-ink">{tale.author}</em>
              <span>{publicationLabel(tale.published, tale.publishDate, labels.published)}</span>
            </div>

            {canManage(user, tale.author) && mode === 'view' && (
              <div className="-mt-2 -mr-3 flex items-center gap-0.5">
                {busy && (
                  <WritingDots
                    label={remove.isPending ? `Eliminando ${labels.item}` : tale.published ? 'Despublicando' : 'Publicando'}
                    className="mr-1.5 text-2xl text-ink-muted"
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
              <div className="-mt-2 -mr-1.5 flex flex-wrap items-center justify-end gap-x-1 text-[17px]">
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
          <div tabIndex={0} aria-label={`Texto: ${labels.item} ${i + 1}`} className={`${scrollClass} focus-visible:outline-offset-2`}>
            {error && (
              <p role="alert" className="mb-2 text-base text-danger">
                {error instanceof ApiError ? error.message : 'No se pudo completar la acción'}
              </p>
            )}
            <TaleText tale={tale} />
          </div>
        </article>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="-ml-2.5 flex items-center gap-2">
          <IconButton label="Anterior" disabled={i <= 0} onClick={() => go(i - 1)}>
            <ArrowLeftIcon />
          </IconButton>
          <span aria-live="polite" className="min-w-16 text-center text-[17px] text-ink-muted">
            {tales.length > 0 ? `${i + 1} / ${tales.length}` : ''}
          </span>
          <IconButton label="Siguiente" disabled={i >= tales.length - 1} onClick={() => go(i + 1)}>
            <ArrowRightIcon />
          </IconButton>
        </div>
        <button type="button" className={`${linkButtonClass} px-1 text-lg`} onClick={() => setMode('add')}>
          + {labels.add}
        </button>
      </div>
    </div>
  );
}

function TaleText({ tale }: { tale: Tale }) {
  const paragraphs = tale.tale.map((r) => r.text.trim()).filter(Boolean);
  if (!paragraphs.length) return <p className="text-[19px] text-ink-muted italic">Sin texto.</p>;
  return (
    <div className="flex flex-col gap-3 text-[19px] leading-normal text-pretty text-ink-soft">
      {paragraphs.map((p, n) => (
        <p key={n}>{p}</p>
      ))}
    </div>
  );
}
