// The "+" button used to open an add form.
export default function AddButton({ label, onClick }) {
  return (
    <button type="button" className="btn btn-primary add-btn" onClick={onClick}>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      {label}
    </button>
  );
}