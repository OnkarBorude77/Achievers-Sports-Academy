import { useState } from "react";

// Shown inside the pop-up. onSave(branch) returns false if browser storage is full.
export default function BranchForm({ initial, onSave, onClose }) {
  const [f, setF] = useState({
    name: initial?.name ?? "",
    sensei: initial?.sensei ?? "",
    address: initial?.address ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
  });
  const [error, setError] = useState("");
  const set = (key) => (e) => setF({ ...f, [key]: e.target.value });

  function handleSubmit(e) {
    e.preventDefault();
    const saved = onSave({
      id: initial?.id ?? `branch-${Date.now()}`,
      name: f.name.trim(),
      sensei: f.sensei.trim(),
      address: f.address.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
    });
    if (saved) onClose();
    else setError("Browser storage is full. Delete something you no longer need and try again.");
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
          <button className="btn btn-primary" type="submit">{initial ? "Save branch" : "Add branch"}</button>
          <button className="btn btn-ghost" type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
