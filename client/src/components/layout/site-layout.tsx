import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import './site-layout.scss';

type SiteLayoutProps = {
  /** Acción de la esquina superior derecha (enlace de acceso, volver, salir…). */
  action?: ReactNode;
  /** Contenido bajo el logo (p. ej. las sugerencias de escritura en la sección de escritor). */
  brandExtra?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Marco común de las páginas: fondo pergamino, cabecera con el logo y el contenido centrado. */
export function SiteLayout({ action, brandExtra, className, children }: SiteLayoutProps) {
  return (
    <div className="site-layout">
      <header className="site-layout__header">
        <div className="site-layout__brand">
          <Link to="/" className="site-layout__logo">
            World of Stories
          </Link>
          {brandExtra}
        </div>
        {action}
      </header>
      <main className={cn('site-layout__main', className)}>{children}</main>
    </div>
  );
}

/** Enlace/botón subrayado de la cabecera. */
export const headerLinkClass = 'site-layout__link';
