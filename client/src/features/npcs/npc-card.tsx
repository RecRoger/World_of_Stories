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
import { DECISION_HELP } from "./npc-form";
import { NpcFormDialog } from "./npc-form-dialog";

const TABS = [
  ["description", "Descripción"],
  ["meeting", "Encuentro"],
  ["decision", "Decisión"],
  ["rejected", "Rechazo"],
] as const;

// Misma caja de altura fija que los extractos de ciudades y lugares: lo que no cabe se desplaza dentro
const boxClass =
  "box-border h-[280px] overflow-y-auto border border-paper-line bg-parchment px-5 py-4 [scrollbar-color:var(--color-ink-shadow)_transparent] [scrollbar-width:thin] focus-visible:outline-offset-2";

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
        "flex flex-col gap-4.5 p-8 transition-opacity",
        remove.isPending && "opacity-60",
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <h2 className="min-w-0 flex-[1_1_200px] font-display text-[38px] leading-[1.05] font-semibold">
          {npc.name}
        </h2>

        {manageable && !confirming && (
          <div className="-mt-0.5 -mr-2.5 ml-auto flex items-center gap-0.5">
            {busy && (
              <WritingDots
                label={`${remove.isPending ? "Eliminando" : npc.published ? "Despublicando" : "Publicando"} ${npc.name}`}
                className="mr-2 text-3xl text-ink-muted"
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
          <div className="ml-auto flex flex-wrap items-center justify-end gap-x-2.5 text-[17px]">
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

      <span className="-mt-2 self-start border border-ink px-2.5 py-0.5 text-[15px] tracking-[0.08em] text-ink-muted">
        {npc.npcType}
      </span>

      {error && (
        <p role="alert" className="text-base text-danger">
          {error instanceof ApiError
            ? error.message
            : "No se pudo completar la acción"}
        </p>
      )}

      <Tabs.Root defaultValue="description" className="flex flex-col gap-4">
        <Tabs.List
          aria-label={`Textos de ${npc.name}`}
          className="flex flex-wrap gap-x-6 border-b border-ink"
        >
          {TABS.map(([key, label]) => (
            <Tabs.Trigger
              key={key}
              value={key}
              className="-mb-px min-h-11 cursor-pointer border-0 border-b-2 border-transparent bg-transparent px-1 font-serif text-[19px] text-ink-muted hover:text-ink data-[state=active]:border-ink data-[state=active]:font-medium data-[state=active]:text-ink"
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

      <div className="flex-1" />

      <footer className="flex items-end justify-between gap-4 border-t border-ink pt-1.5">
        <div>
          {isStory && (
            <Link
              to={chaptersTo}
              className="link-underline inline-flex min-h-11 items-center gap-2 text-lg text-ink"
            >
              Ver capítulos
              <ArrowRightIcon width={18} />
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-0.5 pb-2 text-right text-[17px] text-ink-muted">
          <em className="text-ink">{npc.author}</em>
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
    return <p className="text-[19px] text-ink-muted italic">—</p>;
  return (
    <div className="flex flex-col gap-3 text-[19px] leading-normal text-pretty text-ink-soft">
      {paragraphs.map((p, n) => (
        <p key={n}>{p}</p>
      ))}
    </div>
  );
}

const small = "text-[15px] tracking-[0.08em] text-ink-muted uppercase";

function DecisionView({ npc }: { npc: Npc }) {
  const d = npc.decision;
  if (!d)
    return <p className="text-[19px] text-ink-muted italic">Sin decisión.</p>;
  const type = (DECISION_TYPES as readonly string[]).includes(
    d.decisionType ?? "",
  )
    ? (d.decisionType as keyof typeof DECISION_HELP)
    : "choose";
  const isStory = npc.npcType === "story";

  return (
    <div className="flex flex-col gap-4 text-[19px] leading-normal text-ink-soft">
      <p className="text-[17px] text-ink-muted">{DECISION_HELP[type]}</p>
      {type === "money" && (
        <p>
          <span className={small}>Monto solicitado</span>
          <br />
          {d.amount ?? "—"}
        </p>
      )}
      {type === "item" && (
        <p>
          <span className={small}>Ítem solicitado</span>
          <br />
          {d.item || "—"}
        </p>
      )}
      {type === "choose" &&
        d.options.map((o, i) => (
          <div key={o.id}>
            {isStory && (
              <p className={small}>
                {i === 0
                  ? "Aceptar · empieza el capítulo inicial"
                  : "Rechazar · muestra el rechazo"}
              </p>
            )}
            <p className="font-medium text-ink">{o.name}</p>
            <p>{o.description}</p>
          </div>
        ))}
    </div>
  );
}
