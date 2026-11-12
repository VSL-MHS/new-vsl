import { useState } from 'react';
import { fmtNum, fmtPct } from '../../data/metrics.js';
import Dropdown from '../ui/Dropdown.jsx';

const COLUMN_MAX_PX = 69;

function Columns({ items, total, onPoint }) {
  const max = Math.max(...items.map(([, v]) => v), 1);
  return (
    <div className="aud-columns" style={{ '--aud-column-count': items.length }}>
      {items.map(([label, value], i) => {
        const share = fmtPct((value / total) * 100);
        const missing = i === items.length - 1;
        return (
          <button
            key={label}
            type="button"
            className={`aud-column${missing ? ' aud-missing' : ''}`}
            title={`${label}, ${value} people, ${share}`}
            onClick={() => onPoint(label, value)}
          >
            <span className="aud-column-plot">
              <span className="aud-column-value">{fmtNum(value)}</span>
              <span className="aud-column-bar" style={{ height: `${(value / max) * COLUMN_MAX_PX}px` }} />
            </span>
            <span className="aud-column-label">{label}</span>
            <small className="aud-column-share">{share}</small>
          </button>
        );
      })}
    </div>
  );
}

function Bars({ items, total, onPoint }) {
  return (
    <div className="aud-bar-list">
      {items.map(([label, value]) => (
        <button
          key={label}
          type="button"
          className={`aud-bar-row${label === 'Not answered' ? ' aud-missing' : ''}`}
          onClick={() => onPoint(label, value)}
        >
          <span className="aud-bar-label">{label}</span>
          <span className="aud-bar-track"><span style={{ width: `${(value / total) * 100}%` }} /></span>
          <span className="aud-bar-value">{fmtNum(value)} <small>{fmtPct((value / total) * 100)}</small></span>
        </button>
      ))}
    </div>
  );
}

function Stacked({ items, total, colors, onPoint }) {
  return (
    <>
      <div className="aud-stacked" role="img" aria-label="Distribution">
        {items.map(([label, value], i) => (
          <span key={label} style={{ width: `${(value / total) * 100}%`, background: colors[i] }} title={`${label}, ${value} people`} />
        ))}
      </div>
      <div className="aud-legend">
        {items.map(([label, value], i) => (
          <button key={label} type="button" className="aud-legend-row" onClick={() => onPoint(label, value)}>
            <span><i style={{ background: colors[i] }} />{label}</span>
            <span><b>{fmtNum(value)}</b><small>{fmtPct((value / total) * 100)}</small></span>
          </button>
        ))}
      </div>
    </>
  );
}

export default function AudienceChartCard({ chart, items: baseItems, onOpen }) {
  const [selectValue, setSelectValue] = useState(chart.select?.options[0].value);
  const [showAll, setShowAll] = useState(false);

  const items = chart.select ? baseItems[selectValue] : baseItems;
  const missing = items[items.length - 1][1];
  const total = items.reduce((s, [, v]) => s + v, 0);
  const answered = total - missing;

  // "Show all" collapses long lists to the top N plus the Not answered row.
  const limited = chart.limit && !showAll && items.length - 1 > chart.limit;
  const visible = limited ? [...items.slice(0, chart.limit), items[items.length - 1]] : items;

  const onPoint = (label, value) =>
    onOpen({ title: `${chart.title} · ${label}`, context: chart.subtitle, facts: [['People', fmtNum(value)], ['Share', fmtPct((value / total) * 100)]] });

  const openDetail = () =>
    onOpen({
      title: chart.title,
      context: chart.subtitle,
      table: { head: ['Group', 'People', 'Share'], rows: items.map(([l, v]) => [l, fmtNum(v), fmtPct((v / total) * 100)]) },
    });

  const Body = { columns: Columns, bars: Bars, stacked: Stacked }[chart.type];

  return (
    <article className="aud-card">
      <header className="aud-card-head">
        <div>
          <h3>{chart.title}</h3>
          <p>{chart.subtitle}</p>
        </div>
        <button type="button" className="aud-text-btn aud-card-detail" onClick={openDetail}>
          Details <span className="arrow-ne" aria-hidden="true" />
        </button>
      </header>

      {chart.select && (
        <div className="aud-select-label">
          <span aria-hidden="true">{chart.select.label}</span>
          <Dropdown label={chart.select.label} value={selectValue} onChange={setSelectValue} options={chart.select.options.map((o) => ({ value: o.value, label: o.label }))} />
        </div>
      )}

      <Body items={visible} total={total} colors={chart.colors} onPoint={onPoint} />

      <footer className="aud-card-foot">
        <span>{fmtNum(answered)} of {fmtNum(total)} answered</span>
        <span>Not answered <b>{fmtNum(missing)}</b></span>
        {chart.limit && items.length - 1 > chart.limit && (
          <button type="button" className="aud-text-btn" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show less' : 'Show all'}
          </button>
        )}
      </footer>
      {chart.insight && <p className="aud-insight">{chart.insight(items)}</p>}
    </article>
  );
}
