import { useMemo, useState } from 'react';
import { AUDIENCE_CHARTS, AUDIENCE_PROFILES } from '../../data/dashboardData.js';
import AudienceChartCard from './AudienceChartCard.jsx';
import CallInsights from './CallInsights.jsx';
import Touchpoints from './Touchpoints.jsx';

// Demo "Buyers" view: derive buyer counts from paid-lead counts with a varying join rate per row,
// so the bars visibly reshape when the toggle flips.
const toBuyers = (items) => items.map(([label, value], i) => [label, Math.round(value * (0.09 + ((i * 37) % 9) / 100))]);

function itemsFor(chart, view) {
  const map = view === 'buyers' ? toBuyers : (x) => x;
  if (chart.select) return Object.fromEntries(chart.select.options.map((o) => [o.value, map(o.items)]));
  return map(chart.items);
}

export default function AudienceInsights({ onOpen }) {
  const [view, setView] = useState('paid');
  const charts = useMemo(() => AUDIENCE_CHARTS.map((c) => ({ chart: c, items: itemsFor(c, view) })), [view]);

  return (
    <section className="aud-section" aria-labelledby="audience-title">
      <header className="aud-section-head">
        <div>
          <h2 id="audience-title">Audience Insights</h2>
          <p>{view === 'paid' ? '1,500 Paid Leads' : '200 Buyers'} · ₹199 payment date</p>
        </div>
        <div className="aud-segmented" role="group" aria-label="Audience group">
          <button type="button" className="aud-seg-btn" aria-pressed={view === 'paid'} onClick={() => setView('paid')}>Paid Leads</button>
          <button type="button" className="aud-seg-btn" aria-pressed={view === 'buyers'} onClick={() => setView('buyers')}>Buyers</button>
        </div>
      </header>

      <div className="aud-profiles">
        {AUDIENCE_PROFILES[view].map((p) => (
          <button
            key={p.heading}
            type="button"
            className={`aud-profile aud-profile-${p.tone}`}
            onClick={() => onOpen({ title: p.heading, context: p.caption, facts: [['Group', p.title], ['Result', p.stat]] })}
          >
            <span className="aud-profile-heading">{p.heading} <span className="arrow-ne" aria-hidden="true" /></span>
            <span className="aud-profile-main"><strong>{p.title}</strong> <span>{p.stat}</span></span>
            <span className="aud-profile-caption">{p.caption}</span>
          </button>
        ))}
      </div>

      <CallInsights onOpen={onOpen} />

      <div className="aud-card-grid">
        {charts.map(({ chart, items }) => (
          // key includes view so per-card UI state (Show all, reading type) resets on toggle
          <AudienceChartCard key={`${chart.id}-${view}`} chart={chart} items={items} onOpen={onOpen} />
        ))}
      </div>

      <Touchpoints onOpen={onOpen} />
    </section>
  );
}
