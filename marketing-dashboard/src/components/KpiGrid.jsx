import { useState } from 'react';
import { Coins, Flag, Gem, IndianRupee, Medal, Megaphone, Minus, Plus, Target, TrendingUp, UserPlus, Users, Wallet, XCircle } from 'lucide-react';

export const KPI_ICONS = {
  'ad-spent': Megaphone, 'money-in': Wallet, roas: TrendingUp, 'l2-sales': Gem, 'l1-sales': Medal,
  'paid-leads': Users, 'cpl-goal': Target, 'lead-goal': Flag, 'total-leads': Users, 'free-leads': UserPlus,
  'l2-roas': TrendingUp, 'l2-cac': Coins, 'l1-roas': TrendingUp, 'l1-cac': Coins, junk: XCircle,
};

function KpiCard({ kpi, reordering, selected, dropTarget, onOpen }) {
  const Icon = KPI_ICONS[kpi.id] ?? IndianRupee;
  return (
    <button
      type="button"
      className={`kpi tone-${kpi.tone}${String(kpi.value).length > 8 ? ' kpi-long' : ''}${dropTarget ? ' drop-target' : ''}`}
      aria-haspopup={reordering ? undefined : 'dialog'}
      aria-pressed={reordering ? selected : undefined}
      onClick={onOpen}
    >
      {reordering && <span className="kpi-grip" aria-hidden="true" />}
      <span className="kpi-icon" aria-hidden="true"><Icon size={20} strokeWidth={2} /></span>
      <span className="kpi-label">{kpi.label}</span>
      <span className="kpi-value">{kpi.value}</span>
      {kpi.progress != null && (
        <span className="kpi-target-line" aria-hidden="true">
          <span style={{ width: `${kpi.progress}%` }} />
        </span>
      )}
      <span className="kpi-meta">
        {kpi.metaStrong ? <strong>{kpi.metaStrong}</strong> : <span>{kpi.meta}</span>}
        {kpi.status && <span className={`status ${kpi.status.tone}`}>{kpi.status.label}</span>}
      </span>
    </button>
  );
}

// Edit mode: each card gets a − badge to hide it (it fades and shows +), and cards can be
// reordered by drag-and-drop or click-to-pick then click-to-place. Hidden cards drop out of
// the grid once editing is done; in edit mode they stay visible (faded) so they can be restored.
export default function KpiGrid({ kpis, order, hidden, onReorder, onToggleHidden, editing, onOpen }) {
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [picked, setPicked] = useState(null);

  const byId = Object.fromEntries(kpis.map((k) => [k.id, k]));
  const ordered = order.map((id) => byId[id]).filter(Boolean);
  const shown = editing ? ordered : ordered.filter((k) => !hidden.includes(k.id));

  const move = (fromId, toId) => {
    if (!fromId || fromId === toId) return;
    const next = order.filter((id) => id !== fromId);
    // Use the target's original index so dragging forward lands *on* the target's slot.
    next.splice(order.indexOf(toId), 0, fromId);
    onReorder(next);
  };

  const handleClick = (kpi) => {
    if (!editing) return onOpen(kpi);
    if (!picked) return setPicked(kpi.id);
    move(picked, kpi.id);
    setPicked(null);
  };

  const dragHandlers = (kpi) =>
    editing
      ? {
          draggable: true,
          onDragStart: (e) => {
            setDragId(kpi.id);
            e.dataTransfer.effectAllowed = 'move';
          },
          onDragOver: (e) => {
            e.preventDefault();
            setOverId(kpi.id);
          },
          onDragLeave: () => setOverId((cur) => (cur === kpi.id ? null : cur)),
          onDrop: (e) => {
            e.preventDefault();
            move(dragId, kpi.id);
            setDragId(null);
            setOverId(null);
          },
          onDragEnd: () => {
            setDragId(null);
            setOverId(null);
          },
        }
      : {};

  if (!shown.length) {
    return (
      <section className="kpi-grid kpi-empty" id="kpis" data-section="overview" aria-label="Key metrics">
        <p>All cards are hidden. Click <b>Edit</b> and press <b>+</b> on a card to bring it back.</p>
      </section>
    );
  }

  return (
    <section className={`kpi-grid${editing ? ' is-reordering is-editing' : ''}`} id="kpis" data-section="overview" aria-label="Key metrics">
      {shown.map((kpi) => {
        const isHidden = hidden.includes(kpi.id);
        return (
          <div key={kpi.id} className={`kpi-slot${isHidden ? ' is-hidden' : ''}`} {...dragHandlers(kpi)}>
            <KpiCard
              kpi={kpi}
              reordering={editing}
              selected={picked === kpi.id}
              dropTarget={overId === kpi.id && dragId !== kpi.id}
              onOpen={() => handleClick(kpi)}
            />
            {editing && (
              <button
                type="button"
                className={`kpi-toggle ${isHidden ? 'is-add' : 'is-remove'}`}
                aria-label={`${isHidden ? 'Show' : 'Hide'} ${kpi.label}`}
                aria-pressed={!isHidden}
                onClick={() => onToggleHidden(kpi.id)}
              >
                {isHidden ? <Plus size={18} strokeWidth={3} /> : <Minus size={18} strokeWidth={3} />}
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
}
