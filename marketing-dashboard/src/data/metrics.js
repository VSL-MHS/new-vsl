import { ATTRIBUTION, BOOKING_FEE, DATE_RANGES, FUNNEL_RATES, GOALS, SOURCE_DATA } from './dashboardData.js';

// ---------- Formatting (Indian number grouping: 9,01,500) ----------
export const fmtNum = (n) => Math.round(n).toLocaleString('en-IN');
export const fmtINR = (n) => `₹${fmtNum(n)}`;
// The tiny epsilon fixes float half-way cases (15.025 is stored as 15.02499…).
export const fmtPct = (n, digits = 1) => `${(n + 1e-9).toFixed(digits)}%`;
export const fmtX = (n) => `${n.toFixed(2)}×`;
export const fmtLakh = (n) => (n / 100000).toFixed(1);

// ---------- Scope: sum the selected sources, scale by date range ----------
export function buildScope(dateValue, source) {
  const factor = DATE_RANGES.find((d) => d.value === dateValue)?.factor ?? 1;
  const keys = source === 'All sources' ? Object.keys(SOURCE_DATA) : [source];
  const sum = {};
  for (const key of keys) {
    for (const [field, value] of Object.entries(SOURCE_DATA[key])) {
      sum[field] = (sum[field] ?? 0) + value * factor;
    }
  }
  return { ...sum, factor, source, isOrganic: source === 'Organic' };
}

// Status pills on KPI cards: { label, tone } where tone is good | bad | watch | neutral.
// TODO(human): implement goal status logic
export function getGoalStatus(kind, actual, goal) {
  return null;
}

