import { Link } from 'react-router';
import { headerLinkClass, SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import { Paper } from '@/components/ui/paper';
import { ArrowRightIcon } from '@/components/icons';
import { useMe } from '@/features/auth/api';
import './landing-page.scss';

/** 1 · Landing: presentación y entrada. Con sesión, los enlaces llevan directo a elegir. */
export function LandingPage() {
  const { data: user } = useMe();
  const next = user ? '/home' : '/access';

  return (
    <SiteLayout
      action={
        <Link to={next} className={headerLinkClass}>
          {user ? `Hola, ${user.username}` : 'Iniciar sesión'}
        </Link>
      }
      className="landing-page"
    >
      <section className="landing-page__intro">
        <p className="landing-page__eyebrow">Relatos de fantasía</p>
        <h1 className="landing-page__title">
          Cada historia es un mundo por abrir.
        </h1>
        <p className="landing-page__lead">
          Escribe tus propias aventuras, o piérdete en las de otros. World of Stories reúne a quienes inventan reinos y
          a quienes los recorren.
        </p>
        <Button asChild>
          <Link to={next}>
            {user ? 'Continuar' : 'Entrar'}
            <ArrowRightIcon />
          </Link>
        </Button>
      </section>

      <div className="landing-page__showcase">
        <FirstPage />
      </div>
    </SiteLayout>
  );
}

/** Página de muestra: el primer capítulo de una historia, ligeramente girada sobre la mesa. */
function FirstPage() {
  return (
    <Paper
      aria-label="Ejemplo de capítulo"
      role="figure"
      className="landing-page__page"
    >
      <p className="landing-page__chapter">Capítulo I</p>
      <p className="landing-page__page-title">
        La puerta que no estaba en el mapa
      </p>
      <hr className="landing-page__rule" />
      <p className="landing-page__page-text">
        <span className="landing-page__drop-cap">N</span>
        adie en Valdoria recordaba quién había pintado la puerta en el muro del molino, pero esa mañana estaba
        entreabierta, y del otro lado olía a mar.
      </p>
      <div className="landing-page__spacer" />
      <p className="landing-page__page-number">1</p>
    </Paper>
  );
}
