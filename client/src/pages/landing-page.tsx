import { Link } from 'react-router';
import { headerLinkClass, SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import { Paper } from '@/components/ui/paper';
import { ArrowRightIcon } from '@/components/icons';
import { useMe } from '@/features/auth/api';

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
      className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] content-center items-center gap-x-16 gap-y-18 pt-14 pb-6"
    >
      <section className="flex flex-col items-start gap-7">
        <p className="text-[17px] tracking-[0.18em] text-ink-muted uppercase">Relatos de fantasía</p>
        <h1 className="font-display text-[clamp(46px,7vw,96px)] leading-[0.98] font-semibold tracking-[-0.01em] text-balance">
          Cada historia es un mundo por abrir.
        </h1>
        <p className="max-w-[30em] text-[22px] leading-normal text-pretty text-ink-soft">
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

      <div className="flex justify-center px-4 pt-2 pb-8">
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
      className="flex aspect-[3/4] w-[min(100%,380px)] -rotate-[1.5deg] flex-col gap-4.5 px-10 py-11"
    >
      <p className="text-center text-sm tracking-[0.22em] text-ink-muted uppercase">Capítulo I</p>
      <p className="text-center font-display text-[31px] leading-[1.1] font-semibold text-balance italic">
        La puerta que no estaba en el mapa
      </p>
      <hr className="h-px w-14 self-center border-0 bg-ink" />
      <p className="text-justify text-[19px] leading-[1.55] hyphens-auto">
        <span className="float-left pt-1.5 pr-2.5 font-display text-[66px] leading-[0.8] font-bold">N</span>
        adie en Valdoria recordaba quién había pintado la puerta en el muro del molino, pero esa mañana estaba
        entreabierta, y del otro lado olía a mar.
      </p>
      <div className="flex-1" />
      <p className="text-center text-base text-ink-muted">1</p>
    </Paper>
  );
}
