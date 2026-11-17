import type { ComponentType, SVGProps } from 'react';
import { Link } from 'react-router';
import { SiteLayout } from '@/components/layout/site-layout';
import { ArrowRightIcon, BookIcon, QuillIcon } from '@/components/icons';
import { LogoutButton } from '@/features/auth/logout-button';
import './choose-page.scss';

/** 3 · Leer o escribir: el reparto tras iniciar sesión. */
export function ChoosePage() {
  return (
    <SiteLayout
      action={<LogoutButton />}
      className="choose-page"
    >
      <div className="choose-page__heading">
        <h1 className="choose-page__title">¿Qué te trae hoy?</h1>
        <p className="choose-page__subtitle">Elige cómo quieres entrar al mundo.</p>
      </div>

      <div className="choose-page__choices">
        <ChoiceCard
          to="/read"
          icon={BookIcon}
          title="Leer"
          description="Descubre historias de fantasía escritas por otros aficionados."
        />
        <ChoiceCard
          to="/write"
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
      className="choose-page__card"
    >
      <Icon />
      <h2 className="choose-page__card-title">{title}</h2>
      <p className="choose-page__card-text">{description}</p>
      <div className="choose-page__spacer" />
      <span className="choose-page__card-link">
        Continuar
        <ArrowRightIcon />
      </span>
    </Link>
  );
}
