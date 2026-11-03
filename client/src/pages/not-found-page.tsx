import { Link } from 'react-router';
import { SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <SiteLayout className="items-center justify-center gap-6 text-center">
      <h1 className="font-display text-[clamp(40px,6vw,72px)] leading-none font-semibold">Esta página no está en el mapa</h1>
      <p className="text-xl text-ink-muted">Quizá el camino cambió desde la última vez.</p>
      <Button asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </SiteLayout>
  );
}
