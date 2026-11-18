import { useState } from "react";
import { Link } from "react-router";
import { Tabs } from "radix-ui";
import { DECISION_TYPES, type Npc, type Tale } from "@wos/shared";
import { IconButton } from "@/components/ui/icon-button";
import { Paper } from "@/components/ui/paper";
import { WritingDots } from "@/components/ui/writing-dots";
import {
  ArrowRightIcon,
  PencilIcon,
  PublishIcon,
  TrashIcon,
  UnpublishIcon,
} from "@/components/icons";
import { useMe } from "@/features/auth/api";
import { canManage } from "@/features/auth/roles";
import { linkButtonClass } from "@/features/locations/inline-editor";
import { ApiError } from "@/lib/api";
import { publicationLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useDeleteNpc, usePublishNpc } from "./api";
import { useItems } from "@/features/items/api";
import { formatMoney } from "@/lib/format";
import { DECISION_HELP } from "./npc-form";
import { NpcFormDialog } from "./npc-form-dialog";
import './npc-card.scss';

const TABS = [
  ["description", "Descripción"],
  ["meeting", "Encuentro"],
  ["decision", "Decisión"],
  ["rejected", "Rechazo"],
] as const;

// Misma caja de altura fija que los extractos de ciudades y lugares: lo que no cabe se desplaza dentro
const boxClass = "npc-card__box";

type NpcCardProps = {
  placeId: string;
  npc: Npc;
  /** Ruta de sus capítulos (solo para los NPCs de tipo story). */
  chaptersTo: string;
};

/**
 * Tarjeta de un evento (NPC): editar abre el formulario completo en un modal; publicar y eliminar, como en las
 * demás tarjetas. Solo su autor o un admin ve esas acciones.
 */
