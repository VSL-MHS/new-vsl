import { useState } from 'react';
import { CalendarDays, ChevronDown, Megaphone, PanelLeft, Settings, Wallet, LayoutDashboard } from 'lucide-react';

// Top-level modules. Marketing is the one this app renders, so it is the active (gradient) item.
const MODULES = [
// Only Marketing has a sub-page; the others are single links.
  { id: 'ceo', icon: LayoutDashboard, label: 'CEO', children: [] },
  { id: 'sales', icon: CalendarDays, label: 'Sales', children: [] },
  { id: 'marketing', icon: Megaphone, label: 'Marketing', active: true, children: ['Dashboard'] },
  { id: 'finance', icon: Wallet, label: 'Finance', children: [] },
  { id: 'settings', icon: Settings, label: 'Settings', children: [] },
];

export default function Sidebar({ open, collapsed, onNavigate, onClose, onToggle }) {
  const [expanded, setExpanded] = useState({ marketing: true });
  const [query, setQuery] = useState('');

  // Search keeps a module when its own label or any child label matches.
  const q = query.trim().toLowerCase();
  const visible = MODULES.map((m) => {
    if (!q || m.label.toLowerCase().includes(q)) return m;
    const kids = m.children.filter((c) => c.toLowerCase().includes(q));
    return kids.length ? { ...m, children: kids, forceOpen: true } : null;
  }).filter(Boolean);

  return (
    <aside className={`sidebar${open ? ' open' : ''}${collapsed ? ' collapsed' : ''}`} id="sidebar" aria-label="ERP navigation">
      <div className="brand">
        <button type="button" className="sidebar-toggle" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} onClick={onToggle}>
          <PanelLeft size={21} strokeWidth={1.8} />
        </button>
        <label className="menu-search">
          <span className="sr-only">Search menu</span>
          <input type="search" placeholder="Search menu..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {visible.map(({ id, icon: Icon, label, active, children, forceOpen }) => {
          const hasChildren = children.length > 0;
          const isOpen = hasChildren && (forceOpen || !!expanded[id]);
          return (
            <div className="nav-group" key={id}>
              <button
                type="button"
                className={`nav-module${active ? ' nav-active' : ''}`}
                aria-expanded={hasChildren ? isOpen : undefined}
                aria-controls={hasChildren ? `${id}-links` : undefined}
                onClick={() => (hasChildren ? setExpanded((s) => ({ ...s, [id]: !s[id] })) : onClose())}
                title={label}
              >
                <Icon className="nav-icon" size={20} strokeWidth={2.2} aria-hidden="true" />
                <span className="nav-label">{label}</span>
                {hasChildren && <ChevronDown className="nav-caret" size={18} aria-hidden="true" />}
              </button>
              {hasChildren && (
              <div id={`${id}-links`} className="nav-children" hidden={!isOpen}>
                {children.map((child) => {
                  const current = active && child === 'Dashboard';
                  return (
                    <button
                      key={child}
                      type="button"
                      className={`nav-link${current ? ' current' : ''}`}
                      aria-current={current ? 'page' : undefined}
                      onClick={() => (current ? onNavigate('overview') : onClose())}
                    >
                      {child}
                    </button>
                  );
                })}
              </div>
              )}
            </div>
          );
        })}

      </nav>
    </aside>
  );
}
