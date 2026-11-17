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
import './location-card.scss';

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
    <Paper aria-busy={busy} className={cn('location-card', remove.isPending && 'location-card--busy')}>
      <header className="location-card__header">
        {mode === 'rename' ? (
          <InlineEditor
            label={words.nameLabel}
            initialValue={entity.name}
            className="location-card__rename"
            onCancel={() => setMode('view')}
            onSubmit={async (name) => {
              if (name !== entity.name) await rename.mutateAsync({ id: entity.id, name });
              setMode('view');
            }}
          />
        ) : (
          <h2 className="location-card__name">{entity.name}</h2>
        )}

        {manageable && mode === 'view' && (
          <div className="location-card__tools">
            {busy && (
              <WritingDots
                label={`${remove.isPending ? 'Eliminando' : entity.published ? 'Despublicando' : 'Publicando'} ${entity.name}`}
                className="location-card__dots"
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
          <div className="location-card__confirm">
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
        <p role="alert" className="location-card__error">
          {error instanceof ApiError ? error.message : 'No se pudo completar la acción'}
        </p>
      )}

      <Tabs.Root defaultValue={resource.kinds[0]} className="location-card__tabs">
        <Tabs.List aria-label={`Textos de ${entity.name}`} className="location-card__tab-list">
          {resource.kinds.map((kind) => (
            <Tabs.Trigger
              key={kind}
              value={kind}
              className="location-card__tab"
            >
              {TALE_LABELS[kind].tab} · {entity[kind]?.length ?? 0}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {resource.kinds.map((kind) => (
          <Tabs.Content key={kind} value={kind} className="location-card__tab-panel">
            <TaleCarousel resource={resource} entity={entity} kind={kind} />
          </Tabs.Content>
        ))}
      </Tabs.Root>

      {/* Empuja el pie abajo: así las tarjetas de una fila acaban a la misma altura aunque el nombre ocupe dos líneas */}
      <div className="location-card__spacer" />

      <footer className="location-card__footer">
        <Link to={next.to} className="location-card__next">
          {next.label}
          <ArrowRightIcon width={18} />
        </Link>
        <div className="location-card__credits">
          <em className="location-card__author">{entity.createdBy ?? 'Autor desconocido'}</em>
          <span>{publicationLabel(entity.published, entity.publishDate, words.published)}</span>
        </div>
      </footer>
    </Paper>
  );
}