// ---------- KPI cards ----------
export function buildKpis(scope) {
  const fees = scope.paid * BOOKING_FEE;
  const adSpent = Math.max(scope.spend - fees, 0);
  const hasSpend = scope.spend > 0;
  const roas = adSpent > 0 ? scope.cash / adSpent : 0;
  const paidCpl = scope.paid ? scope.spend / scope.paid : 0;
  const totalCpl = scope.unique ? scope.spend / scope.unique : 0;
  const freeCpl = scope.free ? scope.spend / scope.free : 0;
  const leadGoal = GOALS.leadGoal * scope.factor;
  const leadPct = Math.min((scope.paid / leadGoal) * 100, 100);
  const dash = '—';

  return [
    {
      id: 'ad-spent', tone: 'blue', label: 'Ad Spent', value: fmtINR(adSpent), meta: `Net of ${fmtINR(BOOKING_FEE)} fees`,
      detail: {
        description: `Gross Meta and Google ad spend minus settled ${fmtINR(BOOKING_FEE)} booking fees in the selected scope.`,
        facts: [['Gross ad spend', fmtINR(scope.spend)], [`${fmtINR(BOOKING_FEE)} fees received`, fmtINR(fees)]],
        note: 'Compare gross spend with the media plan. Open Channel performance to check which platform is driving cost.',
      },
    },
    {
      id: 'money-in', tone: 'mint', label: 'Money In', value: fmtINR(scope.cash), meta: 'Program collections',
      detail: {
        description: 'Collections from Silver and Diamond program enrolments, excluding ₹199 booking fees.',
        facts: [['Diamond enrolments', fmtNum(scope.diamond)], ['Silver enrolments', fmtNum(scope.silver)]],
        note: 'Match against the finance ledger before month-end close.',
      },
    },
    {
      id: 'roas', tone: 'lavender', label: 'Total ROAS', value: hasSpend ? fmtX(roas) : dash,
      meta: hasSpend ? `${fmtPct((adSpent / scope.cash) * 100, 2)} spend share` : 'No paid spend',
      status: hasSpend ? getGoalStatus('higher', roas, GOALS.roas) : null,
      detail: {
        description: 'Program collections divided by net ad spend.',
        facts: [['Collections', fmtINR(scope.cash)], ['Net ad spend', fmtINR(adSpent)], ['Goal', fmtX(GOALS.roas)]],
        note: 'ROAS above goal means there is room to scale the winning ad sets.',
      },
    },
    { id: 'l2-sales', tone: 'aqua', label: 'L2 Sales', value: fmtNum(scope.diamond), meta: 'Diamond enrolments' },
    { id: 'l1-sales', tone: 'apricot', label: 'L1 Sales', value: fmtNum(scope.silver), meta: 'Silver enrolments' },
    { id: 'paid-leads', tone: 'blue', label: 'Paid Leads', value: fmtNum(scope.paid), metaStrong: hasSpend ? `${fmtINR(paidCpl)} CPL` : 'No paid spend' },
    {
      id: 'cpl-goal', tone: 'apricot', label: 'Paid Lead CPL Goal', value: fmtINR(GOALS.paidCpl),
      meta: hasSpend ? `${fmtINR(paidCpl)} actual` : 'No paid spend',
      status: hasSpend ? getGoalStatus('lower', paidCpl, GOALS.paidCpl) : null,
    },
    {
      id: 'lead-goal', tone: 'mint', label: 'Lead Goal', value: `${fmtNum(scope.paid)} / ${fmtNum(leadGoal)}`,
      progress: leadPct, meta: `${fmtNum(leadGoal / 2)} due to date`,
      status: getGoalStatus('higher', scope.paid, leadGoal / 2),
    },
    { id: 'total-leads', tone: 'lavender', label: 'Total Leads', value: fmtNum(scope.unique), metaStrong: hasSpend ? `${fmtINR(totalCpl)} CPL` : 'Organic only' },
    { id: 'free-leads', tone: 'aqua', label: 'Free Leads', value: fmtNum(scope.free), metaStrong: hasSpend ? `${fmtINR(freeCpl)} CPL` : 'Organic only' },
    { id: 'l2-roas', tone: 'lavender', label: 'L2 ROAS', value: hasSpend ? fmtX(ATTRIBUTION.l2Roas) : dash, meta: 'Diamond · net return' },
    { id: 'l2-cac', tone: 'blue', label: 'L2 CAC', value: hasSpend ? fmtINR(ATTRIBUTION.l2Cac) : dash, meta: 'Per ad-linked Diamond buyer' },
    { id: 'l1-roas', tone: 'lavender', label: 'L1 ROAS', value: hasSpend ? fmtX(ATTRIBUTION.l1Roas) : dash, meta: 'Silver · net return' },
    { id: 'l1-cac', tone: 'apricot', label: 'L1 CAC', value: hasSpend ? fmtINR(ATTRIBUTION.l1Cac) : dash, meta: 'Per ad-linked Silver buyer' },
    { id: 'junk', tone: 'rose', label: 'Junk Leads', value: fmtNum(scope.junk), meta: 'Flagged in CRM' },
  ];
}

// ---------- Funnel ----------
export function buildFunnel(scope) {
  const paid = scope.paid;
  const booked = paid * FUNNEL_RATES.booked;
  const attended = booked * FUNNEL_RATES.attended;
  const diamond = Math.min(scope.diamond, attended);
  return {
    steps: [
      { label: 'Paid Leads', value: paid, fill: '#335DB6', owner: 'Marketing', note: 'Check payment completions and campaign source.' },
      { label: 'Consultations booked', value: booked, fill: '#5376C2', owner: 'Sales', note: 'Leads who picked a consultation slot after paying ₹199.' },
      { label: 'Consultations attended', value: attended, fill: '#638AC6', owner: 'Sales', note: 'Follow up no-shows within 24 hours to rebook.' },
      { label: 'Diamond enrollments', value: diamond, fill: '#7563B6', owner: 'Sales', note: 'Attendees who enrolled in the Diamond program.' },
    ],
    attendedRate: paid ? (attended / paid) * 100 : 0,
  };
}
