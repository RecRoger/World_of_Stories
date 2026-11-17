import { useState } from 'react';
import { useParams } from 'react-router';
import type { Chapter } from '@wos/shared';
import { WritingDots } from '@/components/ui/writing-dots';
import { WriterPageHeading } from '@/features/locations/location-grid';
import { useChapters, useNpc } from '@/features/chapters/api';
import { ChapterCard } from '@/features/chapters/chapter-card';
import { ChapterFormDialog } from '@/features/chapters/chapter-form-dialog';
import './npc-chapters-page.scss';

/**
 * 8 · Capítulos de un NPC de tipo story, como un acordeón: el primero es el inicio y cada decisión lleva a otro.
 * Los capítulos nuevos se crean desde las decisiones (al editar un capítulo).
 */
export function NpcChaptersPage() {
  const { cityId = '', placeId = '', npcId = '' } = useParams();
  const { data: npc } = useNpc(npcId);
  const { data: chapters, isPending, isError, refetch } = useChapters(npcId);
  // Abiertos: al entrar, el capítulo inicial
  const [open, setOpen] = useState<Record<string, boolean> | null>(null);
  const [editing, setEditing] = useState<Chapter | null>(null);

  const rootId = chapters?.[0]?.id;
  const isOpen = (id: string) => (open ? !!open[id] : id === rootId);
  const toggle = (id: string) => setOpen((o) => ({ ...(o ?? (rootId ? { [rootId]: true } : {})), [id]: !isOpen(id) }));

  // Seguir una decisión: cierra el capítulo actual, abre el destino y lo lleva a la vista con el foco
  const go = (from: string, to: string) => {
    setOpen((o) => ({ ...(o ?? (rootId ? { [rootId]: true } : {})), [from]: false, [to]: true }));
    requestAnimationFrame(() => {
      document.getElementById(`chapter-${to}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById(`chapter-toggle-${to}`)?.focus({ preventScroll: true });
    });
  };

  return (
    <div className="npc-chapters-page">
      <div className="npc-chapters-page__heading">
        <WriterPageHeading title="Capítulos" subtitle={npc?.name} />
        <p className="npc-chapters-page__intro">
          La historia empieza en el capítulo de inicio. Los capítulos nuevos se crean desde las decisiones: al editar
          un capítulo, cada decisión lleva a uno que ya existe o a uno nuevo.
        </p>
      </div>

      {isPending ? (
        <div className="npc-chapters-page__loading">
          <WritingDots label="Cargando capítulos" className="npc-chapters-page__dots" />
        </div>
      ) : isError ? (
        <div role="alert" className="npc-chapters-page__error">
          <p>No pudimos cargar los capítulos.</p>
          <button type="button" onClick={() => refetch()} className="npc-chapters-page__retry">
            Reintentar
          </button>
        </div>
      ) : (
        <div className="npc-chapters-page__chapters">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              npcId={npcId}
              npcAuthor={npc?.author ?? ''}
              chapter={chapter}
              chapters={chapters}
              isRoot={chapter.id === rootId}
              open={isOpen(chapter.id)}
              onToggle={() => toggle(chapter.id)}
              onGo={(to) => go(chapter.id, to)}
              onEdit={() => setEditing(chapter)}
            />
          ))}
        </div>
      )}

      {editing && chapters && (
        <ChapterFormDialog
          npcId={npcId}
          chapter={editing}
          chapters={chapters}
          home={{ cityId, placeId }}
          open
          onOpenChange={(next) => !next && setEditing(null)}
        />
      )}
    </div>
  );
}
