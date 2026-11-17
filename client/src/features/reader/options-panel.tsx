import { ArrowRightIcon } from '@/components/icons';
import { WritingDots } from '@/components/ui/writing-dots';
import { formatMoney } from '@/lib/format';
import './options-panel.scss';

export type PanelOption = {
  key: string;
  name: string;
  description?: string | null;
  /** Monedas que cuesta elegirla (decisiones de dinero) */
  cost?: number;
  /** No se puede elegir (p. ej. no le alcanza el dinero); `note` explica por qué */
  disabled?: boolean;
  note?: string;
  onSelect: () => void;
};

type OptionsPanelProps = {
  title: string;
  options: PanelOption[];
  /** Texto si no hay opciones. */
  empty?: string;
  loading?: boolean;
  /** Aviso si algo falló al elegir (p. ej. el pago) */
  error?: string | null;
  /** Nota a la derecha del título (en una decisión de dinero, lo que tiene el personaje) */
  aside?: string | null;
};

/** Panel fijo abajo con las opciones para seguir leyendo; aparece al terminar el texto. */
export function OptionsPanel({ title, options, empty, loading, error, aside }: OptionsPanelProps) {
  return (
    <section
      aria-label="Opciones para continuar"
      className="options-panel"
    >
      <div className="options-panel__heading">
        <h2 className="options-panel__title">{title}</h2>
        {aside && <p className="options-panel__aside">{aside}</p>}
      </div>
      {error && (
        <p role="alert" className="options-panel__error">
          {error}
        </p>
      )}
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
              disabled={o.disabled}
              className="options-panel__option"
            >
              <span className="options-panel__option-text">
                <span className="options-panel__option-name">{o.name}</span>
                {o.description && <span className="options-panel__option-description">{o.description}</span>}
                {(o.cost || o.note) && (
                  <span className="options-panel__option-meta">
                    {!!o.cost && <span className="options-panel__cost">Pagar {formatMoney(o.cost)}</span>}
                    {o.note && <span className="options-panel__note">{o.note}</span>}
                  </span>
                )}
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
