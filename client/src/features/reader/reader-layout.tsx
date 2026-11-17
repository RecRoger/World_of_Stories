import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import './reader-layout.scss';

/** Enlace/botón subrayado de la sección de lectura (volver, reintentar, saltar animación…). */
export const readerLinkClass = 'reader-layout__link';

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
    // overflow-x: clip: los diálogos entran deslizándose desde fuera de la columna sin crear scroll horizontal
    <div className="reader-layout">
      <div className={cn('reader-layout__column', !panel && 'reader-layout__column--no-panel')}>
        <header className="reader-layout__header">
          <Link to="/" className="reader-layout__logo">
            World of Stories
          </Link>
          {action}
        </header>
        <main className={cn('reader-layout__main', className)}>{children}</main>
      </div>
      {/* Fuera de la columna: el panel ocupa todo el ancho de la pantalla (su contenido sigue alineado con la columna) */}
      {panel && <div className="reader-layout__dock">{panel}</div>}
    </div>
  );
}

/** Enlace "← Volver a …" de la sección de lectura. */
export function ReaderBackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="reader-layout__back">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="reader-layout__back-arrow">
        <path d="M19 6H2M7 1L2 6l5 5" />
      </svg>
      <span className="link-underline">{children}</span>
    </Link>
  );
}
