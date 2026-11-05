import { useNavigate } from 'react-router';
import { headerLinkClass } from '@/components/layout/site-layout';
import { useLogout } from './api';

export function LogoutButton() {
  const logout = useLogout();
  const navigate = useNavigate();

  // Primero se sale de la ruta protegida; si no, `RequireAuth` mandaría a /access al borrarse la sesión
  const onLogout = () => {
    navigate('/', { replace: true });
    logout.mutate();
  };

  return (
    <button type="button" onClick={onLogout} disabled={logout.isPending} className={headerLinkClass}>
      Salir
    </button>
  );
}
