import { Link } from 'react-router';
import { SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import './not-found-page.scss';

export function NotFoundPage() {
  return (
    <SiteLayout className="not-found-page">
      <h1 className="not-found-page__title">Esta página no está en el mapa</h1>
      <p className="not-found-page__text">Quizá el camino cambió desde la última vez.</p>
      <Button asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </SiteLayout>
  );
}
