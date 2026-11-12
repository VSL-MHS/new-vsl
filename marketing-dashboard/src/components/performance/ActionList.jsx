import { ACTIONS } from '../../data/dashboardData.js';

export default function ActionList({ onOpen }) {
  return (
    <section className="perf-action-section">
      <div className="perf-action-heading">
        <h2>What needs action</h2>
        <span>{ACTIONS.length} to review</span>
      </div>
      <div className="perf-actions">
        {ACTIONS.map((a) => (
          <button
            key={a.title}
            type="button"
            className={`perf-action ${a.tone}`}
            onClick={() => onOpen({ title: a.title, context: a.detail, facts: [['Owner', a.owner]], note: a.note })}
          >
            <span className="perf-alert-marker" aria-hidden="true" />
            <span>
              <strong>{a.title}</strong>
              <small>{a.detail}</small>
            </span>
            <span className="perf-action-owner">
              {a.owner} <i className="arrow-ne" aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
