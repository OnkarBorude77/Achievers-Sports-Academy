import { useEffect, useRef } from "react";

// A pop-up window. Esc or a click outside closes it, Tab stays inside it.
export default function Modal({ title, onClose, wide = false, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("input, select, textarea")?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = [...dialogRef.current.querySelectorAll("button, input, select, textarea, a[href]")].filter(
        (el) => !el.disabled
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={dialogRef}>
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}