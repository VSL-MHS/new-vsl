import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const EXIT_MS = 240; // keep in sync with the drawer-out animation in theme.css

// Thin wrapper over native <dialog>: gives focus trapping, Esc-to-close and ::backdrop for free.
// Closing is deferred by EXIT_MS so the drawer can slide back out before the element is removed.
export default function Dialog({ open, onClose, title, subtitle, className = 'detail-dialog', children }) {
  const ref = useRef(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      setClosing(false);
      el.showModal();
    }
    if (!open && el.open) el.close();
  }, [open]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, EXIT_MS);
  };

  const handleClick = (e) => {
    // Clicking the backdrop (the dialog element itself) closes it.
    if (e.target === ref.current) requestClose();
  };

  return (
    <dialog
      ref={ref}
      className={`${className}${closing ? ' is-closing' : ''}`}
      onCancel={(e) => {
        e.preventDefault(); // Esc: animate out instead of closing instantly
        requestClose();
      }}
      onClose={() => open && onClose()}
      onClick={handleClick}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-header">
        <button type="button" className="icon-button" aria-label="Close details" onClick={requestClose}>
          <X size={18} strokeWidth={2.2} />
        </button>
        <div>
          <h2 id="dialog-title">{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {open && children}
    </dialog>
  );
}
