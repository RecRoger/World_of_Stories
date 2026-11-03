/** Pantalla de espera mientras se comprueba la sesión. */
export function PageLoader() {
  return (
    <div role="status" className="flex min-h-dvh items-center justify-center">
      <span className="animate-pulse font-display text-2xl italic text-ink-muted">Pasando página…</span>
    </div>
  );
}
