import { useEffect, useState } from 'react';
import { ANIMATIONS } from '@wos/shared';
import { cn } from '@/lib/utils';

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

const PLACEHOLDER = 'El texto del fragmento aparecerá aquí.';

/** Las que se escriben letra a letra. */
const TYPED: Animation[] = ['default', 'surprise'];

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
    if (!play || !TYPED.includes(animation)) return setLength(null);
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
  const chat = animation === 'chatA' || animation === 'chatB';
  const playing = play > 0;

  return (
    <div
      aria-live="off"
      className="box-border min-h-45 flex-1 overflow-hidden border border-paper-line bg-paper px-7 py-6.5 shadow-[0_1px_2px_rgb(27_25_21/0.2),0_6px_0_-3px_var(--color-paper-edge),0_6px_1px_-3px_rgb(27_25_21/0.25)]"
    >
      <p
        // la clave reinicia la animación CSS en cada reproducción
        key={`${play}-${shaking}`}
        className={cn(
          'm-0 text-[21px] leading-[1.55] whitespace-pre-wrap text-ink-soft motion-reduce:animate-none',
          !text.trim() && 'text-ink-muted italic',
          playing && (animation === 'paragraph' || animation === 'title') && 'animate-fragment-fade',
          playing && animation === 'chatA' && 'animate-fragment-slide-left',
          playing && animation === 'chatB' && 'animate-fragment-slide-right',
          shaking && 'animate-fragment-shake',
          chat && 'w-fit max-w-[85%] rounded-[14px] border border-paper-line bg-parchment px-4 py-2.5',
          animation === 'chatB' && 'ml-auto',
          animation === 'title' && 'text-center font-display text-[32px] leading-tight font-semibold text-ink',
        )}
      >
        {typed}
        <span className="invisible">{rest}</span>
      </p>
    </div>
  );
}
