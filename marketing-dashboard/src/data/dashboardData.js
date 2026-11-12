// Demo data for the My Health School marketing dashboard.
// Base numbers are for "1–15 Nov 2026"; other date ranges scale from these.

export const DATE_RANGES = [
  { value: 'mtd', label: '1–15 Nov 2026', factor: 1 },
  { value: 'week', label: 'Last 7 days', factor: 0.47 },
  { value: 'oct', label: 'October 2026', factor: 1.92 },
  { value: 'custom', label: 'Custom range', factor: 1 },
];

export const SOURCES = ['All sources', 'Meta', 'Google', 'Organic'];

export const SOURCE_COLORS = { Meta: '#456BC4', Google: '#398877', Organic: '#A97843' };

// Per-source raw numbers for the base period.
export const SOURCE_DATA = {
  Meta: { spend: 990000, paid: 1250, free: 1800, unique: 2420, junk: 120, silver: 30, diamond: 166, cash: 4870000 },
  Google: { spend: 210000, paid: 250, free: 600, unique: 640, junk: 35, silver: 10, diamond: 34, cash: 1010000 },
  Organic: { spend: 0, paid: 0, free: 600, unique: 240, junk: 10, silver: 31, diamond: 0, cash: 120000 },
};

export const BOOKING_FEE = 199;

export const GOALS = {
  paidCpl: 700,
  leadGoal: 3000,
  roas: 5,
};

// Ratios that come from attribution, not simple sums.
export const ATTRIBUTION = {
  l2Roas: 7.51,
  l1Roas: 2.0,
  l2Cac: 5300,
  l1Cac: 3500,
};

export const FUNNEL_RATES = { booked: 1100 / 1500, attended: 750 / 1100, diamond: 200 / 750 };

export const TRENDS = {
  weekly: {
    labels: ['1–7 Nov', '8–14 Nov', '15 Nov · partial'],
    cash: { spend: [540000, 560000, 100000], cash: [2700000, 2820000, 480000] },
    leads: { paid: [680, 700, 120] },
    sales: { silver: [32, 33, 6], diamond: [92, 94, 14] },
  },
  monthly: {
    labels: ['Sep 2026', 'Oct 2026', 'Nov · to date'],
    cash: { spend: [2050000, 2304000, 1200000], cash: [9800000, 11500000, 6000000] },
    leads: { paid: [2600, 2880, 1500] },
    sales: { silver: [120, 136, 71], diamond: [330, 384, 200] },
  },
};

export const ACTIONS = [
  { tone: 'red', title: 'Paid Lead CPL is over target', detail: '₹800 actual · ₹700 target', owner: 'Marketing', note: 'Review ad sets with CPL above ₹900 and shift budget to the daily-routine creatives.' },
  { tone: 'amber', title: 'Consultations missed', detail: '350 of 1,100 booked leads did not attend', owner: 'Sales', note: 'Add a WhatsApp reminder 2 hours before each consultation slot.' },
  { tone: 'blue', title: 'Review consultation follow-up', detail: '26.7% of attendees enrolled in Diamond', owner: 'Sales', note: 'Audit follow-up calls for attendees who did not enrol within 48 hours.' },
];

export const PROGRAM_ROUTES = [
  { tier: 'diamond', name: '₹199 consultation', key: 'diamond', fill: '#7862B4' },
  { tier: 'silver', name: 'Paid acquisition', key: 'silverPaid', fill: '#379181' },
  { tier: 'silver', name: 'Organic direct', key: 'silverOrganic', fill: '#379181' },
];

export const CREATIVES = [
  { theme: 'Daily routine', name: 'Daily routine reel', source: 'Meta', format: 'Reel', mark: '▶', tone: 'blue', paid: 410, free: 120, sales: 78 },
  { theme: 'Food habits', name: 'Food habits video', source: 'Meta', format: 'Video', mark: '▶', tone: 'mint', paid: 310, free: 90, sales: 51 },
  { theme: 'Diabetes program', name: 'Diabetes program search', source: 'Google', format: 'Search ad', mark: '⌕', tone: 'lavender', paid: 150, free: 40, sales: 27 },
  { theme: 'Simple meals', name: 'Simple meals reel', source: 'Organic', format: 'Reel', mark: '▶', tone: 'peach', paid: 0, free: 230, sales: 19 },
];

