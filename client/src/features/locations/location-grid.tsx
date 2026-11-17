import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { WritingDots } from '@/components/ui/writing-dots';
import { ArrowLeftIcon } from '@/components/icons';
import { useBackLink } from '@/features/writer/writer-layout';
import './location-grid.scss';

type LocationGridProps = {
  isPending: boolean;
  isError: boolean;
  refetch: () => unknown;
  /** "Cargando ciudades" */
  loadingLabel: string;
  /** "No pudimos cargar las ciudades." */
  errorLabel: string;
  /** Las tarjetas y, al final, la de crear. Solo se pintan con el listado ya cargado. */
  children: ReactNode;
};

/**
 * Rejilla de tarjetas de ciudades o lugares: hasta 2 columnas (con 3 la tarjeta queda demasiado alargada) y
 * todas las filas a la altura de la más alta (`auto-rows-fr`), así todas las tarjetas miden lo mismo.
 * Mientras carga, el loader va centrado en el ancho de la página.
 */
export function LocationGrid({ isPending, isError, refetch, loadingLabel, errorLabel, children }: LocationGridProps) {
  if (isPending) {
    return (
      <div className="location-grid__loading">
        <WritingDots label={loadingLabel} className="location-grid__dots" />
      </div>
    );
  }
  if (isError) {
    return (
      <div role="alert" className="location-grid__error">
        <p>{errorLabel}</p>
        <button type="button" onClick={() => refetch()} className="location-grid__retry">
          Reintentar
        </button>
      </div>
    );
  }
  return <div className="location-grid">{children}</div>;
}

/** Cabecera de las páginas de la sección de escritor: "Sección de escritor" o el enlace de vuelta, y el título. */
export function WriterPageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  const back = useBackLink();
  return (
    <div className="location-grid__heading">
      {/* En Ciudades (la portada de la sección) va el rótulo; en las demás, el enlace de vuelta en su lugar */}
      {back ? (
        <Link
          to={back.to}
          className="location-grid__back"
        >
          <ArrowLeftIcon />
          <span className="link-underline">{back.label}</span>
        </Link>
      ) : (
        <p className="location-grid__eyebrow">Sección de escritor</p>
      )}
      <h1 className="location-grid__title">{title}</h1>
      {subtitle && <p className="location-grid__subtitle">{subtitle}</p>}
    </div>
  );
}
