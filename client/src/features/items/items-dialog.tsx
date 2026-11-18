import { useId, useState, type FormEvent } from 'react';
import type { Item } from '@wos/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WritingDots } from '@/components/ui/writing-dots';
import { FormField } from '@/components/form/form-field';
import { BagIcon, PencilIcon, TrashIcon } from '@/components/icons';
import { useMe } from '@/features/auth/api';
import { canManage } from '@/features/auth/roles';
import { linkButtonClass } from '@/features/locations/inline-editor';
import { ApiError } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useCreateItem, useDeleteItem, useItems, useUpdateItem } from './api';
import './items-dialog.scss';

/** Sin mayúsculas ni acentos, para buscar «brujula» y encontrar «Brújula» */
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

/**
 * "Ver objetos" de la sección de escritor: un modal con el catálogo de objetos, un buscador por nombre y, en la misma
 * lista, crear, editar y eliminar (editar y eliminar, solo su autor o un admin).
 */
export function ItemsDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="items-dialog__trigger">
          <BagIcon width={20} height={20} />
          <span className="link-underline">Ver objetos</span>
        </button>
      </DialogTrigger>
      <DialogContent className="items-dialog">{open && <ItemsCatalog />}</DialogContent>
    </Dialog>
  );
}

/** Qué fila está en edición o pidiendo confirmación para borrar, o si se está creando uno nuevo */
type Mode = { kind: 'list' } | { kind: 'new' } | { kind: 'edit'; id: string } | { kind: 'confirm'; id: string };

function ItemsCatalog() {
  const { data: items, isPending, isError, refetch } = useItems();
  const { data: me } = useMe();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const searchId = useId();
  const list = () => setMode({ kind: 'list' });

  const shown = (items ?? []).filter((i) => fold(i.name).includes(fold(query)));

  return (
    <>
      <div className="items-dialog__top">
        <DialogTitle>Objetos</DialogTitle>
        <DialogDescription>Todos los objetos creados para la historia.</DialogDescription>
        <FormField id={searchId} label="Buscar por nombre" labelClassName="visually-hidden">
          {(a11y) => (
            <Input
              id={searchId}
              type="search"
              autoComplete="off"
              placeholder="Buscar por nombre…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              {...a11y}
            />
          )}
        </FormField>
      </div>

      {/* Solo la lista se desplaza: el título y el buscador quedan siempre a la vista */}
      <div className="items-dialog__scroll">
        {isPending ? (
          <div className="items-dialog__loading">
            <WritingDots label="Cargando objetos" className="items-dialog__dots" />
          </div>
        ) : isError ? (
          <div role="alert" className="items-dialog__empty">
            No pudimos cargar los objetos.{' '}
            <button type="button" className={linkButtonClass} onClick={() => refetch()}>
              Reintentar
            </button>
          </div>
        ) : (
          <ul className="items-dialog__list">
            {!items.length && <li className="items-dialog__empty">Aún no hay objetos creados.</li>}
            {!!items.length && !shown.length && (
              <li className="items-dialog__empty">Ningún objeto coincide con «{query.trim()}».</li>
            )}
            {shown.map((item) => (
              <li key={item.id} className="items-dialog__item">
                {mode.kind === 'edit' && mode.id === item.id ? (
                  <ItemForm item={item} onDone={list} />
                ) : mode.kind === 'confirm' && mode.id === item.id ? (
                  <ConfirmDelete item={item} onDone={list} />
                ) : (
                  <ItemRow
                    item={item}
                    canManage={canManage(me, item.author)}
                    onEdit={() => setMode({ kind: 'edit', id: item.id })}
                    onDelete={() => setMode({ kind: 'confirm', id: item.id })}
                  />
                )}
              </li>
            ))}
            <li className="items-dialog__item items-dialog__new">
              {mode.kind === 'new' ? (
                <ItemForm onDone={list} />
              ) : (
                <button
                  type="button"
                  className={cn(linkButtonClass, 'items-dialog__create')}
                  onClick={() => setMode({ kind: 'new' })}
                >
                  + Crear nuevo objeto
                </button>
              )}
            </li>
          </ul>
        )}
      </div>
    </>
  );
}

