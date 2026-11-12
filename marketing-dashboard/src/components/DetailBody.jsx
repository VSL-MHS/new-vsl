// Renders the body of the right-side detail dialog. `detail` shape:
// { value?, context, description?, facts: [[label, value]], note? }
import { IndianRupee } from 'lucide-react';
import { KPI_ICONS } from './KpiGrid.jsx';

// The clicked KPI card, re-drawn large at the top of the drawer in its own tone.
function KpiHero({ kpi }) {
  const Icon = KPI_ICONS[kpi.id] ?? IndianRupee;
  return (
    <div className={`detail-hero tone-${kpi.tone}`}>
      <span className="detail-hero-head">
        <Icon size={26} strokeWidth={2} aria-hidden="true" />
        <span>{kpi.label}</span>
      </span>
      <strong className="detail-hero-value">{kpi.value}</strong>
      {kpi.progress != null && (
        <span className="kpi-target-line" aria-hidden="true"><span style={{ width: `${kpi.progress}%` }} /></span>
      )}
      <span className="detail-hero-meta">{kpi.metaStrong ?? kpi.meta}</span>
    </div>
  );
}

export default function DetailBody({ detail }) {
  return (
    <div className="dialog-body">
      {detail.kpi ? <KpiHero kpi={detail.kpi} /> : detail.value && <p className="detail-value">{detail.value}</p>}
      <p className="detail-context">{detail.context}</p>
      {detail.description && <p>{detail.description}</p>}
      {detail.facts?.length > 0 && (
        <dl className="detail-facts">
          {detail.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {detail.table && (
        <div className="aud-detail-table-wrap">
          <table className="aud-detail-table">
            <thead>
              <tr>{detail.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {detail.table.rows.map((row) => (
                <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {detail.note && <p>{detail.note}</p>}
    </div>
  );
}
