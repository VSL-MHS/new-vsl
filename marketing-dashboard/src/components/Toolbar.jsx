import { useState } from 'react';
import { CalendarDays, Filter } from 'lucide-react';
import { DATE_RANGES, SOURCES } from '../data/dashboardData.js';
import Dropdown from './ui/Dropdown.jsx';

const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Toolbar({ filters, onChange, onReset, periodLabel, leading }) {
  const [range, setRange] = useState({ from: '2026-11-01', to: '2026-11-15' });
  const [error, setError] = useState('');

  const applyCustom = (e) => {
    e.preventDefault();
    if (!range.from || !range.to) return setError('Choose both dates.');
    if (range.to < range.from) return setError('End date must be on or after the start date.');
    setError('');
    onChange({ customLabel: `${fmtDate(range.from)} – ${fmtDate(range.to)}` });
  };

  return (
    <>
      <div className="toolbar" aria-label="Dashboard filters">
        {leading}
        <div className="filter-controls">
          <button type="button" className="button button-quiet" onClick={onReset}>Reset</button>
          <Dropdown size="md" icon={Filter} label="Source" value={filters.source} options={SOURCES} onChange={(source) => onChange({ source })} />
          <Dropdown
            size="md"
            align="right"
            icon={CalendarDays}
            label="Date range"
            value={filters.date}
            options={DATE_RANGES.map((d) => ({ value: d.value, label: d.label }))}
            onChange={(date) => onChange({ date })}
          />
        </div>
      </div>

      {filters.date === 'custom' && (
        <form className="custom-range" onSubmit={applyCustom}>
          <label>
            From
            <input type="date" value={range.from} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} />
          </label>
          <label>
            To
            <input type="date" value={range.to} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} />
          </label>
          <button type="submit" className="button button-secondary">Apply</button>
          {error && <span id="date-error" role="alert">{error}</span>}
        </form>
      )}
    </>
  );
}
