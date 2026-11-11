import { Link, useNavigate } from 'react-router';
import type { Character, Whereabouts } from '@wos/shared';
import { ArrowRightIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { WritingDots } from '@/components/ui/writing-dots';
import { ReaderLayout, readerLinkClass } from '@/features/reader/reader-layout';
import { useCharacters, useCreateCharacter } from '@/features/reader/api';
import { ApiError } from '@/lib/api';

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
  const onCreate = () => create.mutate({}, { onSuccess: (character) => navigate(`/read/${character.id}`) });

  return (
    <ReaderLayout
      action={
        <Link to="/home" className={readerLinkClass}>
          Salir
        </Link>
      }
      className="gap-9 pt-10"
    >
      <div className="flex flex-col gap-2.5">
        <h1 className="font-display text-[clamp(40px,11vw,60px)] leading-none font-semibold text-balance">Tus personajes</h1>
        <p className="text-xl leading-normal text-pretty text-ink-muted">Retoma una aventura donde la dejaste o comienza una nueva.</p>
      </div>

      {isPending ? (
        <div className="flex min-h-40 items-center justify-center">
          <WritingDots label="Cargando tus personajes" className="text-5xl text-ink-muted" />
        </div>
      ) : isError ? (
        <div role="alert" className="flex flex-col items-start gap-2 text-xl">
          <p>No pudimos cargar tus personajes.</p>
          <button type="button" onClick={() => refetch()} className={readerLinkClass}>
            Reintentar
          </button>
        </div>
      ) : (
        <>
          {characters.length ? (
            <nav aria-label="Tus personajes" className="flex flex-col">
              {characters.map((c) => (
                <CharacterRow key={c.id} character={c} />
              ))}
            </nav>
          ) : (
            <p className="text-xl text-ink-muted italic">Aún no tienes personajes. Crea uno para empezar a leer.</p>
          )}
          <div className="flex flex-col gap-3">
            <Button className="w-full" onClick={onCreate} loading={create.isPending}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                <path d="M8 2v12M2 8h12" />
              </svg>
              Crear nuevo personaje
            </Button>
            {create.error && (
              <p role="alert" className="text-base text-danger">
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
      className="flex min-h-11 items-center justify-between gap-4 border-t border-paper-line py-5 text-ink no-underline transition-[padding] duration-200 last:border-b hover:pl-1.5"
    >
      <span className="flex min-w-0 flex-col gap-1">
        {/* Por ahora el personaje se distingue por su ubicación (el nombre es opcional) */}
        <span className="text-lg leading-[1.3] text-ink-muted">
          <em>{where ? KIND_LABELS[where.kind] : 'Nuevo personaje'}</em>
          {character.name && ` · ${character.name}`}
        </span>
        <span className="font-display text-[32px] leading-[1.05] font-semibold">{title}</span>
        {where && where.kind !== 'city' && <span className="text-[19px] leading-[1.35] text-ink-soft">Ciudad: {where.city}</span>}
        {where?.place && where.kind !== 'place' && <span className="text-[19px] leading-[1.35] text-ink-soft">Lugar: {where.place}</span>}
      </span>
      <ArrowRightIcon className="shrink-0" />
    </Link>
  );
}