// ---------- Audience insights ----------

export const AUDIENCE_PROFILES = {
  paid: [
    { tone: 'blue', heading: 'Profile by buyer volume', title: 'Age 46–55', stat: '90 of 450 joined', caption: '20.0% in the matched ₹199 cohort' },
    { tone: 'mint', heading: 'Profile by join rate', title: 'Fourth entry or later', stat: '40 of 150 joined', caption: '26.7% in the matched ₹199 cohort' },
  ],
  buyers: [
    { tone: 'blue', heading: 'Largest buyer group', title: 'Male · 46–55', stat: '64 of 200 buyers', caption: '32.0% of all Diamond buyers' },
    { tone: 'mint', heading: 'Fastest to join', title: 'Chennai', stat: '61 of 200 buyers', caption: 'Median 3 days from ₹199 payment' },
  ],
};

export const CALL_INSIGHTS = {
  setter: {
    summary: { calls: 140, people: 120, answered: 100, missing: 20 },
    themes: [
      ['Need', 'Sugar management help', 32],
      ['Desire', 'Fewer medicines', 26],
      ['Problem', 'Irregular meal timing', 23],
      ['Frustration', 'Daily tablet burden', 20],
      ['Fear', 'Worry about future health', 17],
      ['Pain Point', 'Interrupted sleep', 14],
    ],
    quote: '“I need help managing my sugar around my daily schedule.”',
    idea: 'A simpler daily routine for managing diabetes.',
  },
  consultation: {
    summary: { calls: 96, people: 90, answered: 82, missing: 8 },
    themes: [
      ['Need', 'Clear meal plan', 30],
      ['Desire', 'Stop insulin increase', 24],
      ['Problem', 'Late-night eating', 19],
      ['Frustration', 'Tried diets before', 18],
      ['Fear', 'Kidney complications', 15],
      ['Pain Point', 'Low energy at work', 12],
    ],
    quote: '“I have tried diets before but nothing fits my work hours.”',
    idea: 'Meal plans that work around shift and office hours.',
  },
  combined: {
    summary: { calls: 236, people: 170, answered: 155, missing: 15 },
    themes: [
      ['Need', 'Sugar management help', 49],
      ['Desire', 'Fewer medicines', 41],
      ['Problem', 'Irregular meal timing', 36],
      ['Frustration', 'Daily tablet burden', 31],
      ['Fear', 'Worry about future health', 27],
      ['Pain Point', 'Interrupted sleep', 22],
    ],
    quote: '“I want to reduce my tablets without feeling hungry all day.”',
    idea: 'How to reduce medicine dependence safely, step by step.',
  },
};

