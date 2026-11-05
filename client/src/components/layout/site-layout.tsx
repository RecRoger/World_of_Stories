import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

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
    <div className="flex min-h-dvh flex-col px-[clamp(20px,5vw,80px)] pt-7 pb-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col items-start">
          <Link to="/" className="font-display text-[28px] font-bold tracking-[0.01em] text-ink no-underline">
            World of Stories
          </Link>
          {brandExtra}
        </div>
        {action}
      </header>
      <main className={cn('flex flex-1 flex-col', className)}>{children}</main>
    </div>
  );
}

/** Enlace/botón subrayado de la cabecera. */
export const headerLinkClass =
  'link-underline inline-flex min-h-11 cursor-pointer items-center bg-transparent p-0 text-[19px] text-ink border-0 font-serif';
