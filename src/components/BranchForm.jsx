import { useState } from "react";

// Shown inside the pop-up. onSave(branch) returns { ok } or { ok: false, error }.
export default function BranchForm({ initial, onSave, onClose }) {
  const [f, setF] = useState({
    name: initial?.name ?? "",
    sensei: initial?.sensei ?? "",
    address: initial?.address ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (e) => setF({ ...f, [key]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await onSave({
      id: initial?.id,
      name: f.name.trim(),
      sensei: f.sensei.trim(),
      address: f.address.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
    });
    setBusy(false);
    if (result.ok) onClose();
    else setError(result.error);
  }

  return (
    <form className="owner-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="br-name">Branch name</label>
        <input id="br-name" type="text" required value={f.name} onChange={set("name")} />
      </div>
      <div className="field">
        <label htmlFor="br-sensei">Sensei name</label>
        <input id="br-sensei" type="text" required value={f.sensei} onChange={set("sensei")} />
      </div>
      <div className="field full">
        <label htmlFor="br-address">Address</label>
        <textarea id="br-address" rows="3" required value={f.address} onChange={set("address")} />
      </div>
      <div className="field">
        <label htmlFor="br-phone">Phone number</label>
        <input id="br-phone" type="tel" required value={f.phone} onChange={set("phone")} />
      </div>
      <div className="field">
        <label htmlFor="br-email">Email (optional)</label>
        <input id="br-email" type="email" value={f.email} onChange={set("email")} />
      </div>
      <div className="full">
        <p className="form-status error" role="alert">{error}</p>
        <div className="modal-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Saving…" : initial ? "Save branch" : "Add branch"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClose} disabled={busy}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
