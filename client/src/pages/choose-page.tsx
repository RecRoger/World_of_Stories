import type { ComponentType, SVGProps } from 'react';
import { Link, useNavigate } from 'react-router';
import { headerLinkClass, SiteLayout } from '@/components/layout/site-layout';
import { ArrowRightIcon, BookIcon, QuillIcon } from '@/components/icons';
import { useLogout } from '@/features/auth/api';

/** 3 · Leer o escribir: el reparto tras iniciar sesión. */
export function ChoosePage() {
  const logout = useLogout();
  const navigate = useNavigate();

  // Primero se sale de la ruta protegida; si no, `RequireAuth` mandaría a /acceso al borrarse la sesión
  const onLogout = () => {
    navigate('/', { replace: true });
    logout.mutate();
  };

  return (
    <SiteLayout
      action={
        <button type="button" onClick={onLogout} disabled={logout.isPending} className={headerLinkClass}>
          Salir
        </button>
      }
      className="items-center justify-center gap-14 pt-10 pb-8"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-none font-semibold text-balance">¿Qué te trae hoy?</h1>
        <p className="text-[21px] leading-[1.45] text-ink-muted">Elige cómo quieres entrar al mundo.</p>
      </div>

      <div className="grid w-full max-w-[900px] grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-x-12 gap-y-14">
        <ChoiceCard
          to="/leer"
          icon={BookIcon}
          title="Leer"
          description="Descubre historias de fantasía escritas por otros aficionados."
        />
        <ChoiceCard
          to="/escribir"
          icon={QuillIcon}
          title="Escribir"
          description="Crea tu propio mundo y dale vida, capítulo a capítulo."
        />
      </div>
    </SiteLayout>
  );
}

type ChoiceCardProps = {
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

function ChoiceCard({ to, icon: Icon, title, description }: ChoiceCardProps) {
  return (
    <Link
      to={to}
      className="box-border flex min-h-[340px] flex-col gap-5 bg-paper p-10 text-ink no-underline shadow-paper transition-transform duration-250 hover:-translate-y-1.5"
    >
      <Icon />
      <h2 className="font-display text-[52px] leading-none font-semibold">{title}</h2>
      <p className="text-xl leading-normal text-pretty text-ink-soft">{description}</p>
      <div className="flex-1" />
      <span className="flex items-center gap-3 text-[19px]">
        Continuar
        <ArrowRightIcon />
      </span>
    </Link>
  );
}
