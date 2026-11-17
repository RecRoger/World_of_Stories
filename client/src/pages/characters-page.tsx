import { Link, useNavigate } from 'react-router';
import type { Character, Whereabouts } from '@wos/shared';
import { ArrowRightIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { WritingDots } from '@/components/ui/writing-dots';
import { ReaderLayout, readerLinkClass } from '@/features/reader/reader-layout';
import { useCharacters, useCreateCharacter } from '@/features/reader/api';
import { ApiError } from '@/lib/api';
import './characters-page.scss';

const KIND_LABELS: Record<Whereabouts['kind'], string> = {
  city: 'Ciudad',
  place: 'Lugar',
  npc: 'Encuentro',
  chapter: 'Capítulo',
};

/** Lector · Tus personajes: retomar una aventura o empezar una nueva. */
export function CharactersPage() {
  const { data: characters, isPending, isError, refetch } = useCharacters();
  const create = useCreateCharacter();
  const navigate = useNavigate();
  // Un personaje nuevo no necesita nombre: se crea y pasa directo a elegir ciudad
  const onCreate = () => create.mutate(undefined, { onSuccess: (character) => navigate(`/read/${character.id}`) });

  return (
    <ReaderLayout
      action={
        <Link to="/home" className={readerLinkClass}>
          Salir
        </Link>
      }
      className="characters-page"
    >
      <div className="characters-page__heading">
        <h1 className="characters-page__title">Tus personajes</h1>
        <p className="characters-page__subtitle">Retoma una aventura donde la dejaste o comienza una nueva.</p>
      </div>

      {isPending ? (
        <div className="characters-page__loading">
          <WritingDots label="Cargando tus personajes" className="characters-page__dots" />
        </div>
      ) : isError ? (
        <div role="alert" className="characters-page__error">
          <p>No pudimos cargar tus personajes.</p>
          <button type="button" onClick={() => refetch()} className={readerLinkClass}>
            Reintentar
          </button>
        </div>
      ) : (
        <>
          {characters.length ? (
            <nav aria-label="Tus personajes" className="characters-page__list">
              {characters.map((c) => (
                <CharacterRow key={c.id} character={c} />
              ))}
            </nav>
          ) : (
            <p className="characters-page__empty">Aún no tienes personajes. Crea uno para empezar a leer.</p>
          )}
          <div className="characters-page__create">
            <Button className="characters-page__create-button" onClick={onCreate} loading={create.isPending}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                <path d="M8 2v12M2 8h12" />
              </svg>
              Crear nuevo personaje
            </Button>
            {create.error && (
              <p role="alert" className="characters-page__create-error">
                {create.error instanceof ApiError ? create.error.message : 'No se pudo crear el personaje'}
              </p>
            )}
          </div>
        </>
      )}
    </ReaderLayout>
  );
}

function CharacterRow({ character }: { character: Character }) {
  const where = character.whereabouts;
  const title = where
    ? { city: where.city, place: where.place, npc: where.npc, chapter: where.chapter }[where.kind]
    : 'Aún no ha viajado';
  return (
    <Link
      to={`/read/${character.id}`}
      aria-label={`Continuar en ${title}`}
      className="characters-page__character"
    >
      <span className="characters-page__character-text">
        {/* Los personajes no tienen nombre: se distinguen por su ubicación */}
        <span className="characters-page__kind">
          <em>{where ? KIND_LABELS[where.kind] : 'Nuevo personaje'}</em>
        </span>
        <span className="characters-page__where">{title}</span>
        {where && where.kind !== 'city' && <span className="characters-page__place">Ciudad: {where.city}</span>}
        {where?.place && where.kind !== 'place' && <span className="characters-page__place">Lugar: {where.place}</span>}
      </span>
      <ArrowRightIcon className="characters-page__arrow" />
    </Link>
  );
}
