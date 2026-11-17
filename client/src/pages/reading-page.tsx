import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { Character, Location, Readable, Tale, UpdateCharacterInput } from '@wos/shared';
import { WritingDots } from '@/components/ui/writing-dots';
import { ArrowRightIcon } from '@/components/icons';
import { ReaderBackLink, ReaderLayout, readerLinkClass } from '@/features/reader/reader-layout';
import { ReadingText } from '@/features/reader/reading-text';
import { OptionsPanel, type PanelOption } from '@/features/reader/options-panel';
import {
  useCharacters,
  useMarkRead,
  useMoveCharacter,
  useReadingChapter,
  useReadingCities,
  useReadingNpcs,
  useReadingPlaces,
} from '@/features/reader/api';
import { taleToText } from '@/features/locations/narrative';
import './reading-page.scss';

type Target = NonNullable<UpdateCharacterInput['location']> | null;

const exitLink = (
  <Link to="/read" className={readerLinkClass}>
    Salir
  </Link>
);

/** Lector · Viaje y lectura de un personaje: continúa donde lo dejó. */
export function ReadingPage() {
  const { characterId = '' } = useParams();
  const { data: characters, isPending, isError, refetch } = useCharacters();
  const queryClient = useQueryClient();
  const character = characters?.find((c) => c.id === characterId);

  // Cada visita elige otras versiones al azar de descripciones y extractos
  useEffect(() => () => queryClient.removeQueries({ queryKey: ['reading'] }), [queryClient]);

  if (isPending) return <Loading />;
  if (isError || !character) {
    return (
      <ReaderLayout action={exitLink} className="reading-page__status">
        <ReaderBackLink to="/read">Volver a tus personajes</ReaderBackLink>
        <p role="alert" className="reading-page__status-text">
          {isError ? 'No pudimos cargar a tu personaje.' : 'No encontramos a este personaje.'}
        </p>
        {isError && (
          <button type="button" onClick={() => refetch()} className={readerLinkClass}>
            Reintentar
          </button>
        )}
      </ReaderLayout>
    );
  }
  return <Journey character={character} />;
}

function Loading({ label = 'Cargando la historia' }: { label?: string }) {
  return (
    <ReaderLayout action={exitLink} className="reading-page__loading">
      <WritingDots label={label} className="reading-page__dots" />
    </ReaderLayout>
  );
}

/** Texto de una escena y el panel de opciones que aparece al terminar de leerlo. */
type Scene = {
  title: string;
  fragments: Readable[];
  author?: string | null;
  /** Lo que se marca como leído por el personaje: la versión del relato o el capítulo. */
  readId?: string;
  panel: { title: string; options: PanelOption[]; empty?: string; loading?: boolean };
};

const fromTale = (tale: Tale | null | undefined) => ({ fragments: tale?.tale ?? [], author: tale?.author, readId: tale?.id });
const summary = (tale: Tale | null | undefined) => (tale ? taleToText(tale.tale).replace(/\s*\n+\s*/g, ' ') : null);

