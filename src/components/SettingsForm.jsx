import { useState } from "react";
import { useSettings } from "./SettingsContext.jsx";
import { sitePhotos } from "../data/siteData.js";
import { processImage } from "../data/images.js";

const toLines = (text) => text.split("\n").map((l) => l.trim()).filter(Boolean);

function Thumb({ file, src }) {
  const [failed, setFailed] = useState(false);
  if (failed && !src) return <div className="slot-thumb slot-empty">No photo yet</div>;
  return (
    <img
      className="slot-thumb"
      src={src || `${import.meta.env.BASE_URL}images/${file}`}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}

function Input({ id, label, value, onChange, full = false, rows, type = "text", hint }) {
  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {rows ? (
        <textarea id={id} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <p className="owner-count">{hint}</p>}
    </div>
  );
}

export default function SettingsForm({ onClose }) {
  const { site, photos, save, reset } = useSettings();
  const [f, setF] = useState({
    name: site.name,
    tagline: site.tagline,
    style: site.style,
    foundedYear: site.foundedYear,
    heroTitle: site.heroTitle,
    heroText: site.heroText,
    phone: site.phone,
    whatsapp: site.whatsapp,
    email: site.email,
    address: site.address.join("\n"),
    mapEmbedUrl: site.mapEmbedUrl,
    instagram: site.instagram,
    facebook: site.facebook,
    youtube: site.youtube,
    story: site.story,
    senseiName: site.senseiName,
    senseiRank: site.senseiRank,
    senseiBio: site.senseiBio,
    senseiCredentials: site.senseiCredentials.join("\n"),
  });
  const [pics, setPics] = useState(photos);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (value) => setF((prev) => ({ ...prev, [key]: value }));

  async function choosePhoto(slotFile, chosen) {
    if (!chosen) return;
    try {
      const { dataUrl } = await processImage(chosen, 1600, 0.82);
      setPics((prev) => ({ ...prev, [slotFile]: dataUrl }));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function chooseLogo(chosen) {
    if (!chosen) return;
    try {
      const { dataUrl } = await processImage(chosen, 400, 0.9, "image/png");
      setPics((prev) => ({ ...prev, logo: dataUrl }));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  function removeLogo() {
    setPics((prev) => {
      const next = { ...prev };
      delete next.logo;
      return next;
    });
  }

  function useOriginal(slotFile) {
    setPics((prev) => {
      const next = { ...prev };
      delete next[slotFile];
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fields = {
      ...f,
      address: toLines(f.address),
      senseiCredentials: toLines(f.senseiCredentials),
    };
    setBusy(true);
    setError("");
    const result = await save({ fields, photos: pics });
    setBusy(false);
    if (result.ok) onClose();
    else setError(result.error);
  }

  async function handleReset() {
    if (!window.confirm("Reset all site details and replaced photos back to the originals?")) return;
    setBusy(true);
    const result = await reset();
    setBusy(false);
    if (result.ok) onClose();
    else setError(result.error);
  }

  return (
    <form className="owner-form" onSubmit={handleSubmit}>
      <h3 className="full settings-heading">Logo</h3>
      <div className="full">
        <div className="slot">
          {pics.logo ? (
            <img className="slot-thumb logo-thumb" src={pics.logo} alt="Logo preview" />
          ) : (
            <div className="slot-thumb slot-empty">Default mark</div>
          )}
          <div>
            <label className="slot-label" htmlFor="slot-logo">Logo shown in the menu bar, before your dojo name</label>
            <p className="owner-count">A PNG with a transparent background works best.</p>
            <input id="slot-logo" type="file" accept="image/*" onChange={(e) => chooseLogo(e.target.files[0])} />
            {pics.logo && (
              <button type="button" className="link-btn dark" onClick={removeLogo}>
                Remove logo (use the default mark)
              </button>
            )}
          </div>
        </div>
      </div>

      <h3 className="full settings-heading">Photos</h3>
      <div className="full">
        {sitePhotos.map((slot) => (
          <div className="slot" key={slot.file}>
            <Thumb file={slot.file} src={pics[slot.file]} />
            <div>
              <label className="slot-label" htmlFor={`slot-${slot.file}`}>{slot.label}</label>
              <p className="owner-count">{slot.hint}</p>
              <input
                id={`slot-${slot.file}`}
                type="file"
                accept="image/*"
                onChange={(e) => choosePhoto(slot.file, e.target.files[0])}
              />
              {pics[slot.file] && (
                <button type="button" className="link-btn dark" onClick={() => useOriginal(slot.file)}>
                  Use the original file instead
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h3 className="full settings-heading">Contact details</h3>
      <Input id="s-phone" label="Phone number" value={f.phone} onChange={set("phone")} type="tel" />
      <Input id="s-wa" label="WhatsApp number (with country code)" value={f.whatsapp} onChange={set("whatsapp")} type="tel" />
      <Input id="s-email" label="Email" value={f.email} onChange={set("email")} type="email" />
      <Input id="s-map" label="Google Maps embed link" value={f.mapEmbedUrl} onChange={set("mapEmbedUrl")} />
      <Input id="s-address" label="Address (one line per row)" value={f.address} onChange={set("address")} rows={3} full />

      <h3 className="full settings-heading">Social links</h3>
      <Input id="s-ig" label="Instagram link" value={f.instagram} onChange={set("instagram")} />
      <Input id="s-fb" label="Facebook link" value={f.facebook} onChange={set("facebook")} />
      <Input id="s-yt" label="YouTube link" value={f.youtube} onChange={set("youtube")} />

      <h3 className="full settings-heading">Dojo and home page</h3>
      <Input id="s-name" label="Dojo name" value={f.name} onChange={set("name")} />
      <Input id="s-style" label="Karate style" value={f.style} onChange={set("style")} />
      <Input id="s-year" label="Year founded" value={f.foundedYear} onChange={set("foundedYear")} />
      <Input id="s-tag" label="Short tagline" value={f.tagline} onChange={set("tagline")} />
      <Input id="s-hero" label="Home page headline" value={f.heroTitle} onChange={set("heroTitle")} full />
      <Input id="s-herotext" label="Home page intro text" value={f.heroText} onChange={set("heroText")} rows={3} full />

      <h3 className="full settings-heading">About page</h3>
      <Input
        id="s-story"
        label="Our story"
        value={f.story}
        onChange={set("story")}
        rows={6}
        full
        hint="Leave an empty line between paragraphs."
      />
      <Input id="s-sname" label="Sensei name" value={f.senseiName} onChange={set("senseiName")} />
      <Input id="s-srank" label="Sensei rank" value={f.senseiRank} onChange={set("senseiRank")} />
      <Input id="s-sbio" label="About the sensei" value={f.senseiBio} onChange={set("senseiBio")} rows={5} full />
      <Input
        id="s-creds"
        label="Sensei credentials (one per line)"
        value={f.senseiCredentials}
        onChange={set("senseiCredentials")}
        rows={4}
        full
      />

      <div className="full">
        <button className="link-btn dark" type="button" onClick={handleReset}>
          Reset all details and photos to the originals
        </button>
      </div>

      <div className="full sticky-actions">
        <p className="form-status error" role="alert">{error}</p>
        <div className="modal-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
          <button className="btn btn-ghost" type="button" onClick={onClose} disabled={busy}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
