import { WritingDots } from '@/components/ui/writing-dots';

/** Pantalla de espera mientras se comprueba la sesión. */
export function PageLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <WritingDots label="Cargando" className="text-6xl text-ink-muted" />
    </div>
  );
}
