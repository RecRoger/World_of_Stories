import { Link } from 'react-router';
import { headerLinkClass, SiteLayout } from '@/components/layout/site-layout';
import { Paper } from '@/components/ui/paper';

/** Marcador para las secciones que aún no están diseñadas. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <Paper className="flex w-[min(100%,520px)] flex-col items-center gap-4 px-10 py-14 text-center">
        <p className="text-sm tracking-[0.22em] text-ink-muted uppercase">Próximamente</p>
        <h1 className="font-display text-[52px] leading-none font-semibold text-balance">{title}</h1>
        <p className="text-xl text-ink-soft">Este capítulo aún se está escribiendo.</p>
      </Paper>
    </div>
  );
}

/** `ComingSoon` como página completa, para rutas fuera de un layout de sección. */
export function ComingSoonPage({ title }: { title: string }) {
  return (
    <SiteLayout
      action={
        <Link to="/home" className={headerLinkClass}>
          Volver
        </Link>
      }
    >
      <ComingSoon title={title} />
    </SiteLayout>
  );
}
