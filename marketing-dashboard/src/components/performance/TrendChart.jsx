import { useState } from 'react';
import { TRENDS } from '../../data/dashboardData.js';
import { fmtINR, fmtLakh, fmtNum } from '../../data/metrics.js';
import Dropdown from '../ui/Dropdown.jsx';

// Each metric mode describes its two series, unit label and value formatter.
const MODES = {
  cash: {
    label: 'Spend & collections', unit: '₹ lakh',
    series: [['spend', 'Gross ad spend', 'spend'], ['cash', 'Program collections', 'cash']],
    axis: (v) => String(+fmtLakh(v)), full: fmtINR,
  },
  leads: {
    label: 'Paid Leads', unit: 'leads',
    series: [['paid', 'Paid Leads', 'cash']],
    axis: fmtNum, full: fmtNum,
  },
  sales: {
    label: 'Enrollments', unit: 'enrolments',
    series: [['silver', 'Silver', 'spend'], ['diamond', 'Diamond', 'cash']],
    axis: fmtNum, full: fmtNum,
  },
};

// Round the axis max up to a "nice" number so gridlines land on clean values.
function niceMax(value) {
  if (value <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 3, 5, 10].find((s) => s * pow >= value);
  return step * pow;
}

export default function TrendChart({ scale, onOpen }) {
  const [interval, setPeriodInterval] = useState('weekly');
  const [mode, setMode] = useState('cash');
  const cfg = MODES[mode];
  const data = TRENDS[interval];
  const series = cfg.series.map(([key, label, cls]) => ({ key, label, cls, values: data[mode][key].map((v) => v * scale) }));
  const max = niceMax(Math.max(...series.flatMap((s) => s.values)));
  const ticks = [max, (max * 2) / 3, max / 3, 0];

  return (
    <article className="perf-panel perf-trend">
      <div className="perf-heading">
        <div>
          <h2>{interval === 'weekly' ? 'Weekly' : 'Monthly'} trends</h2>
          <p>{interval === 'weekly' ? 'Weekly' : 'Monthly'} · {cfg.unit}</p>
        </div>
        <div className="trend-controls">
          <Dropdown label="Trend interval" value={interval} onChange={setPeriodInterval} options={[{ value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} />
          <Dropdown label="Trend metric" align="right" value={mode} onChange={setMode} options={Object.entries(MODES).map(([k, m]) => ({ value: k, label: m.label }))} />
        </div>
      </div>

      <div className="perf-chart">
        <div className="perf-chart-axis" aria-hidden="true">
          {ticks.map((t) => <span key={t}>{cfg.axis(t)}</span>)}
        </div>
        <div className="perf-plot">
          <div className="perf-grid-lines" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="perf-periods">
            {data.labels.map((label, i) => {
              const summary = series.map((s) => `${s.label} ${cfg.full(s.values[i])}`).join(', ');
              return (
                <button
                  key={label}
                  type="button"
                  className="perf-period"
                  title={summary}
                  aria-label={`${label}: ${summary}`}
                  onClick={() =>
                    onOpen({ title: label, context: `${cfg.label} · ${interval}`, facts: series.map((s) => [s.label, cfg.full(s.values[i])]) })
                  }
                >
                  <span className="perf-bar-group" aria-hidden="true">
                    {series.map((s) => (
                      <i key={s.key} className={`perf-bar ${s.cls}`} style={{ '--height': `${(s.values[i] / max) * 100}%` }} />
                    ))}
                  </span>
                  <span className="perf-period-label">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="perf-legend">
        {series.map((s) => (
          <span key={s.key}><i className={`perf-key ${s.cls}`} />{s.label}</span>
        ))}
      </div>
    </article>
  );
}
