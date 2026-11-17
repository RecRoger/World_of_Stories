import { useEffect, useState } from 'react';
import { ANIMATIONS } from '@wos/shared';
import { cn } from '@/lib/utils';
import './animations.scss';

export type Animation = (typeof ANIMATIONS)[number];

/** Nombre de cada animación de fragmento en la interfaz. */
export const ANIMATION_LABELS: Record<Animation, string> = {
  default: 'Normal',
  chatA: 'Diálogo (izquierda)',
  chatB: 'Diálogo (derecha)',
  surprise: 'Sorpresa',
  title: 'Título',
  paragraph: 'Párrafo',
};

export const asAnimation = (value: string | null | undefined): Animation =>
  (ANIMATIONS as readonly string[]).includes(value ?? '') ? (value as Animation) : 'default';

/** Se escriben letra a letra ("Sorpresa" además tiembla al terminar). */
export const isTyped = (animation: Animation) => animation === 'default' || animation === 'surprise';

/** Duración (ms) de las entradas con CSS; deben coincidir con `--animate-fragment-*` de styles/_tokens.scss. */
export const ENTRANCE_MS: Record<Animation, number> = {
  default: 0,
  surprise: 700, // el temblor final
  chatA: 1100,
  chatB: 1100,
  title: 1400,
  paragraph: 1400,
};

/**
 * Clases de un fragmento según su animación: la forma (bocadillo, título) y, mientras entra, su animación.
 * `entering` reproduce la entrada; `shaking`, el temblor final de "Sorpresa".
 */
export function fragmentClass(animation: Animation, { entering = false, shaking = false } = {}) {
  const chat = animation === 'chatA' || animation === 'chatB';
  return cn(
    'fragment',
    entering && (animation === 'paragraph' || animation === 'title') && 'fragment--fade',
    entering && animation === 'chatA' && 'fragment--slide-left',
    entering && animation === 'chatB' && 'fragment--slide-right',
    shaking && 'fragment--shaking',
    chat && 'fragment--chat',
    animation === 'chatB' && 'fragment--chat-b',
    animation === 'title' && 'fragment--title',
  );
}

const PLACEHOLDER = 'El texto del fragmento aparecerá aquí.';

/**
 * Vista previa de un fragmento con su animación. `play` es un contador: cada vez que cambia, se reproduce.
 * "Normal" se escribe letra a letra y "Sorpresa" igual, con un pequeño temblor al terminar; los diálogos
 * entran deslizándose como bocadillos desde su lado; el párrafo aparece completo con un fundido y el título,
 * grande y centrado, también.
 */
export function FragmentPreview({ text, animation, play }: { text: string; animation: Animation; play: number }) {
  const shown = text.trim() || PLACEHOLDER;
  const [length, setLength] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    setShaking(false);
    if (!play || !isTyped(animation)) return setLength(null);
    const finish = () => {
      setLength(null);
      if (animation === 'surprise') setShaking(true);
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
    let n = 0;
    setLength(0);
    const timer = setInterval(() => {
      n += 1;
      if (n >= shown.length) {
        clearInterval(timer);
        finish();
      } else setLength(n);
    }, 35);
    return () => clearInterval(timer);
    // `shown` no se incluye: si se edita el texto, no se vuelve a reproducir
  }, [play, animation]);

  const typed = length === null ? shown : shown.slice(0, length);
  const rest = length === null ? '' : shown.slice(length);

  return (
    <div
      aria-live="off"
      className="fragment-preview"
    >
      <p
        // la clave reinicia la animación CSS en cada reproducción
        key={`${play}-${shaking}`}
        className={cn(
          'fragment-preview__text',
          fragmentClass(animation, { entering: play > 0, shaking }),
          !text.trim() && 'fragment-preview__text--placeholder',
        )}
      >
        {typed}
        <span className="fragment-preview__rest">{rest}</span>
      </p>
    </div>
  );
}