/** Decide qué se lee según la ubicación del personaje y lo pinta. */
function Journey({ character }: { character: Character }) {
  const location = character.location ?? null;
  const move = useMoveCharacter(character.id);
  // Rechazar a un NPC no mueve al personaje: solo muestra su texto de rechazo
  const [rejected, setRejected] = useState<string | null>(null);

  const cities = useReadingCities();
  const places = useReadingPlaces(location?.cityId);
  const npcs = useReadingNpcs(location?.placeId ?? undefined);
  const chapter = useReadingChapter(location?.chapterId ?? undefined);
  // Lugar donde termina el capítulo (puede estar en otra ciudad)
  const endCityId = chapter.data?.endLocation?.cityId ?? undefined;
  const endPlaces = useReadingPlaces(endCityId);

  const go = (target: Target) => {
    setRejected(null);
    window.scrollTo({ top: 0 });
    move.mutate(target);
  };

  if (!location?.cityId) return <Travel onTravel={(cityId) => go({ cityId })} />;

  const city = cities.data?.find((c) => c.id === location.cityId);
  const place = places.data?.find((p) => p.id === location.placeId);
  const npc = npcs.data?.find((n) => n.id === location.npcId);
  const at = (l: Partial<Location>): Target => ({
    cityId: l.cityId ?? location.cityId,
    ...(l.placeId ? { placeId: l.placeId } : {}),
    ...(l.npcId ? { npcId: l.npcId } : {}),
    ...(l.chapterId ? { chapterId: l.chapterId } : {}),
  });

  const loading =
    cities.isPending ||
    (location.placeId && places.isPending) ||
    (location.npcId && npcs.isPending) ||
    (location.chapterId && chapter.isPending);
  if (loading) return <Loading />;

  /** Algo de la ubicación ya no está publicado: se ofrece volver un paso atrás. */
  const gone = (what: string, back: Target, backLabel: string): Scene => ({
    title: 'El camino se ha borrado',
    fragments: [{ text: `${what} ya no está disponible para leer.`, animation: 'paragraph' }],
    panel: { title: 'Continuar', options: [{ key: 'back', name: backLabel, onSelect: () => go(back) }] },
  });

  let scene: Scene;
  if (!city) {
    scene = gone('Esta ciudad', null, 'Viajar a otra ciudad');
  } else if (location.placeId && !place) {
    scene = gone('Este lugar', at({}), `Volver a ${city.name}`);
  } else if (!place) {
    // Ciudad: el viaje y sus lugares
    scene = {
      title: city.name,
      ...fromTale(city.travel ?? city.description),
      panel: {
        title: `Lugares de ${city.name}`,
        empty: 'Aún no hay lugares publicados en esta ciudad.',
        loading: places.isPending,
        // Solo sus lugares: los viajes entre ciudades llegarán más adelante
        options: (places.data ?? []).map((p) => ({
          key: p.id,
          name: p.name,
          description: summary(p.description),
          onSelect: () => go(at({ placeId: p.id })),
        })),
      },
    };
  } else if (location.npcId && !npc) {
    scene = gone('Este encuentro', at({ placeId: place.id }), `Volver a ${place.name}`);
  } else if (!npc) {
    // Lugar: la entrada y lo que hay en él
    scene = {
      title: place.name,
      ...fromTale(place.entry ?? place.description),
      panel: {
        title: 'Qué encuentras aquí',
        options: [
          ...(npcs.data ?? []).map((n) => ({
            key: n.id,
            name: n.name,
            description: summary(n.description),
            onSelect: () => go(at({ placeId: place.id, npcId: n.id })),
          })),
          { key: 'leave', name: 'Salir del lugar', description: `Volver a ${city.name}`, onSelect: () => go(at({})) },
        ],
      },
    };
  } else if (!location.chapterId) {
    const backToPlace = { key: 'back', name: `Volver a ${place.name}`, onSelect: () => go(at({ placeId: place.id })) };
    scene =
      rejected === npc.id
        ? // Rechazo: su texto y de vuelta al lugar
          { title: npc.name, ...fromTale(npc.rejected), panel: { title: 'Continuar', options: [backToPlace] } }
        : // Encuentro: aceptar lleva a su capítulo inicial; rechazar, a su texto de rechazo
          {
            title: npc.name,
            ...fromTale(npc.meeting),
            panel: {
              title: '¿Qué haces?',
              options: (npc.decision?.options ?? []).map((o) => ({
                key: o.id,
                name: o.name,
                description: o.description,
                onSelect: () => (o.value ? go(at({ placeId: place.id, npcId: npc.id, chapterId: o.value })) : setRejected(npc.id)),
              })),
            },
          };
  } else if (!chapter.data) {
    scene = gone('Este capítulo', at({ placeId: place.id }), `Volver a ${place.name}`);
  } else {
    // Capítulo: sus decisiones llevan a otros capítulos; el final, a su lugar de finalización
    const c = chapter.data;
    const options = c.decision?.options ?? [];
    const end = c.endLocation;
    const endCity = cities.data?.find((x) => x.id === end?.cityId);
    const endPlace = endPlaces.data?.find((x) => x.id === end?.placeId);
    let panel: Scene['panel'];
    if (options.length) {
      panel = {
        title: '¿Qué haces?',
        options: options.map((o) => ({
          key: o.id,
          name: o.name,
          description: o.description,
          onSelect: () => go(at({ placeId: place.id, npcId: npc.id, chapterId: o.value })),
        })),
      };
    } else if (endCity) {
      const target = endPlace ? { cityId: endCity.id, placeId: endPlace.id } : { cityId: endCity.id };
      panel = {
        title: 'Fin del capítulo',
        loading: !!end?.placeId && endPlaces.isPending,
        options: [{ key: 'end', name: `Seguir en ${endPlace?.name ?? endCity.name}`, onSelect: () => go(target) }],
      };
    } else {
      panel = { title: 'Fin del capítulo', options: [backToPlaceOption(place, () => go(at({ placeId: place.id })))] };
    }
    scene = { title: c.name, fragments: c.story, author: c.author, readId: c.id, panel };
  }

  const sceneKey = `${location.cityId}/${location.placeId ?? ''}/${location.npcId ?? ''}/${location.chapterId ?? ''}/${rejected ?? ''}`;
  return <SceneView key={sceneKey} scene={scene} character={character} />;
}

