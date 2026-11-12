import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import PageHeader from './components/PageHeader.jsx';
import Toolbar from './components/Toolbar.jsx';
import KpiGrid from './components/KpiGrid.jsx';
import Dialog from './components/Dialog.jsx';
import DetailBody from './components/DetailBody.jsx';
import ActionList from './components/performance/ActionList.jsx';
import TrendChart from './components/performance/TrendChart.jsx';
import Funnel from './components/performance/Funnel.jsx';
import ChannelTable from './components/performance/ChannelTable.jsx';
import ProgramRoutes from './components/performance/ProgramRoutes.jsx';
import TopCreatives from './components/performance/TopCreatives.jsx';
import AudienceInsights from './components/audience/AudienceInsights.jsx';
import { Check, Pencil, RotateCcw } from 'lucide-react';
import useLocalStorage from './hooks/useLocalStorage.js';
import { DATE_RANGES } from './data/dashboardData.js';
import { buildFunnel, buildKpis, buildScope, fmtNum } from './data/metrics.js';

// Signed-in user shown in the header menu (front-end demo data).
const USER = { name: 'Prabha Kumar', role: 'Super Admin', email: 'prabha@vslerp.demo', phone: '+91 98765 43210', team: 'Marketing' };

const DEFAULT_FILTERS = { date: 'mtd', source: 'All sources', customLabel: '' };
const SECTIONS = [['overview', 'Overview'], ['performance', 'Performance'], ['audience', 'Audience Insights']];

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [loggedOut, setLoggedOut] = useState(false);
  const [collapsed, setCollapsed] = useLocalStorage('vsl-sidebar-collapsed', false);
  const [theme, setTheme] = useLocalStorage('vsl-theme', 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // One button: collapses the sidebar on desktop, opens the drawer on phones.
  const toggleSidebar = (e) => {
    e.stopPropagation();
    if (window.matchMedia('(max-width: 680px)').matches) setMenuOpen((v) => !v);
    else setCollapsed((v) => !v);
  };

  const scope = useMemo(() => buildScope(filters.date, filters.source), [filters.date, filters.source]);
  const kpis = useMemo(() => buildKpis(scope), [scope]);
  const funnel = useMemo(() => buildFunnel(scope), [scope]);

  const defaultOrder = useMemo(() => kpis.map((k) => k.id), [kpis]);
  const [savedOrder, setSavedOrder] = useLocalStorage('mhs-kpi-order', defaultOrder);
  // Keep any KPI ids that were added after the order was saved.
  const order = [...savedOrder.filter((id) => defaultOrder.includes(id)), ...defaultOrder.filter((id) => !savedOrder.includes(id))];
  const orderChanged = order.join() !== defaultOrder.join();
  // Cards removed with the − badge in edit mode (kept across reloads).
  const [hiddenKpis, setHiddenKpis] = useLocalStorage('mhs-kpi-hidden', []);
  const toggleHidden = (id) => setHiddenKpis((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]));
  const layoutChanged = orderChanged || hiddenKpis.length > 0;

  const periodLabel =
    filters.date === 'custom' && filters.customLabel
      ? filters.customLabel
      : DATE_RANGES.find((d) => d.value === filters.date)?.label;
  const context = `${periodLabel} · ${filters.source}`;

  const openDetail = (d) => setDetail({ context, ...d });
  const openKpi = (kpi) =>
    openDetail({ title: kpi.label, value: kpi.value, context: `${context} · Demo data`, kpi, ...(kpi.detail ?? { facts: [['Note', kpi.meta ?? kpi.metaStrong]] }) });

  const jump = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Scroll-spy: highlight the tab for whichever section is nearest the top of the viewport.
  useEffect(() => {
    // The overview wrapper spans the whole page, so the KPI grid stands in for it.
    const els = ['kpis', 'performance', 'audience'].map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.dataset.section);
      },
      { rootMargin: '-10% 0px -70% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [loggedOut]); // re-attach after "Log back in" re-creates the sections

  if (loggedOut) {
    return (
      <main className="signed-out">
        <div className="signed-out-card">
          <h1>You have been logged out</h1>
          <p>This is a front-end demo, so no session was ended on a server.</p>
          <button type="button" className="button button-primary" onClick={() => setLoggedOut(false)}>Log back in</button>
        </div>
      </main>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to dashboard</a>
      <Sidebar open={menuOpen} collapsed={collapsed} onNavigate={jump} onClose={() => setMenuOpen(false)} onToggle={toggleSidebar} />

      <main id="main" className={`workspace${collapsed ? ' sidebar-collapsed' : ''}`} onClick={() => menuOpen && setMenuOpen(false)}>
        <div className="content" id="overview">
          <PageHeader
            menuOpen={menuOpen}
            onMenu={toggleSidebar}
            theme={theme}
            onTheme={setTheme}
            user={USER}
            onViewProfile={() =>
              setDetail({
                title: 'My profile',
                context: `${USER.role} · ${USER.team}`,
                facts: [['Name', USER.name], ['Role', USER.role], ['Email', USER.email], ['Phone', USER.phone], ['Team', USER.team]],
              })
            }
            onLogout={() => setLoggedOut(true)}
          />

          <Toolbar
            filters={filters}
            periodLabel={periodLabel}
            onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            leading={
              <nav className="section-nav" aria-label="Dashboard sections">
                {SECTIONS.map(([id, label]) => (
                  <button key={id} type="button" className={activeSection === id ? 'selected' : ''} aria-current={activeSection === id ? 'location' : undefined} onClick={() => jump(id)}>
                    {label}
                  </button>
                ))}
              </nav>
            }
          />

          <div className="metric-panel">
            <div className="metric-panel-head">
              <div className="card-controls">
                {editing && layoutChanged && (
                  <button
                    type="button"
                    className="button button-quiet"
                    onClick={() => {
                      setSavedOrder(defaultOrder);
                      setHiddenKpis([]);
                    }}
                  >
                    <RotateCcw size={15} aria-hidden="true" /> Reset
                  </button>
                )}
                <button
                  type="button"
                  className={`button ${editing ? 'button-primary' : 'button-outline'}`}
                  id="edit-cards"
                  aria-pressed={editing}
                  onClick={() => setEditing((v) => !v)}
                >
                  {editing ? <Check size={16} aria-hidden="true" /> : <Pencil size={16} aria-hidden="true" />} {editing ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>
            {editing && (
              <p className="card-order-help">
                Press <b>−</b> to hide a card and <b>+</b> to bring it back. Drag cards (or click one, then its new spot) to reorder.
                {hiddenKpis.length > 0 && ` ${hiddenKpis.length} hidden.`}
              </p>
            )}
            <KpiGrid kpis={kpis} order={order} hidden={hiddenKpis} onReorder={setSavedOrder} onToggleHidden={toggleHidden} editing={editing} onOpen={openKpi} />
          </div>
          <p className="sr-only" role="status">{context} · {fmtNum(scope.unique)} unique leads</p>

          <section id="performance" data-section="performance" className="dashboard-section" aria-label="Performance">
            <div className="perf-area">
              <ActionList onOpen={openDetail} />
              <div className="perf-grid perf-grid-overview">
                <TrendChart scale={scope.paid ? scope.paid / 1500 : scope.cash / 6000000} onOpen={openDetail} />
                <Funnel funnel={funnel} context={context} onOpen={openDetail} />
              </div>
              <div className="perf-grid perf-grid-breakdown">
                <ChannelTable factor={scope.factor} activeSource={filters.source} onSelectSource={(source) => setFilters((f) => ({ ...f, source }))} />
                <ProgramRoutes scope={scope} context={context} onOpen={openDetail} />
              </div>
              <TopCreatives source={filters.source} onOpen={openDetail} />
            </div>
          </section>

          <section id="audience" data-section="audience" className="dashboard-section audience-module" aria-label="Audience insights">
            <AudienceInsights onOpen={openDetail} />
          </section>

          <footer className="dashboard-footer">
            <span>My Health School</span>
            <span>Marketing Dashboard · Demo data · IST</span>
          </footer>
        </div>
      </main>

      <Dialog open={!!detail} onClose={() => setDetail(null)} title={detail?.title}>
        {detail && <DetailBody detail={detail} />}
      </Dialog>
    </>
  );
}