export function NpcCard({ placeId, npc, chaptersTo }: NpcCardProps) {
  const { data: user } = useMe();
  const publish = usePublishNpc(placeId);
  const remove = useDeleteNpc(placeId);
  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState(false);

  const manageable = canManage(user, npc.author);
  const busy = publish.isPending || remove.isPending;
  const error = publish.error ?? remove.error;
  const isStory = npc.npcType === "story";

  return (
    <Paper
      aria-busy={busy}
      className={cn(
        "npc-card",
        remove.isPending && "npc-card--busy",
      )}
    >
      <header className="npc-card__header">
        <h2 className="npc-card__name">
          {npc.name}
        </h2>

        {manageable && !confirming && (
          <div className="npc-card__tools">
            {busy && (
              <WritingDots
                label={`${remove.isPending ? "Eliminando" : npc.published ? "Despublicando" : "Publicando"} ${npc.name}`}
                className="npc-card__dots"
              />
            )}
            <IconButton
              label={`Editar ${npc.name}`}
              aria-disabled={busy}
              onClick={() => !busy && setEditing(true)}
            >
              <PencilIcon />
            </IconButton>
            <IconButton
              label={
                npc.published
                  ? `Despublicar ${npc.name}`
                  : `Publicar ${npc.name}`
              }
              aria-disabled={busy}
              onClick={() =>
                !busy &&
                publish.mutate({ id: npc.id, published: !npc.published })
              }
            >
              {npc.published ? <UnpublishIcon /> : <PublishIcon />}
            </IconButton>
            <IconButton
              label={`Eliminar ${npc.name}`}
              aria-disabled={busy}
              onClick={() => !busy && setConfirming(true)}
            >
              <TrashIcon />
            </IconButton>
          </div>
        )}

        {manageable && confirming && (
          <div className="npc-card__confirm">
            <span>¿Eliminar este evento?</span>
            <button
              type="button"
              className={linkButtonClass}
              onClick={() => {
                setConfirming(false);
                remove.mutate(npc.id);
              }}
            >
              Sí, eliminar
            </button>
            <button
              type="button"
              className={linkButtonClass}
              autoFocus
              onClick={() => setConfirming(false)}
            >
              Cancelar
            </button>
          </div>
        )}
      </header>

      <span className="npc-card__type">
        {npc.npcType}
      </span>

      {error && (
        <p role="alert" className="npc-card__error">
          {error instanceof ApiError
            ? error.message
            : "No se pudo completar la acción"}
        </p>
      )}

      <Tabs.Root defaultValue="description" className="npc-card__tabs">
        <Tabs.List
          aria-label={`Textos de ${npc.name}`}
          className="npc-card__tab-list"
        >
          {TABS.map(([key, label]) => (
            <Tabs.Trigger
              key={key}
              value={key}
              className="npc-card__tab"
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {TABS.map(([key]) => (
          <Tabs.Content key={key} value={key} className={boxClass}>
            {key === "decision" ? (
              <DecisionView npc={npc} />
            ) : (
              <TaleText tale={npc[key]} />
            )}
          </Tabs.Content>
        ))}
      </Tabs.Root>

      <div className="npc-card__spacer" />

      <footer className="npc-card__footer">
        <div>
          {isStory && (
            <Link
              to={chaptersTo}
              className="npc-card__next"
            >
              Ver capítulos
              <ArrowRightIcon width={18} />
            </Link>
          )}
        </div>
        <div className="npc-card__credits">
          <em className="npc-card__author">{npc.author}</em>
          <span>
            {publicationLabel(npc.published, npc.publishDate, "Publicado")}
          </span>
        </div>
      </footer>

      {manageable && (
        <NpcFormDialog
          placeId={placeId}
          npc={npc}
          open={editing}
          onOpenChange={setEditing}
        />
      )}
    </Paper>
  );
}

function TaleText({ tale }: { tale: Tale | null }) {
  const paragraphs = tale?.tale.map((r) => r.text.trim()).filter(Boolean) ?? [];
  if (!paragraphs.length)
    return <p className="npc-card__empty">—</p>;
  return (
    <div className="npc-card__text">
      {paragraphs.map((p, n) => (
        <p key={n}>{p}</p>
      ))}
    </div>
  );
}

const small = "npc-card__tag";

function DecisionView({ npc }: { npc: Npc }) {
  const d = npc.decision;
  if (!d)
    return <p className="npc-card__empty">Sin decisión.</p>;
  const type = (DECISION_TYPES as readonly string[]).includes(
    d.decisionType ?? "",
  )
    ? (d.decisionType as keyof typeof DECISION_HELP)
    : "choose";
  const isStory = npc.npcType === "story";
  const { data: catalog } = useItems();
  const itemName = catalog?.find((i) => i.id === d.item)?.name;

  return (
    <div className="npc-card__decision">
      <p className="npc-card__decision-help">{DECISION_HELP[type]}</p>
      {type === "money" && (
        <p>
          <span className={small}>Monto solicitado</span>
          <br />
          {d.amount != null ? formatMoney(d.amount) : "—"}
        </p>
      )}
      {type === "item" && (
        <p>
          <span className={small}>Objeto solicitado</span>
          <br />
          {itemName ?? "—"}
          {d.options[0]?.removeItem && " (se gasta al usarlo)"}
        </p>
      )}
      {d.options.map((o, i) => (
          <div key={o.id}>
            {isStory && (
              <p className={small}>
                {i === 0
                  ? `Aceptar${type === "money" ? " pagando" : type === "item" ? " usando el objeto" : ""} · empieza el capítulo inicial`
                  : "Rechazar · muestra el rechazo"}
              </p>
            )}
            {!isStory && type === "money" && (
              <p className={small}>{i === 0 ? "Se paga" : "Gratis"}</p>
            )}
            {!isStory && type === "item" && (
              <p className={small}>{i === 0 ? "Usa el objeto" : "Sin usarlo"}</p>
            )}
            <p className="npc-card__option-name">{o.name}</p>
            <p>{o.description}</p>
          </div>
        ))}
    </div>
  );
}
