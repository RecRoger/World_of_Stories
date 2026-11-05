import { Navigate, Outlet, useLocation } from 'react-router';
import { PageLoader } from '@/components/layout/page-loader';
import { useMe } from './api';
import { isWriter } from './roles';

/** Rutas que requieren sesión: sin ella, manda a /access y recuerda a dónde quería ir. */
export function RequireAuth() {
  const { data: user, isPending } = useMe();
  const location = useLocation();

  if (isPending) return <PageLoader />;
  if (!user) return <Navigate to="/access" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

/** Sección de escritor (dentro de `RequireAuth`): sin el rol, pasa por la solicitud con código de invitación. */
export function RequireWriter() {
  const { data: user } = useMe();
  if (!isWriter(user)) return <Navigate to="/write/join" replace />;
  return <Outlet />;
}

/**
 * Rutas solo para visitantes (acceso). Con sesión, pasa a donde quería ir o a elegir.
 * También es lo que redirige tras un login/registro correcto, al actualizarse la caché de `useMe`.
 */
export function GuestOnly() {
  const { data: user, isPending } = useMe();
  const location = useLocation();

  if (isPending) return <PageLoader />;
  if (user) return <Navigate to={redirectTarget(location.state)} replace />;
  return <Outlet />;
}

function redirectTarget(state: unknown) {
  const from = (state as { from?: unknown } | null)?.from;
  return typeof from === 'string' && from.startsWith('/') ? from : '/home';
}
