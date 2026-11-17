import type { Character } from '@wos/shared';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { BagIcon } from '@/components/icons';
import { formatMoney } from '@/lib/format';
import { readerLinkClass } from './reader-layout';
import './inventory-dialog.scss';

/**
 * Botón de la bolsa en la cabecera de lectura: abre el inventario como una hoja que sube desde abajo, igual que el
 * panel de opciones (con su dinero y los objetos que lleva). Es un diálogo modal: atrapa el foco y cierra con Escape,
 * con "Cerrar" o pulsando fuera.
 */
/** Aviso breve bajo la bolsa: lo que se acaba de pagar o ganar (`id` distingue dos avisos seguidos iguales) */
export type InventoryNotice = { text: string; kind: 'debit' | 'gain'; id: number };

export function InventoryDialog({ character, notice }: { character: Character; notice?: InventoryNotice | null }) {
  return (
    <DialogPrimitive.Root>
      <span className="inventory__anchor">
        <DialogPrimitive.Trigger className="inventory__trigger" aria-label="Abrir inventario" title="Inventario">
          <BagIcon />
        </DialogPrimitive.Trigger>
        {/* Aviso de lo que se acaba de pagar o ganar, bajo la bolsa (lo anuncia también el lector de pantalla) */}
        <span role="status" className="inventory__notice-status">
          {notice && (
            <span key={notice.id} className={`inventory__notice inventory__notice--${notice.kind}`}>
              {notice.text}
            </span>
          )}
        </span>
      </span>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="inventory__scrim" />
        <DialogPrimitive.Content className="inventory" aria-describedby={undefined}>
          <div className="inventory__inner">
            <div className="inventory__header">
              <DialogPrimitive.Title className="inventory__title">Inventario</DialogPrimitive.Title>
              <DialogPrimitive.Close className={readerLinkClass}>Cerrar</DialogPrimitive.Close>
            </div>

            <div className="inventory__money">
              <span className="inventory__label">Dinero guardado</span>
              <span className="inventory__amount">{formatMoney(character.money)}</span>
            </div>

            <div className="inventory__label inventory__items-title">Objetos recopilados</div>
            <div className="inventory__items">
              {character.items.length ? (
                character.items.map((item, i) => (
                  <div key={`${item}-${i}`} className="inventory__item">
                    {item}
                  </div>
                ))
              ) : (
                <p className="inventory__empty">Aún no has recopilado objetos.</p>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
