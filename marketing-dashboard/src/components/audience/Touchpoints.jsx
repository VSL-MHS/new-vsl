import { TOUCHPOINTS } from '../../data/dashboardData.js';
import { fmtNum, fmtPct } from '../../data/metrics.js';

export default function Touchpoints({ onOpen }) {
  const maxPaid = Math.max(...TOUCHPOINTS.map((t) => t.paid));
  const maxBuyers = Math.max(...TOUCHPOINTS.map((t) => t.buyers));
  const totalPaid = TOUCHPOINTS.reduce((s, t) => s + t.paid, 0);
  const totalBuyers = TOUCHPOINTS.reduce((s, t) => s + t.buyers, 0);
  const missing = TOUCHPOINTS.find((t) => t.missing);

  return (
    <article className="aud-card aud-touchpoints">
      <header className="aud-card-head">
        <div>
          <h3>Touchpoint Trends</h3>
          <p>Matched ₹199 cohort · 30-day demo follow-up</p>
        </div>
        <button
          type="button"
          className="aud-text-btn"
          onClick={() =>
            onOpen({
              title: 'How this is counted',
              context: 'Matched ₹199 cohort',
              description: 'Each Paid Lead is grouped by how many times they had entered the CRM when they paid ₹199. Buyers are Diamond or Silver enrolments within 30 days of that payment.',
              note: 'Join rate = buyers ÷ paid leads in the same entry group.',
            })
          }
        >
          How this is counted <span className="arrow-ne" aria-hidden="true" />
        </button>
      </header>

      <div className="aud-touch-table">
        <div className="aud-touch-row aud-touch-header">
          <span>Entry at ₹199 payment</span><span>Paid Leads</span><span>Buyers</span><span>Joined</span>
        </div>
        {TOUCHPOINTS.map((t) => (
          <button
            key={t.label}
            type="button"
            className={`aud-touch-row${t.missing ? ' aud-missing' : ''}`}
            onClick={() =>
              onOpen({ title: t.label, context: 'Touchpoint Trends', facts: [['Paid Leads', fmtNum(t.paid)], ['Buyers', fmtNum(t.buyers)], ['Join rate', fmtPct((t.buyers / t.paid) * 100)]] })
            }
          >
            <span>{t.label}{t.note && <small>{t.note}</small>}</span>
            <span className="aud-touch-measure">
              <span className="aud-bar-track"><span style={{ width: `${(t.paid / maxPaid) * 100}%` }} /></span>
              <b>{fmtNum(t.paid)}</b>
            </span>
            <span className="aud-touch-measure aud-touch-buyers">
              <span className="aud-bar-track"><span style={{ width: `${(t.buyers / maxBuyers) * 100}%` }} /></span>
              <b>{fmtNum(t.buyers)}</b>
            </span>
            <strong>{fmtPct((t.buyers / t.paid) * 100)}</strong>
          </button>
        ))}
        <div className="aud-touch-row aud-touch-total">
          <span>Total</span><span>{fmtNum(totalPaid)}</span><span>{fmtNum(totalBuyers)}</span>
          <strong>{fmtPct((totalBuyers / totalPaid) * 100)}</strong>
        </div>
      </div>

      <footer className="aud-card-foot">
        <span>Join rate = buyers ÷ paid leads in the same entry group.</span>
        <span>History unavailable <b>{missing.paid}</b></span>
      </footer>
    </article>
  );
}