function ItemRow({
  item,
  canManage,
  onEdit,
  onDelete,
}: {
  item: Item;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="items-dialog__row">
      <div className="items-dialog__text">
        <span className="items-dialog__name">{item.name}</span>
        {item.description && <span className="items-dialog__description">{item.description}</span>}
        <span className="items-dialog__meta">
          <span className="items-dialog__price">{formatMoney(item.price)}</span>
          <span className={cn('items-dialog__kind', item.stackable && 'items-dialog__kind--common')}>
            {item.stackable ? 'Elemento común' : 'Objeto único'}
          </span>
        </span>
        <span className="items-dialog__author">
          Por <em>{item.author}</em>
        </span>
      </div>
      {canManage && (
        <div className="items-dialog__actions">
          <IconButton label={`Editar ${item.name}`} onClick={onEdit}>
            <PencilIcon />
          </IconButton>
          <IconButton label={`Eliminar ${item.name}`} onClick={onDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
}

function ConfirmDelete({ item, onDone }: { item: Item; onDone: () => void }) {
  const remove = useDeleteItem();
  return (
    <div className="items-dialog__confirm">
      <span>¿Eliminar «{item.name}»?</span>
      <span className="items-dialog__confirm-actions">
        <button
          type="button"
          className={linkButtonClass}
          disabled={remove.isPending}
          autoFocus
          onClick={() => remove.mutate(item.id, { onSuccess: onDone })}
        >
          {remove.isPending ? 'Eliminando…' : 'Sí, eliminar'}
        </button>
        <button type="button" className={linkButtonClass} disabled={remove.isPending} onClick={onDone}>
          Cancelar
        </button>
      </span>
      {remove.error && (
        <p role="alert" className="items-dialog__error">
          {remove.error instanceof ApiError ? remove.error.message : 'No se pudo eliminar el objeto'}
        </p>
      )}
    </div>
  );
}

/** Crear (sin `item`) o editar un objeto: nombre y precio en monedas */
function ItemForm({ item, onDone }: { item?: Item; onDone: () => void }) {
  const create = useCreateItem();
  const update = useUpdateItem();
  const [name, setName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [price, setPrice] = useState(item ? String(item.price) : '');
  const [stackable, setStackable] = useState(item?.stackable ?? false);
  const id = useId();
  const saving = create.isPending || update.isPending;
  const error = create.error ?? update.error;
  const priceOk = /^\d+$/.test(price.trim());
  const invalid = !name.trim() || !priceOk;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (invalid || saving) return;
    const body = { name: name.trim(), description: description.trim(), price: Number(price.trim()), stackable };
    if (item) update.mutate({ id: item.id, body }, { onSuccess: onDone });
    else create.mutate(body, { onSuccess: onDone });
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={saving} className="items-dialog__form">
      {!item && <p className="items-dialog__form-title">Nuevo objeto</p>}
      <FormField id={`${id}-name`} label="Nombre">
        {(a11y) => (
          <Input
            id={`${id}-name`}
            autoComplete="off"
            autoFocus
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            {...a11y}
          />
        )}
      </FormField>
      <FormField id={`${id}-description`} label="Descripción (opcional)">
        {(a11y) => (
          <Textarea
            id={`${id}-description`}
            rows={2}
            maxLength={300}
            className="items-dialog__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            {...a11y}
          />
        )}
      </FormField>
      <FormField
        id={`${id}-price`}
        label="Precio (monedas)"
        error={price.trim() && !priceOk ? 'Un número entero de monedas' : undefined}
      >
        {(a11y) => (
          <Input
            id={`${id}-price`}
            inputMode="numeric"
            autoComplete="off"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            {...a11y}
          />
        )}
      </FormField>
      <label className="items-dialog__check">
        <input type="checkbox" checked={stackable} onChange={(e) => setStackable(e.target.checked)} />
        <span>
          Elemento común
          <span className="items-dialog__check-hint">Se puede tener varias veces. Si no, es un objeto único.</span>
        </span>
      </label>
      {error && (
        <p role="alert" className="items-dialog__error">
          {error instanceof ApiError ? error.message : 'No se pudo guardar el objeto'}
        </p>
      )}
      <div className="items-dialog__form-actions">
        <Button type="submit" size="md" loading={saving} disabled={invalid}>
          Aceptar
        </Button>
        <button type="button" className={linkButtonClass} disabled={saving} onClick={onDone}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
