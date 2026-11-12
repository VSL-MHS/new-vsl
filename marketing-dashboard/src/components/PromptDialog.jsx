import { useState } from 'react';
import Dialog from './Dialog.jsx';

const PROMPT = `Design a calm, data-dense marketing dashboard for "My Health School" (diabetes reversal programs, India).

Layout
- Fixed navy sidebar (#101b32, 222px): brand mark, CEO Dashboard, Marketing › Dashboard, Sales, Finance; admin avatar in the footer.
- Header: breadcrumb, "Marketing Dashboard" title, Demo data badge, primary "Design prompt" button.
- Filters: Date range and Source selects, Reset, IST period context on the right.
- Tabs: Overview, Performance, Audience Insights; "Rearrange cards" toggle.

Overview
- 5-column grid of pastel KPI cards (blue, mint, lavender, apricot, aqua, rose) with label, large tabular value, meta line and status pill.

Performance
- "What needs action" alerts (red / amber / blue).
- Weekly trends bar chart + ₹199 funnel.
- Channel performance table (sortable) + Program sales by route.
- Top ads and videos as 4 creative cards.

Audience Insights
- Paid Leads / Buyers toggle, two profile highlights, Sales Call Insights themes,
  2-column grid of distribution cards, Touchpoint Trends table.

Style
- Inter, 14px base, ink #122137, accent #2849b6, 1px #e2e8f0 borders, 11–14px radii, Indian number grouping (₹9,01,500).`;

export default function PromptDialog({ open, onClose }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Design prompt" subtitle="The brief this dashboard was built from" className="prompt-dialog">
      <div className="prompt-actions">
        <button type="button" className="button button-primary" onClick={copy}>{copied ? 'Copied' : 'Copy prompt'}</button>
        <button type="button" className="button button-secondary" onClick={onClose}>Close</button>
      </div>
      <pre className="prompt-preview prompt-text">{PROMPT}</pre>
    </Dialog>
  );
}
