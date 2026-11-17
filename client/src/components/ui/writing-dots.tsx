import { cn } from '@/lib/utils';
import './writing-dots.scss';

type WritingDotsProps = {
  /**
   * Qué se está esperando, para lectores de pantalla (p. ej. "Cargando ciudades").
   * Sin `label` es decorativo: úsalo así cuando el texto de al lado ya lo dice (p. ej. un botón "Entrando").
   */
  label?: string;
  /** Aparece tras 300 ms para no parpadear en peticiones rápidas. `false` lo muestra al instante. */
  delayed?: boolean;
  className?: string;
};

/**
 * Loader de la casa: tres puntos suspensivos que se van escribiendo (". . .") seguidos del cursor
 * parpadeante de un campo de texto, que avanza con cada punto.
 * Hereda tamaño y color del texto, así que se escala y se tiñe con `font-size` y `color` desde fuera.
 * Con movimiento reducido se queda quieto: los tres puntos y el cursor fijo.
 */
export function WritingDots({ label, delayed = true, className }: WritingDotsProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
      data-slot="writing-dots"
      className={cn('writing-dots', delayed && 'writing-dots--delayed', className)}
    >
      <span aria-hidden="true" className="writing-dots__dots">
        <span className="writing-dots__dot">.</span>
        <span className="writing-dots__dot">.</span>
        <span className="writing-dots__dot">.</span>
      </span>
      <span aria-hidden="true" className="writing-dots__caret" />
      {label && <span className="visually-hidden">{label}</span>}
    </span>
  );
}
