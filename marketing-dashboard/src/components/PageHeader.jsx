import { Bell, CalendarCheck, Moon, PanelLeft, Sun } from 'lucide-react';
import UserMenu from './UserMenu.jsx';

export default function PageHeader({ menuOpen, onMenu, theme, onTheme, user, onViewProfile, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="topbar-icon" aria-label="Toggle sidebar" aria-expanded={menuOpen} aria-controls="sidebar" onClick={onMenu}>
          <PanelLeft size={22} strokeWidth={1.8} />
        </button>
        <h1>Marketing Dashboard</h1>
      </div>
      <div className="topbar-right">
        <div className="theme-switch" role="group" aria-label="Color theme">
          <button type="button" aria-pressed={theme === 'light'} aria-label="Light theme" onClick={() => onTheme('light')}>
            <Sun size={18} strokeWidth={2.2} />
          </button>
          <button type="button" aria-pressed={theme === 'dark'} aria-label="Dark theme" onClick={() => onTheme('dark')}>
            <Moon size={18} strokeWidth={2.2} />
          </button>
        </div>
        <button type="button" className="topbar-icon" aria-label="Calendar">
          <CalendarCheck size={22} strokeWidth={1.8} />
        </button>
        <button type="button" className="topbar-icon" aria-label="Notifications">
          <Bell size={22} strokeWidth={1.8} />
        </button>
        <UserMenu user={user} onViewProfile={onViewProfile} onLogout={onLogout} />
      </div>
    </header>
  );
}
