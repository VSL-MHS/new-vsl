import { useState } from 'react';
import { CALL_INSIGHTS } from '../../data/dashboardData.js';
import { fmtPct } from '../../data/metrics.js';

const STAGES = [['setter', 'Setter'], ['consultation', 'Consultation'], ['combined', 'Combined']];

export default function CallInsights({ onOpen }) {
  const [stage, setStage] = useState('setter');
  const data = CALL_INSIGHTS[stage];
  const { calls, people, answered, missing } = data.summary;
  const top = data.themes[0][2];

  return (
    <article className="aud-card aud-call-card">
      <header className="aud-card-head">
        <div>
          <h3>Sales Call Insights</h3>
          <p>Anonymous themes from demo call transcripts</p>
        </div>
        <div className="aud-segmented" role="group" aria-label="Call stage">
          {STAGES.map(([value, label]) => (
            <button key={value} type="button" className="aud-seg-btn" aria-pressed={stage === value} onClick={() => setStage(value)}>
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="aud-call-summary">
        <span><b>{calls}</b> calls analysed</span>
        <span><b>{people}</b> unique people</span>
        <span><b>{answered}</b> answered</span>
        <span><b>{missing}</b> Not answered</span>
      </div>

      <div className="aud-call-content">
        <div className="aud-call-themes">
          {data.themes.map(([kind, label, count]) => (
            <button
              key={label}
              type="button"
              className="aud-theme"
              onClick={() =>
                onOpen({ title: label, context: `${kind} · ${STAGES.find(([v]) => v === stage)[1]} calls`, facts: [['People', count], ['Share of answered', fmtPct((count / answered) * 100)]] })
              }
            >
              <span><small>{kind}</small><b>{label}</b></span>
              <span className="aud-bar-track"><span style={{ width: `${(count / top) * 100}%` }} /></span>
              <span className="aud-theme-value">{count} <small>{fmtPct((count / answered) * 100)}</small></span>
            </button>
          ))}
        </div>
        <aside className="aud-call-example">
          <span>Anonymous sample</span>
          <blockquote>{data.quote}</blockquote>
          <span>Content idea</span>
          <p>{data.idea}</p>
        </aside>
      </div>

      <footer className="aud-card-foot">
        <span>Share uses respondents in this view. Each person counts once per theme.</span>
      </footer>
    </article>
  );
}
