import { Link, Outlet, useMatches } from 'react-router';
import { headerLinkClass, SiteLayout } from '@/components/layout/site-layout';
import { LogoutButton } from '@/features/auth/logout-button';
import { WritingGuidelines } from './writing-guidelines';

/**
 * Lo que una ruta de escritor declara en su `handle`: el enlace de vuelta de la página (p. ej. "Volver a Ciudades"),
 * calculado con los parámetros de la ruta. Lo pinta `WriterPageHeading` en lugar de "Sección de escritor".
 */
export type WriterRouteHandle = { back?: (params: Record<string, string | undefined>) => { to: string; label: string } };

/** Enlace de vuelta de la ruta actual (el de la ruta más profunda que lo declare), o `undefined`. */
export function useBackLink() {
  const match = useMatches().findLast((m) => (m.handle as WriterRouteHandle | undefined)?.back);
  return match && (match.handle as Required<WriterRouteHandle>).back(match.params);
}

/** Marco de la sección de escritor: todas sus pantallas comparten las sugerencias de escritura y la navegación. */
export function WriterLayout() {
  return (
    <SiteLayout
      brandExtra={<WritingGuidelines />}
      action={
        <nav aria-label="Sección" className="flex flex-wrap justify-end gap-x-7 gap-y-2">
          <Link to="/home" className={headerLinkClass}>
            Cambiar de sección
          </Link>
          <LogoutButton />
        </nav>
      }
    >
      <Outlet />
    </SiteLayout>
  );
}
