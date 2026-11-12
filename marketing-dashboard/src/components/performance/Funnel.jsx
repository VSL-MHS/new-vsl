import { fmtNum, fmtPct } from '../../data/metrics.js';

export default function Funnel({ funnel, context, onOpen }) {
  const top = funnel.steps[0].value || 1;

  return (
    <article className="perf-panel perf-funnel">
      <div className="perf-heading">
        <div>
          <h2>₹199 funnel</h2>
          <p>Paid Lead to program enrollment</p>
        </div>
      </div>
      <div className="perf-funnel-list">
        {funnel.steps.map((step, i) => {
          const prev = funnel.steps[i - 1];
          return (
            <button
              key={step.label}
              type="button"
              className="perf-funnel-step"
              onClick={() =>
                onOpen({ title: step.label, context, facts: [['People', fmtNum(step.value)], ['Owner', step.owner]], note: step.note })
              }
            >
              <span className="perf-funnel-header">
                <span>{step.label}</span>
                <strong>{fmtNum(step.value)}</strong>
              </span>
              <span className="perf-track">
                <i style={{ '--width': `${(step.value / top) * 100}%`, '--fill': step.fill }} />
              </span>
              {prev && (
                <small>
                  {fmtPct(prev.value ? (step.value / prev.value) * 100 : 0)} of previous step <span>·</span>{' '}
                  {fmtNum(prev.value - step.value)} fewer
                </small>
              )}
            </button>
          );
        })}
      </div>
      <div className="perf-funnel-total">
        <span>Paid Lead to attended</span>
        <strong>{fmtPct(funnel.attendedRate)}</strong>
      </div>
    </article>
  );
}
