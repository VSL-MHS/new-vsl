import { PROGRAM_ROUTES } from '../../data/dashboardData.js';
import { fmtNum } from '../../data/metrics.js';

export default function ProgramRoutes({ scope, context, onOpen }) {
  // Organic Silver sales come from the Organic source; the rest are paid acquisition.
  const organicSilver = scope.source === 'All sources' || scope.source === 'Organic' ? 31 * scope.factor : 0;
  const values = {
    diamond: scope.diamond,
    silverOrganic: organicSilver,
    silverPaid: Math.max(scope.silver - organicSilver, 0),
  };
  const max = Math.max(...Object.values(values), 1);

  return (
    <article className="perf-panel perf-programs">
      <div className="perf-heading">
        <div>
          <h2>Program sales by route</h2>
          <p>Confirmed program enrollments</p>
        </div>
      </div>
      <div className="perf-routes">
        {PROGRAM_ROUTES.map((r) => (
          <button
            key={r.key}
            type="button"
            className="perf-route"
            onClick={() => onOpen({ title: `${r.tier === 'diamond' ? 'Diamond' : 'Silver'} · ${r.name}`, context, facts: [['Enrollments', fmtNum(values[r.key])]] })}
          >
            <span>
              <b className={r.tier}>{r.tier === 'diamond' ? 'Diamond' : 'Silver'}</b> {r.name}
            </span>
            <strong>{fmtNum(values[r.key])}</strong>
            <span className="perf-track">
              <i style={{ '--width': `${(values[r.key] / max) * 100}%`, '--fill': r.fill }} />
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}
