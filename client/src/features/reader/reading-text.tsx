import { useEffect, useState } from 'react';
import type { Readable } from '@wos/shared';
import { cn } from '@/lib/utils';
import { asAnimation, ENTRANCE_MS, fragmentClass, isTyped } from '@/features/chapters/animations';

/** Milisegundos por letra al escribir (como en el diseño). */
const TYPE_MS = 28;
/** Pausa entre un fragmento y el siguiente. */
const PAUSE_MS = 250;

type Progress = { index: number; typed: number; shaking: boolean };

type ReadingTextProps = {
  /** Se escribe primero, letra a letra, antes que los fragmentos. */
  title: string;
  fragments: Readable[];
  /** Sin animaciones (preferencia del personaje o del sistema): todo el texto aparece de golpe. */
  animate: boolean;
  /** Se llama una vez, cuando se ha mostrado todo el texto (al terminar o al saltar la animación). */
  onDone: () => void;
  /** Salta la animación del fragmento en curso, que se muestra entero, y sigue con el siguiente (contador: cada cambio salta uno). */
  skip: number;
};

/**
 * Escribe el título y después lee los fragmentos uno tras otro, cada uno con su animación de entrada: "Normal" y "Sorpresa" se escriben
 * letra a letra (la sorpresa tiembla al final), los diálogos entran deslizándose desde su lado y el párrafo
 * y el título aparecen con un fundido.
 *
 * Quien lo use debe darle una `key` distinta por texto, para que vuelva a empezar.
 */
export function ReadingText({ title, fragments, animate, onDone, skip }: ReadingTextProps) {
  // El título es el primer elemento, con la animación "Normal"
  const list: Readable[] = [{ text: title, animation: 'default' }, ...fragments.filter((f) => f.text.trim())];
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const instant = !animate || reduced;
  const [progress, setProgress] = useState<Progress>(() => ({ index: instant ? list.length : 0, typed: 0, shaking: false }));
  const done = progress.index >= list.length;

  // Saltar: el elemento en curso aparece entero y empieza el siguiente
  useEffect(() => {
    if (skip) setProgress((p) => ({ index: p.index + 1, typed: 0, shaking: false }));
  }, [skip]);

  useEffect(() => {
    const fragment = list[progress.index];
    if (done || !fragment) {
      onDone();
      return;
    }
    const animation = asAnimation(fragment.animation);
    const next = () => setProgress((p) => ({ index: p.index + 1, typed: 0, shaking: false }));

    if (isTyped(animation) && progress.typed < fragment.text.length) {
      const timer = setTimeout(() => setProgress((p) => ({ ...p, typed: p.typed + 1 })), TYPE_MS);
      return () => clearTimeout(timer);
    }
    if (animation === 'surprise' && !progress.shaking) {
      setProgress((p) => ({ ...p, shaking: true }));
      return;
    }
    const timer = setTimeout(next, ENTRANCE_MS[animation] + PAUSE_MS);
    return () => clearTimeout(timer);
    // onDone se llama al terminar; no hace falta reaccionar a su identidad
  }, [progress, done, list.length]);

  /** Texto visible del elemento `i` y el resto, invisible, que reserva su sitio mientras se escribe. */
  const parts = (i: number) => {
    const { text, animation } = list[i] ?? { text: '' };
    const typing = i === progress.index && isTyped(asAnimation(animation));
    return typing ? [text.slice(0, progress.typed), text.slice(progress.typed)] : [text, ''];
  };
  const [titleShown, titleRest] = parts(0);

  return (
    <div className="flex flex-col gap-7" aria-live="off">
      <h1 className="font-display text-[clamp(42px,12vw,60px)] leading-none font-semibold text-balance">
        {titleShown}
        {titleRest && <span className="invisible">{titleRest}</span>}
      </h1>
      <div className="flex flex-col gap-5 text-[23px] leading-[1.7] text-ink-soft">
        {list.map((fragment, i) => {
          if (i === 0 || i > progress.index) return null;
          const animation = asAnimation(fragment.animation);
          const current = i === progress.index;
          const [shown, rest] = parts(i);
          return (
            <p
              key={`${i}-${current && progress.shaking}`}
              className={cn(
                fragmentClass(animation, { entering: current && !isTyped(animation), shaking: current && progress.shaking }),
                'text-pretty',
              )}
            >
              {shown}
              {rest && <span className="invisible">{rest}</span>}
            </p>
          );
        })}
      </div>
    </div>
  );
}
