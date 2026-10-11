import { useCallback, useEffect, useState } from "react";
import Modal from "./Modal.jsx";
import SettingsForm from "./SettingsForm.jsx";
import { useOwner } from "./OwnerContext.jsx";

// The floating "Edit site" button, shown only in Owner mode.
export default function OwnerTools() {
  const { isOwner } = useOwner();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // lets the footer leave room so the floating button never covers its links
  useEffect(() => {
    document.body.classList.toggle("owner-mode", isOwner);
    return () => document.body.classList.remove("owner-mode");
  }, [isOwner]);

  if (!isOwner) return null;

  return (
    <>
      <button type="button" className="fab" onClick={() => setOpen(true)}>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M2 16l1-4L13 2l3 3L6 15z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        Edit site
      </button>
      {open && (
        <Modal title="Edit site details and photos" wide onClose={close}>
          <SettingsForm onClose={close} />
        </Modal>
      )}
    </>
  );
}