import { ArrowRightIcon } from '@/components/icons';
import { WritingDots } from '@/components/ui/writing-dots';

export type PanelOption = {
  key: string;
  name: string;
  description?: string | null;
  onSelect: () => void;
};

type OptionsPanelProps = {
  title: string;
  options: PanelOption[];
  /** Texto si no hay opciones. */
  empty?: string;
  loading?: boolean;
};

/** Panel fijo abajo con las opciones para seguir leyendo; aparece al terminar el texto. */
export function OptionsPanel({ title, options, empty, loading }: OptionsPanelProps) {
  return (
    <section
      aria-label="Opciones para continuar"
      className="sticky bottom-0 -mx-5 animate-sheet-rise border-t border-ink bg-parchment px-5 pb-5 shadow-[0_-16px_20px_-16px_rgb(27_25_21/0.3)] motion-reduce:animate-none"
    >
      <h2 className="flex min-h-14 items-center font-display text-[26px] font-semibold">{title}</h2>
      <div className="flex max-h-[46vh] flex-col overflow-y-auto">
        {loading ? (
          <div className="flex justify-center border-t border-paper-line py-4">
            <WritingDots label="Cargando opciones" className="text-4xl text-ink-muted" />
          </div>
        ) : options.length ? (
          options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={o.onSelect}
              className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 border-0 border-t border-paper-line bg-transparent py-4 text-left font-serif text-ink transition-[padding] duration-200 hover:pl-1.5"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-display text-[28px] leading-[1.05] font-semibold">{o.name}</span>
                {o.description && <span className="text-lg leading-[1.4] text-pretty text-ink-muted">{o.description}</span>}
              </span>
              <ArrowRightIcon className="shrink-0" />
            </button>
          ))
        ) : (
          <p className="border-t border-paper-line py-4 text-[19px] text-ink-muted italic">{empty}</p>
        )}
      </div>
    </section>
  );
}
