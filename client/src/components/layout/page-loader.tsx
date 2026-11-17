import { WritingDots } from '@/components/ui/writing-dots';
import './page-loader.scss';

/** Pantalla de espera mientras se comprueba la sesión. */
export function PageLoader() {
  return (
    <div className="page-loader">
      <WritingDots label="Cargando" className="page-loader__dots" />
    </div>
  );
}