const backToPlaceOption = (place: { name: string }, onSelect: () => void): PanelOption => ({
  key: 'back',
  name: `Volver a ${place.name}`,
  onSelect,
});

/** Una escena: el título y el texto que se van escribiendo y, al terminar, el panel de opciones. */
function SceneView({ scene, character }: { scene: Scene; character: Character }) {
  const [finished, setFinished] = useState(false);
  const [skip, setSkip] = useState(0);
  const markRead = useMarkRead(character.id);
  // Si ya lo había leído al llegar (se marca como leído al terminar de leerlo)
  const [readBefore] = useState(() => !!scene.readId && character.fragmentsRead.includes(scene.readId));

  // Mientras se escribe el texto, un clic en cualquier parte de la pantalla salta como el botón (salvo en enlaces y botones,
  // que hacen lo suyo: el propio "Saltar animación" ya suma uno)
  useEffect(() => {
    if (finished) return;
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || (e.target as Element).closest('a, button')) return;
      // Si el lector está seleccionando texto, no es un clic para saltar
      if (window.getSelection()?.toString()) return;
      setSkip((n) => n + 1);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [finished]);

  const onDone = () => {
    setFinished(true);
    if (scene.readId && !readBefore && !markRead.isPending && !markRead.isSuccess) markRead.mutate(scene.readId);
  };

  const readNote = readBefore && <span className="reading-page__read-note">Leído anteriormente</span>;

  return (
    <ReaderLayout
      action={exitLink}
      className="reading-page__scene"
      panel={
        finished ? (
          <OptionsPanel {...scene.panel} />
        ) : (
          // Abajo a la derecha, al alcance del pulgar; cada pulsación salta un elemento (título, párrafo…)
          <div className="reading-page__skip">
            <button type="button" onClick={() => setSkip((n) => n + 1)} className={readerLinkClass}>
              Saltar animación
            </button>
            {readNote}
          </div>
        )
      }
    >
      <article className="reading-page__article">
        <ReadingText title={scene.title} fragments={scene.fragments} animate={character.animations} skip={skip} onDone={onDone} />
        {finished && (scene.author || readBefore) && (
          <p className="reading-page__byline">
            {scene.author && (
              <span className="reading-page__author">
                Por <em>{scene.author}</em>
              </span>
            )}
            {readNote}
          </p>
        )}
      </article>
    </ReaderLayout>
  );
}

/** Sin ubicación: elegir la ciudad donde empieza (o sigue) la aventura. */
function Travel({ onTravel }: { onTravel: (cityId: string) => void }) {
  const { data: cities, isPending, isError, refetch } = useReadingCities();

  return (
    <ReaderLayout action={exitLink} className="reading-page__travel">
      <div className="reading-page__travel-heading">
        <ReaderBackLink to="/read">Volver a tus personajes</ReaderBackLink>
        <h1 className="reading-page__travel-title">¿A dónde viajas?</h1>
        <p className="reading-page__travel-subtitle">Elige la ciudad donde comienza la aventura.</p>
      </div>

      {isPending ? (
        <div className="reading-page__travel-loading">
          <WritingDots label="Cargando ciudades" className="reading-page__travel-dots" />
        </div>
      ) : isError ? (
        <div role="alert" className="reading-page__travel-error">
          <p>No pudimos cargar las ciudades.</p>
          <button type="button" onClick={() => refetch()} className={readerLinkClass}>
            Reintentar
          </button>
        </div>
      ) : cities.length ? (
        <div className="reading-page__cities">
          {cities.map((c) => (
            <section key={c.id} className="reading-page__city">
              <h2 className="reading-page__city-name">{c.name}</h2>
              {c.description && (
                <div className="reading-page__city-text">
                  {c.description.tale.map((r, i) => (
                    <p key={i}>{r.text}</p>
                  ))}
                </div>
              )}
              <div className="reading-page__city-footer">
                {c.description && (
                  <span className="reading-page__author">
                    Por <em>{c.description.author}</em>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onTravel(c.id)}
                  aria-label={`Viajar a ${c.name}`}
                  className="reading-page__go"
                >
                  <span className="link-underline">Viajar</span>
                  <ArrowRightIcon className="reading-page__go-arrow" />
                </button>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="reading-page__empty">Aún no hay ciudades publicadas.</p>
      )}
    </ReaderLayout>
  );
}
