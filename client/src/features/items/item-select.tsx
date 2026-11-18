import { useState } from 'react';
import type { Item } from '@wos/shared';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useItems } from './api';
import './item-select.scss';

/** Sin mayúsculas ni acentos, para buscar «brujula» y encontrar «Brújula» */
export const foldName = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

const label = (i: Item) => `${i.name} · ${i.stackable ? 'común' : 'único'}`;

type ItemSelectProps = {
  /** id del <select> (el que nombra la etiqueta del campo) */
  id: string;
  value: string;
  onChange: (itemId: string) => void;
  /** Objetos que no se ofrecen (p. ej. los que ya están en la lista) */
  exclude?: string[];
  placeholder?: string;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

/**
 * Selector de un objeto del catálogo con buscador: el texto filtra por nombre (sin mayúsculas ni acentos) las opciones
 * del select. El elegido siempre sigue en la lista, aunque no coincida con la búsqueda.
 */
export function ItemSelect({ id, value, onChange, exclude = [], placeholder = 'Elige un objeto…', className, ...a11y }: ItemSelectProps) {
  const { data: items, isPending } = useItems();
  const [query, setQuery] = useState('');
  const shown = (items ?? []).filter(
    (i) => i.id === value || (!exclude.includes(i.id) && foldName(i.name).includes(foldName(query))),
  );

  return (
    <div className={cn('item-select', className)}>
      <Input
        type="search"
        autoComplete="off"
        aria-label="Buscar objeto por nombre"
        aria-controls={id}
        placeholder="Buscar objeto…"
        value={query}
        onChange={(e) => {
          const q = e.target.value;
          setQuery(q);
          // si la búsqueda deja un único objeto posible, se elige solo
          const matches = (items ?? []).filter((i) => !exclude.includes(i.id) && foldName(i.name).includes(foldName(q)));
          if (q.trim() && matches.length === 1) onChange(matches[0]!.id);
        }}
        className="item-select__search"
      />
      <Select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="item-select__select" {...a11y}>
        <option value="">{isPending ? 'Cargando objetos…' : shown.length ? placeholder : 'Ningún objeto coincide'}</option>
        {shown.map((i) => (
          <option key={i.id} value={i.id}>
            {label(i)}
          </option>
        ))}
      </Select>
    </div>
  );
}
