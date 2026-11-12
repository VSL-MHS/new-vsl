import { useMemo, useState } from 'react';
import { SOURCE_COLORS, SOURCE_DATA } from '../../data/dashboardData.js';
import { fmtINR, fmtNum } from '../../data/metrics.js';

const COLUMNS = [
  ['name', 'Source'],
  ['spend', 'Gross spend', fmtINR],
  ['paid', 'Paid Leads', fmtNum],
  ['cpl', 'Paid CPL', (v) => (v == null ? '—' : fmtINR(v))],
  ['silver', 'Silver', fmtNum],
  ['diamond', 'Diamond', fmtNum],
  ['cash', 'Collections', fmtINR],
];

export default function ChannelTable({ factor, activeSource, onSelectSource }) {
  const [sort, setSort] = useState({ key: 'cash', dir: 'desc' });

  const rows = useMemo(() => {
    const list = Object.entries(SOURCE_DATA).map(([name, d]) => ({
      name,
      spend: d.spend * factor,
      paid: d.paid * factor,
      cpl: d.paid ? d.spend / d.paid : null,
      silver: d.silver * factor,
      diamond: d.diamond * factor,
      cash: d.cash * factor,
    }));
    const mul = sort.dir === 'asc' ? 1 : -1;
    return list.sort((a, b) => {
      const av = a[sort.key] ?? -Infinity;
      const bv = b[sort.key] ?? -Infinity;
      return (typeof av === 'string' ? av.localeCompare(bv) : av - bv) * mul;
    });
  }, [factor, sort]);

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' ? 'asc' : 'desc' }));

  return (
    <article className="perf-panel perf-channels">
      <div className="perf-heading">
        <div>
          <h2>Channel performance</h2>
          <p>Source breakdown · gross CPL basis</p>
        </div>
      </div>
      <div className="perf-table-wrap">
        <table className="perf-table">
          <thead>
            <tr>
              {COLUMNS.map(([key, label]) => (
                <th key={key} scope="col" aria-sort={sort.key === key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                  <button type="button" title={`Sort by ${label}`} onClick={() => toggleSort(key)}>
                    {label}
                    {sort.key === key && <span aria-hidden="true"> {sort.dir === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className={activeSource === row.name ? 'perf-active-source' : ''}>
                <th scope="row">
                  <button
                    type="button"
                    aria-pressed={activeSource === row.name}
                    onClick={() => onSelectSource(activeSource === row.name ? 'All sources' : row.name)}
                  >
                    <i className="perf-source-dot" style={{ '--dot': SOURCE_COLORS[row.name] }} aria-hidden="true" />
                    {row.name}
                  </button>
                </th>
                {COLUMNS.slice(1).map(([key, , fmt]) => (
                  <td key={key}>{fmt(row[key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
