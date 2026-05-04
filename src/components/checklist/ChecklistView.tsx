import { useState } from 'preact/hooks';
import type { ChecklistCategory, ChecklistItem } from '../../lib/types';
import { useChecklistStore, selectChecks, selectDoneCount } from '../../stores/checklist';

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  categories: ChecklistCategory[];
};

// ── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div
      style={{
        height: 4,
        background: 'var(--color-rule)',
        position: 'relative',
        marginTop: 10,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          background: 'var(--color-moss)',
          transition: 'width 0.3s',
        }}
      />
    </div>
  );
}

// ── ChecklistItem ────────────────────────────────────────────────────────────

type ItemProps = {
  item: ChecklistItem;
  checked: boolean;
  onToggle: (id: string) => void;
};

function Item({ item, checked, onToggle }: ItemProps) {
  const inputId = `chk-${item.id}`;
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        padding: '8px 0',
        borderBottom: '1px dashed var(--color-rule)',
        alignItems: 'flex-start',
      }}
    >
      {/* Real input — visually hidden, stays focusable for a11y */}
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(item.id)}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 16,
          height: 16,
          margin: 0,
          cursor: 'pointer',
        }}
      />
      {/* Custom visual checkbox — sibling of label, aria hidden */}
      <label
        htmlFor={inputId}
        style={{ display: 'flex', gap: 10, cursor: 'pointer', flex: 1, alignItems: 'flex-start' }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 16,
            height: 16,
            border: '1.5px solid var(--color-fg)',
            background: checked ? 'var(--color-fg)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
            color: 'var(--color-paper)',
            fontSize: 10,
            lineHeight: 1,
          }}
        >
          {checked ? '✓' : ''}
        </span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--color-fg)',
              textDecoration: checked ? 'line-through' : 'none',
              opacity: checked ? 0.5 : 1,
              lineHeight: 1.4,
            }}
          >
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener"
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                {item.label}{' '}
                <span style={{ color: 'var(--color-stone)', fontSize: 10 }}>↗</span>
              </a>
            ) : (
              item.label
            )}
          </div>
          {item.note && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--color-stone)',
                marginTop: 2,
              }}
            >
              {item.note}
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

// ── Category ─────────────────────────────────────────────────────────────────

type CategoryProps = {
  cat: ChecklistCategory;
  index: number;
  checks: Record<string, boolean>;
  onToggle: (id: string) => void;
  isOpen: boolean;
  isDesktop: boolean;
  onToggleOpen: () => void;
};

function Category({ cat, index, checks, onToggle, isOpen, isDesktop, onToggleOpen }: CategoryProps) {
  const catDone = cat.items.filter((it) => checks[it.id] === true).length;
  const total = cat.items.length;
  const catPct = total > 0 ? Math.round((catDone / total) * 100) : 0;
  const allDone = catDone === total;
  const contentId = `cat-content-${cat.id}`;
  const open = isDesktop ? true : isOpen;

  return (
    <div style={{ borderTop: '1px solid var(--color-rule)' }}>
      {/* Header */}
      <button
        onClick={isDesktop ? undefined : onToggleOpen}
        aria-expanded={isDesktop ? undefined : open}
        aria-controls={isDesktop ? undefined : contentId}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 0',
          background: 'transparent',
          border: 'none',
          cursor: isDesktop ? 'default' : 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--color-stone)',
              letterSpacing: '0.1em',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontStyle: 'italic',
              color: 'var(--color-fg)',
            }}
          >
            {cat.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: allDone ? 'var(--color-moss)' : 'var(--color-stone)',
            }}
          >
            {catDone}/{total}
          </span>
          {!isDesktop && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
              aria-hidden="true"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          )}
        </div>
      </button>

      {/* Per-category progress bar */}
      <ProgressBar pct={catPct} />

      {/* Items */}
      <div
        id={contentId}
        style={{ display: open ? 'block' : 'none', paddingBottom: 14 }}
      >
        {cat.items.map((item) => (
          <Item
            key={item.id}
            item={item}
            checked={checks[item.id] === true}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}

// ── ChecklistView (island) ────────────────────────────────────────────────────

export function ChecklistView({ categories }: Props) {
  // Accordion open state — only first category open by default (AC-F3-02)
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((c, i) => {
      initial[c.id] = i === 0;
    });
    return initial;
  });

  // Zustand selectors — scoped subscriptions
  const checks = useChecklistStore(selectChecks);
  const doneCount = useChecklistStore(selectDoneCount);
  const toggle = useChecklistStore((s) => s.toggle);
  const reset = useChecklistStore((s) => s.reset);

  const total = categories.reduce((s, c) => s + c.items.length, 0);
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // localStorage availability check (AC-F3-12)
  const localStorageAvailable = (() => {
    try {
      localStorage.setItem('__ptg_test__', '1');
      localStorage.removeItem('__ptg_test__');
      return true;
    } catch {
      return false;
    }
  })();

  function handleReset() {
    if (window.confirm('¿Resetear todo el progreso? Esta acción no se puede deshacer.')) {
      reset();
      useChecklistStore.persist.clearStorage();
    }
  }

  function toggleCategory(id: string) {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section>
      {/* Header */}
      <div className="chk-header">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'var(--color-stone)',
          }}
        >
          03 · CHECKLIST
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            margin: '4px 0 14px',
            letterSpacing: '-0.02em',
          }}
          className="chk-title"
        >
          La <span style={{ fontStyle: 'italic' }}>preparación</span>.
        </h1>

        {/* Global progress */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 42,
              fontStyle: 'italic',
              lineHeight: 1,
            }}
          >
            {pct}
            <span style={{ fontSize: 18, color: 'var(--color-stone)' }}>%</span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--color-stone)',
            }}
          >
            {doneCount} / {total}
          </div>
        </div>
        <ProgressBar pct={pct} />

        {/* Reset button */}
        <div style={{ marginTop: 16 }}>
          <button
            onClick={handleReset}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid var(--color-rule)',
              color: 'var(--color-stone)',
              cursor: 'pointer',
            }}
          >
            ↻ Resetear
          </button>
        </div>

        {/* localStorage warning (AC-F3-12) */}
        {!localStorageAvailable && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--color-warning)',
              marginTop: 10,
            }}
          >
            El progreso no se guardará en este navegador.
          </div>
        )}
      </div>

      {/* Categories — mobile: accordion stack / desktop: 2-col grid */}
      <div className="chk-mobile">
        {categories.map((cat, i) => (
          <Category
            key={cat.id}
            cat={cat}
            index={i}
            checks={checks}
            onToggle={toggle}
            isOpen={openMap[cat.id] === true}
            isDesktop={false}
            onToggleOpen={() => toggleCategory(cat.id)}
          />
        ))}
      </div>

      <div className="chk-desktop">
        {categories.map((cat, i) => (
          <Category
            key={cat.id}
            cat={cat}
            index={i}
            checks={checks}
            onToggle={toggle}
            isOpen={true}
            isDesktop={true}
            onToggleOpen={() => {}}
          />
        ))}
      </div>
    </section>
  );
}
