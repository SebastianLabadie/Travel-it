interface EmptyStateProps {
  hasFilter: boolean;
}

/** Empty state for zero bookings or zero filter results */
export function EmptyState({ hasFilter }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: '48px 20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontStyle: 'italic',
          color: 'var(--color-fg)',
          marginBottom: 8,
        }}
      >
        {hasFilter ? 'Sin resultados' : 'Sin reservas'}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--color-stone)',
          letterSpacing: '0.08em',
        }}
      >
        {hasFilter
          ? 'Ninguna reserva coincide con este filtro.'
          : 'No hay reservas cargadas.'}
      </div>
      {hasFilter && (
        <div
          style={{
            marginTop: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--color-stone)',
            letterSpacing: '0.08em',
          }}
        >
          Probá con otro filtro.
        </div>
      )}
    </div>
  );
}