// Each chart: type = columns | stacked | bars. Last item is always "Not answered".
export const AUDIENCE_CHARTS = [
  {
    id: 'age', title: 'Age', subtitle: 'Years of age', type: 'columns',
    items: [['≤25', 40], ['26–35', 120], ['36–45', 340], ['46–55', 450], ['56–65', 370], ['66+', 120], ['Not answered', 60]],
  },
  {
    id: 'gender', title: 'Gender', subtitle: 'Reported gender', type: 'stacked',
    colors: ['#2563eb', '#e11d48', '#7c3aed', '#a6b1c1'],
    items: [['Male', 972], ['Female', 365], ['Other', 13], ['Not answered', 150]],
    insight: (items) => {
      const answered = items.slice(0, -1).reduce((s, [, v]) => s + v, 0);
      return `${((items[0][1] / answered) * 100).toFixed(1)}% male among ${answered.toLocaleString('en-IN')} who answered.`;
    },
  },
  {
    id: 'occupation', title: 'Occupation', subtitle: 'Reported work status', type: 'bars',
    items: [['Private employee', 435], ['Government employee', 120], ['Self-employed or business owner', 300], ['Retired', 180], ['Homemaker', 210], ['Unemployed', 75], ['Student', 30], ['Other', 45], ['Not answered', 105]],
  },
  {
    id: 'sugar', title: 'Blood Sugar', subtitle: 'Reading bands · mg/dL', type: 'columns',
    select: {
      label: 'Reading type',
      options: [
        { value: 'fasting', label: 'Fasting', items: [['<160', 370], ['160–<200', 245], ['200–<300', 205], ['300–<400', 58], ['400–500', 20], ['>500', 7], ['Not answered', 595]] },
        { value: 'after', label: 'After-meal', items: [['<160', 190], ['160–<200', 220], ['200–<300', 300], ['300–<400', 120], ['400–500', 42], ['>500', 18], ['Not answered', 610]] },
        { value: 'random', label: 'Random', items: [['<160', 260], ['160–<200', 230], ['200–<300', 240], ['300–<400', 80], ['400–500', 30], ['>500', 10], ['Not answered', 650]] },
      ],
    },
  },
  {
    id: 'hba1c', title: 'HbA1c', subtitle: 'Recorded value bands', type: 'bars',
    items: [['<5.7%', 21], ['5.7–<6.5%', 83], ['6.5–7.0%', 176], ['>7–8%', 266], ['>8–9%', 226], ['>9–10%', 142], ['>10%', 92], ['Not answered', 494]],
  },
  {
    id: 'years', title: 'Years Since Diagnosis', subtitle: 'Reported time since diagnosis', type: 'columns',
    items: [['<1', 116], ['1–<2', 155], ['2–<3', 173], ['3–<5', 293], ['5–<10', 358], ['10+', 247], ['Not answered', 158]],
  },
  {
    id: 'symptoms', title: 'Reported Symptoms and Health Conditions', subtitle: 'People may report more than one item', type: 'bars', limit: 5,
    items: [['None reported', 360], ['Tingling or numbness in legs or feet', 315], ['Sleep problems', 285], ['Eye or vision problems', 210], ['Frequent thirst or urination', 180], ['High blood pressure', 165], ['Weight gain', 140], ['Not answered', 420]],
  },
  {
    id: 'income', title: 'Monthly Income', subtitle: 'Personal monthly income', type: 'bars',
    items: [['₹0', 75], ['Over ₹0–₹50,000', 420], ['Over ₹50,000–₹1 lakh', 360], ['Over ₹1–₹3 lakh', 240], ['Over ₹3–₹10 lakh', 60], ['Above ₹10 lakh', 15], ['Not answered', 330]],
  },
  {
    id: 'districts', title: 'Tamil Nadu Districts', subtitle: 'Tamil Nadu records only', type: 'bars', limit: 6, total: 1170,
    items: [['Chennai', 334], ['Coimbatore', 183], ['Madurai', 108], ['Tiruchirappalli', 86], ['Salem', 65], ['Tirunelveli', 54], ['Erode', 48], ['Vellore', 44], ['Thanjavur', 40], ['Other districts', 176], ['Not answered', 32]],
  },
  {
    id: 'states', title: 'States', subtitle: 'Reported location across India', type: 'bars', limit: 6,
    items: [['Tamil Nadu', 1170], ['Karnataka', 90], ['Kerala', 63], ['Andhra Pradesh', 54], ['Puducherry', 35], ['Telangana', 27], ['Maharashtra', 22], ['Other states', 15], ['Not answered', 24]],
  },
];

export const TOUCHPOINTS = [
  { label: 'First recorded entry', paid: 700, buyers: 65 },
  { label: 'Second entry', paid: 360, buyers: 50 },
  { label: 'Third entry', paid: 210, buyers: 40 },
  { label: 'Fourth or later', paid: 150, buyers: 40 },
  { label: 'Not answered', note: 'History unavailable', paid: 80, buyers: 5, missing: true },
];
