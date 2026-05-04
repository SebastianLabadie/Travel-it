import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ── Types ────────────────────────────────────────────────────────────────────

type ChecklistState = {
  version: 1;
  checks: Record<string, boolean>;
};

type ChecklistStore = ChecklistState & {
  toggle: (id: string) => void;
  reset: () => void;
};

// ── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STATE: ChecklistState = {
  version: 1,
  checks: {},
};

// ── Zod-lite validation for rehydration ─────────────────────────────────────
// Full Zod not imported here to keep the store lean; manual guard is sufficient.

function isValidPersistedState(raw: unknown): raw is ChecklistState {
  if (typeof raw !== 'object' || raw === null) return false;
  const obj = raw as Record<string, unknown>;
  if (obj['version'] !== 1) return false;
  if (typeof obj['checks'] !== 'object' || obj['checks'] === null) return false;
  return true;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useChecklistStore = create<ChecklistStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      toggle: (id: string) =>
        set((s) => ({
          checks: { ...s.checks, [id]: !s.checks[id] },
        })),
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'travel-it:checklist:v1',
      storage: createJSONStorage(() => localStorage),
      // Rehydration guard: if persisted state is invalid schema, fall back to
      // defaults instead of crashing. Accepts schema drift gracefully.
      merge: (persisted, current) => {
        if (!isValidPersistedState(persisted)) return current;
        return { ...current, ...persisted };
      },
    }
  )
);

// ── Selector helpers ─────────────────────────────────────────────────────────

/** Returns the full checks map (id → boolean). */
export const selectChecks = (s: ChecklistStore) => s.checks;

/** Returns whether a specific item is checked. */
export const selectIsChecked = (id: string) => (s: ChecklistStore) =>
  s.checks[id] === true;

/** Returns total checked count. */
export const selectDoneCount = (s: ChecklistStore) =>
  Object.values(s.checks).filter(Boolean).length;
