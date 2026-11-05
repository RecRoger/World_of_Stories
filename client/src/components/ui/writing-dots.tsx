import { cn } from '@/lib/utils';

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
 * Hereda tamaño y color del texto, así que se escala y se tiñe con clases `text-*`.
 * Con movimiento reducido se queda quieto: los tres puntos y el cursor fijo.
 */
export function WritingDots({ label, delayed = true, className }: WritingDotsProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
      data-slot="writing-dots"
      className={cn('inline-flex items-baseline leading-none', delayed && 'animate-appear-late', className)}
    >
      {/* Cada punto ocupa una celda fija de 0.5em: el ancho total (--dots-width) es lo que se "escribe" */}
      <span
        aria-hidden="true"
        className="inline-flex w-(--dots-width) overflow-hidden font-display font-bold whitespace-nowrap [--dots-width:1.5em] animate-write-dots motion-reduce:animate-none"
      >
        <span className="w-[0.5em] shrink-0">.</span>
        <span className="w-[0.5em] shrink-0">.</span>
        <span className="w-[0.5em] shrink-0">.</span>
      </span>
      <span
        aria-hidden="true"
        className="inline-block h-[0.8em] w-[0.07em] min-w-px bg-current animate-caret-blink motion-reduce:animate-none"
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
