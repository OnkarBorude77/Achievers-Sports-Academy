import { useEffect, useState } from "react";
import { achievementLevels } from "../data/siteData.js";

const levels = achievementLevels.filter((l) => l !== "All");

// Shown inside the pop-up. onAdd(data, photoFile) returns { ok } or { ok: false, error }.
export default function AchievementForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    title: "",
    result: "",
    who: "",
    level: levels[0],
    year: new Date().getFullYear(),
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // small preview of the chosen photo
  useEffect(() => {
    if (!file) {
      setPreview("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Please choose a photo.");
      return;
    }
    setBusy(true);
    setError("");
    const result = await onAdd(
      {
        year: Number(form.year),
        level: form.level,
        title: form.title.trim(),
        result: form.result.trim(),
        who: form.who.trim(),
      },
      file
    );
    setBusy(false);
    if (result.ok) onClose();
    else setError(result.error);
  }

  return (
    <form className="owner-form" onSubmit={handleSubmit}>
      <div className="field full">
        <label htmlFor="ach-title">Event name</label>
        <input id="ach-title" name="title" type="text" required value={form.title} onChange={update} />
      </div>
      <div className="field full">
        <label htmlFor="ach-result">Result (for example, Gold medal in kumite)</label>
        <input id="ach-result" name="result" type="text" required value={form.result} onChange={update} />
      </div>
      <div className="field full">
        <label htmlFor="ach-who">Student or team name</label>
        <input id="ach-who" name="who" type="text" value={form.who} onChange={update} />
      </div>
      <div className="field">
        <label htmlFor="ach-level">Level</label>
        <select id="ach-level" name="level" value={form.level} onChange={update}>
          {levels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="ach-year">Year</label>
        <input id="ach-year" name="year" type="number" min="1980" max="2100" required value={form.year} onChange={update} />
      </div>
      <div className="field full">
        <label htmlFor="ach-photo">Photo</label>
        <input id="ach-photo" type="file" accept="image/*" required onChange={(e) => setFile(e.target.files[0] ?? null)} />
        {preview && <img className="photo-preview" src={preview} alt="Chosen photo preview" />}
      </div>
      <div className="full">
        <p className="form-status error" role="alert">{error}</p>
        <div className="modal-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Saving…" : "Add achievement"}
          </button>
          <button className="btn btn-ghost" type="button" onClick={onClose} disabled={busy}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
