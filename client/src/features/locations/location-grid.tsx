import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { WritingDots } from '@/components/ui/writing-dots';
import { ArrowLeftIcon } from '@/components/icons';
import { useBackLink } from '@/features/writer/writer-layout';

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
      <div className="flex min-h-[360px] items-center justify-center">
        <WritingDots label={loadingLabel} className="text-6xl text-ink-muted" />
      </div>
    );
  }
  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3 text-xl">
        <p>{errorLabel}</p>
        <button type="button" onClick={() => refetch()} className="link-underline cursor-pointer border-0 bg-transparent p-0 font-serif text-xl">
          Reintentar
        </button>
      </div>
    );
  }
  return <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(min(420px,100%),1fr))] gap-x-10 gap-y-14">{children}</div>;
}

/** Cabecera de las páginas de la sección de escritor: "Sección de escritor" o el enlace de vuelta, y el título. */
export function WriterPageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  const back = useBackLink();
  return (
    <div className="flex flex-col items-start gap-3">
      {/* En Ciudades (la portada de la sección) va el rótulo; en las demás, el enlace de vuelta en su lugar */}
      {back ? (
        <Link
          to={back.to}
          className="-my-2 inline-flex min-h-11 items-center gap-2.5 text-[19px] text-ink no-underline transition-transform hover:-translate-x-0.5"
        >
          <ArrowLeftIcon />
          <span className="link-underline">{back.label}</span>
        </Link>
      ) : (
        <p className="text-[17px] tracking-[0.18em] text-ink-muted uppercase">Sección de escritor</p>
      )}
      <h1 className="font-display text-[clamp(42px,6vw,72px)] leading-none font-semibold">{title}</h1>
      {subtitle && <p className="font-display text-2xl text-ink-muted italic">{subtitle}</p>}
    </div>
  );
}
