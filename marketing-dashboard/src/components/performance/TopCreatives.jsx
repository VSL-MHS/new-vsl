import { useState } from 'react';
import { CREATIVES } from '../../data/dashboardData.js';
import { fmtNum } from '../../data/metrics.js';
import Dropdown from '../ui/Dropdown.jsx';

const RANKS = { paid: 'Rank by Paid Leads', sales: 'Rank by sales', free: 'Rank by Free Leads' };

export default function TopCreatives({ source, onOpen }) {
  const [rank, setRank] = useState('paid');

  const list = CREATIVES.filter((c) => source === 'All sources' || c.source === source)
    .map((c) => ({ ...c, leadKey: c.paid ? 'paid' : 'free' }))
    .sort((a, b) => (rank === 'paid' ? b.paid + b.free * 0.001 - (a.paid + a.free * 0.001) : b[rank] - a[rank]))
    .slice(0, 4);

  return (
    <article className="perf-panel perf-creatives-panel">
      <div className="perf-heading">
        <div>
          <h2>Top ads and videos</h2>
          <p>Ranked sample of creatives linked to lead and sales outcomes</p>
        </div>
        <Dropdown label="Rank creatives by" align="right" value={rank} onChange={setRank} options={Object.entries(RANKS).map(([k, v]) => ({ value: k, label: v }))} />
      </div>

      {list.length === 0 ? (
        <p className="perf-empty">No creatives for this source in the selected period.</p>
      ) : (
        <div className="perf-creatives">
          {list.map((c) => {
            const leadKey = rank === 'free' ? 'free' : c.leadKey;
            return (
              <button
                key={c.name}
                type="button"
                className="perf-creative"
                onClick={() =>
                  onOpen({
                    title: c.name,
                    context: `${c.source} · ${c.format}`,
                    facts: [['Paid Leads', fmtNum(c.paid)], ['Free Leads', fmtNum(c.free)], ['Sales', fmtNum(c.sales)]],
                  })
                }
              >
                <span className={`perf-thumb ${c.tone}`}>
                  <span className="perf-thumb-theme">{c.theme}</span>
                  <span className="perf-thumb-mark" aria-hidden="true">{c.mark}</span>
                  <span className="perf-thumb-source">{c.source}</span>
                </span>
                <span className="perf-creative-body">
                  <strong>{c.name}</strong>
                  <small>{c.source} · {c.format}</small>
                  <span className="perf-creative-metrics">
                    <span><b>{fmtNum(c[leadKey])}</b>{leadKey === 'paid' ? 'Paid Leads' : 'Free Leads'}</span>
                    <span><b>{fmtNum(c.sales)}</b>Sales</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </article>
  );
}
