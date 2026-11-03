import { Navigate, Outlet, useLocation } from 'react-router';
import { PageLoader } from '@/components/layout/page-loader';
import { useMe } from './api';

/** Rutas que requieren sesión: sin ella, manda a /acceso y recuerda a dónde quería ir. */
export function RequireAuth() {
  const { data: user, isPending } = useMe();
  const location = useLocation();

  if (isPending) return <PageLoader />;
  if (!user) return <Navigate to="/acceso" replace state={{ from: location.pathname }} />;
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
  return typeof from === 'string' && from.startsWith('/') ? from : '/inicio';
}
