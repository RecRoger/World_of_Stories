import { useState } from 'react';
import { Link } from 'react-router';
import { Tabs } from 'radix-ui';
import { IconButton } from '@/components/ui/icon-button';
import { Paper } from '@/components/ui/paper';
import { WritingDots } from '@/components/ui/writing-dots';
import { ArrowRightIcon, PencilIcon, PublishIcon, TrashIcon, UnpublishIcon } from '@/components/icons';
import { useMe } from '@/features/auth/api';
import { canManage } from '@/features/auth/roles';
import { ApiError } from '@/lib/api';
import { publicationLabel } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useDeleteLocation, usePublishLocation, useRenameLocation } from './api';
import { InlineEditor, linkButtonClass } from './inline-editor';
import { TALE_LABELS } from './narrative';
import type { LocationEntity, LocationResource } from './resource';
import { TaleCarousel } from './tale-carousel';

type Mode = 'view' | 'rename' | 'confirm-delete';

type LocationCardProps = {
  resource: LocationResource;
  entity: LocationEntity;
  /** Enlace del pie al siguiente nivel ("Ver lugares", "Ver eventos"). */
  next: { to: string; label: string };
};

/**
 * Tarjeta de una ciudad o un lugar en el modo escritor: nombre editable en el sitio, publicar y eliminar
 * (solo su autor o un admin), y sus dos relatos en pestañas con el carrusel de extractos.
 */
export function LocationCard({ resource, entity, next }: LocationCardProps) {
  const { data: user } = useMe();
  const rename = useRenameLocation(resource);
  const publish = usePublishLocation(resource);
  const remove = useDeleteLocation(resource);
  const [mode, setMode] = useState<Mode>('view');
  const { words } = resource;

  // El server vuelve a comprobar los permisos en cada petición
  const manageable = canManage(user, entity.createdBy);
  const busy = publish.isPending || remove.isPending;
  const error = publish.error ?? remove.error;

  return (
    <Paper aria-busy={busy} className={cn('flex flex-col gap-4.5 p-8 transition-opacity', remove.isPending && 'opacity-60')}>
      <header className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        {mode === 'rename' ? (
          <InlineEditor
            label={words.nameLabel}
            initialValue={entity.name}
            className="min-w-0 flex-[1_1_200px]"
            onCancel={() => setMode('view')}
            onSubmit={async (name) => {
              if (name !== entity.name) await rename.mutateAsync({ id: entity.id, name });
              setMode('view');
            }}
          />
        ) : (
          <h2 className="min-w-0 flex-[1_1_200px] font-display text-[38px] leading-[1.05] font-semibold">{entity.name}</h2>
        )}

        {manageable && mode === 'view' && (
          <div className="-mt-0.5 -mr-2.5 ml-auto flex items-center gap-0.5">
            {busy && (
              <WritingDots
                label={`${remove.isPending ? 'Eliminando' : entity.published ? 'Despublicando' : 'Publicando'} ${entity.name}`}
                className="mr-2 text-3xl text-ink-muted"
              />
            )}
            {/* `aria-disabled` y no `disabled`: así el botón pulsado conserva el foco durante la petición */}
            <IconButton label={`Editar el nombre de ${entity.name}`} aria-disabled={busy} onClick={() => !busy && setMode('rename')}>
              <PencilIcon />
            </IconButton>
            <IconButton
              label={entity.published ? `Despublicar ${entity.name}` : `Publicar ${entity.name}`}
              aria-disabled={busy}
              onClick={() => !busy && publish.mutate({ id: entity.id, published: !entity.published })}
            >
              {entity.published ? <UnpublishIcon /> : <PublishIcon />}
            </IconButton>
            <IconButton label={`Eliminar ${entity.name}`} aria-disabled={busy} onClick={() => !busy && setMode('confirm-delete')}>
              <TrashIcon />
            </IconButton>
          </div>
        )}

        {manageable && mode === 'confirm-delete' && (
          <div className="ml-auto flex flex-wrap items-center justify-end gap-x-2.5 text-[17px]">
            <span>¿Eliminar {words.this}?</span>
            <button
              type="button"
              className={linkButtonClass}
              onClick={() => {
                setMode('view');
                remove.mutate(entity.id);
              }}
            >
              Sí, eliminar
            </button>
            <button type="button" className={linkButtonClass} autoFocus onClick={() => setMode('view')}>
              Cancelar
            </button>
          </div>
        )}
      </header>

      {error && (
        <p role="alert" className="text-base text-danger">
          {error instanceof ApiError ? error.message : 'No se pudo completar la acción'}
        </p>
      )}

      <Tabs.Root defaultValue={resource.kinds[0]} className="flex flex-col gap-4">
        <Tabs.List aria-label={`Textos de ${entity.name}`} className="flex gap-6 border-b border-ink">
          {resource.kinds.map((kind) => (
            <Tabs.Trigger
              key={kind}
              value={kind}
              className="-mb-px min-h-11 cursor-pointer border-0 border-b-2 border-transparent bg-transparent px-1 font-serif text-[19px] text-ink-muted hover:text-ink data-[state=active]:border-ink data-[state=active]:font-medium data-[state=active]:text-ink"
            >
              {TALE_LABELS[kind].tab} · {entity[kind]?.length ?? 0}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {resource.kinds.map((kind) => (
          <Tabs.Content key={kind} value={kind} className="focus-visible:outline-offset-2">
            <TaleCarousel resource={resource} entity={entity} kind={kind} />
          </Tabs.Content>
        ))}
      </Tabs.Root>

      {/* Empuja el pie abajo: así las tarjetas de una fila acaban a la misma altura aunque el nombre ocupe dos líneas */}
      <div className="flex-1" />

      <footer className="flex items-end justify-between gap-4 border-t border-ink pt-1.5">
        <Link to={next.to} className="link-underline inline-flex min-h-11 items-center gap-2 text-lg text-ink">
          {next.label}
          <ArrowRightIcon width={18} />
        </Link>
        <div className="flex flex-col gap-0.5 pb-2 text-right text-[17px] text-ink-muted">
          <em className="text-ink">{entity.createdBy ?? 'Autor desconocido'}</em>
          <span>{publicationLabel(entity.published, entity.publishDate, words.published)}</span>
        </div>
      </footer>
    </Paper>
  );
}
