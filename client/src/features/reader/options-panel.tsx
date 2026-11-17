import { ArrowRightIcon } from '@/components/icons';
import { WritingDots } from '@/components/ui/writing-dots';
import './options-panel.scss';

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
      className="options-panel"
    >
      <h2 className="options-panel__title">{title}</h2>
      <div className="options-panel__list">
        {loading ? (
          <div className="options-panel__loading">
            <WritingDots label="Cargando opciones" className="options-panel__dots" />
          </div>
        ) : options.length ? (
          options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={o.onSelect}
              className="options-panel__option"
            >
              <span className="options-panel__option-text">
                <span className="options-panel__option-name">{o.name}</span>
                {o.description && <span className="options-panel__option-description">{o.description}</span>}
              </span>
              <ArrowRightIcon className="options-panel__arrow" />
            </button>
          ))
        ) : (
          <p className="options-panel__empty">{empty}</p>
        )}
      </div>
    </section>
  );
}
