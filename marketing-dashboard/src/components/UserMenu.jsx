import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, UserRound } from 'lucide-react';

// Avatar + name button that opens a small account menu (ARIA menu-button pattern).
export default function UserMenu({ user, onViewProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const items = useRef([]);
  const initials = user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    if (!open) return;
    items.current[0]?.focus();
    const onDown = (e) => !root.current?.contains(e.target) && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) root.current?.querySelector('.user-trigger')?.focus();
  };

  const onMenuKey = (e) => {
    const list = items.current.filter(Boolean);
    const i = list.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') close(false);
  };

  const pick = (fn) => () => {
    close(false);
    fn();
  };

  return (
    <div className={`user-menu${open ? ' is-open' : ''}`} ref={root}>
      <button
        type="button"
        className="user-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === 'ArrowDown' && (e.preventDefault(), setOpen(true))}
      >
        <span className="topbar-avatar" aria-hidden="true">{initials}</span>
        <span className="user-text">
          <strong>{user.name}</strong>
          <small>{user.role}</small>
        </span>
        <ChevronDown className="user-caret" size={18} strokeWidth={2.2} aria-hidden="true" />
      </button>

      {open && (
        <div className="user-dropdown" role="menu" aria-label="Account" onKeyDown={onMenuKey}>
          <div className="user-dropdown-head" aria-hidden="true">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <button type="button" role="menuitem" ref={(el) => (items.current[0] = el)} onClick={pick(onViewProfile)}>
            <UserRound size={18} strokeWidth={2} aria-hidden="true" /> View profile
          </button>
          <button type="button" role="menuitem" className="danger" ref={(el) => (items.current[1] = el)} onClick={pick(onLogout)}>
            <LogOut size={18} strokeWidth={2} aria-hidden="true" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
