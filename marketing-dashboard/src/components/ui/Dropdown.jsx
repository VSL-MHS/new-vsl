import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Themed replacement for <select>. Native option popups are drawn by the OS and can't be styled,
 * so this renders its own listbox (ARIA "select-only combobox" pattern) that follows the app theme.
 *
 * options: [{ value, label }] or plain strings.  size: 'md' (toolbar) | 'sm' (inside panels).
 */
export default function Dropdown({ value, onChange, options, label, icon: Icon, size = 'sm', align = 'left', className = '' }) {
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const listId = useId();
  const selectedIndex = Math.max(0, items.findIndex((o) => o.value === value));
  const selected = items[selectedIndex];

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !root.current?.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (open) root.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const openMenu = () => {
    setActive(selectedIndex);
    setOpen(true);
  };
  const choose = (i) => {
    onChange(items[i].value);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    const last = items.length - 1;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    const moves = { ArrowDown: Math.min(active + 1, last), ArrowUp: Math.max(active - 1, 0), Home: 0, End: last };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault();
      setOpen(false);
    } else if (e.key.length === 1) {
      // Type-ahead: jump to the next option starting with the typed letter.
      const k = e.key.toLowerCase();
      const order = [...items.slice(active + 1), ...items.slice(0, active + 1)];
      const hit = order.find((o) => o.label.toLowerCase().startsWith(k));
      if (hit) setActive(items.indexOf(hit));
    }
  };

  return (
    <div ref={root} className={`dd dd-${size}${open ? ' dd-open' : ''} ${className}`}>
      <button
        type="button"
        className="dd-trigger"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
      >
        {Icon && <Icon className="dd-icon" size={size === 'md' ? 17 : 15} strokeWidth={2} aria-hidden="true" />}
        <span className="dd-value">{selected?.label}</span>
        <ChevronDown className="dd-caret" size={size === 'md' ? 17 : 15} strokeWidth={2} aria-hidden="true" />
      </button>

      {open && (
        <ul id={listId} className={`dd-menu dd-align-${align}`} role="listbox" aria-label={label}>
          {items.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              data-index={i}
              role="option"
              aria-selected={i === selectedIndex}
              className={`dd-option${i === active ? ' is-active' : ''}`}
              onPointerEnter={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault() /* keep focus on the trigger */}
              onClick={() => choose(i)}
            >
              <span>{o.label}</span>
              {i === selectedIndex && <Check size={16} strokeWidth={2.4} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
