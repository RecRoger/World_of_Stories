import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

/** Ancho fijo de la sección de lectura: está pensada para el móvil y en tablet y escritorio se ve igual. */
export const READER_WIDTH = 'max-w-[440px]';

export const readerLinkClass =
  'link-underline inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 font-serif text-lg text-ink';

type ReaderLayoutProps = {
  /** Enlace de la esquina superior derecha. */
  action: ReactNode;
  /** Panel que queda fijo abajo (las opciones para continuar la lectura). */
  panel?: ReactNode;
  className?: string;
  children: ReactNode;
};

/**
 * Marco de la sección de lectura: todo pergamino, con el texto en una columna central del ancho de un móvil.
 * La barra de scroll vertical está siempre: así el texto no salta de lado cuando aparece o desaparece
 * (al escribirse el texto o subir el panel de opciones).
 */
export function ReaderLayout({ action, panel, className, children }: ReaderLayoutProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.overflowY = 'scroll';
    return () => {
      root.style.overflowY = '';
    };
  }, []);

  return (
    // overflow-x-clip: los diálogos entran deslizándose desde fuera de la columna sin crear scroll horizontal
    <div className="min-h-dvh overflow-x-clip bg-parchment">
      <div className={cn('mx-auto flex min-h-dvh w-full flex-col px-5 pt-4', READER_WIDTH, !panel && 'pb-14')}>
        <header className="flex flex-wrap items-center justify-between gap-x-5">
          <Link to="/" className="inline-flex min-h-11 items-center font-display text-[26px] font-bold tracking-[0.01em] text-ink no-underline">
            World of Stories
          </Link>
          {action}
        </header>
        <main className={cn('flex flex-1 flex-col', className)}>{children}</main>
        {panel}
      </div>
    </div>
  );
}

/** Enlace "← Volver a …" de la sección de lectura. */
export function ReaderBackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="group inline-flex min-h-11 items-center gap-2.5 self-start text-lg text-ink no-underline">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform group-hover:-translate-x-0.5">
        <path d="M19 6H2M7 1L2 6l5 5" />
      </svg>
      <span className="link-underline">{children}</span>
    </Link>
  );
}
