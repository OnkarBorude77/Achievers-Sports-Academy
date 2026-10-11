import { useState } from "react";
import { galleryCategories } from "../data/siteData.js";

const categories = galleryCategories.filter((c) => c !== "All");

// Shown inside the pop-up. onAdd({ alt, category }, files) returns { ok } or { ok: false, error }.
export default function GalleryForm({ onAdd, onClose }) {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please choose at least one photo.");
      return;
    }
    setBusy(true);
    setError("");
    const result = await onAdd({ alt: caption.trim() || "Dojo photo", category }, files);
    setBusy(false);
    if (result.ok) onClose();
    else setError(result.error);
  }

  return (
    <form className="owner-form" onSubmit={handleSubmit}>
      <div className="field full">
        <label htmlFor="g-files">Photos (you can choose several)</label>
        <input
          id="g-files"
          type="file"
          accept="image/*"
          multiple
          required
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        {files.length > 0 && <p className="owner-count">{files.length} photo{files.length > 1 ? "s" : ""} selected</p>}
      </div>
      <div className="field">
        <label htmlFor="g-caption">Caption</label>
        <input id="g-caption" type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="g-category">Category</label>
        <select id="g-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="full">
        <p className="form-status error" role="alert">{error}</p>
        <div className="modal-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Uploading…" : "Add to gallery"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClose} disabled={busy}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
