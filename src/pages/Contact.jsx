import { useCallback, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { useSite } from "../components/SettingsContext.jsx";
import Modal from "../components/Modal.jsx";
import AddButton from "../components/AddButton.jsx";
import BranchForm from "../components/BranchForm.jsx";
import { useOwner } from "../components/OwnerContext.jsx";
import { useBranches } from "../data/useContent.js";

export default function Contact() {
  const site = useSite();
  const { isOwner } = useOwner();
  const { items: branches, add: addBranch, update: updateBranch, remove: removeBranch } = useBranches();
  async function handleRemoveBranch(id) {
    if (!window.confirm("Delete this branch?")) return;
    const result = await removeBranch(id);
    if (!result.ok) window.alert(result.error);
  }
  const [editing, setEditing] = useState(null); // null, "new", or the branch being edited
  const closeBranch = useCallback(() => setEditing(null), []);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();

    // Preferred: open WhatsApp chat with the sensei's number, message already typed.
    // (WhatsApp cannot send for the visitor, they tap Send in WhatsApp to finish.)
    if (site.whatsappDigits) {
      const text =
        `Hello, I am ${form.name}.\n` +
        `Phone: ${form.phone}\n` +
        (form.email ? `Email: ${form.email}\n` : "") +
        `\n${form.message}`;
      const url = `https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent(text)}`;
      const win = window.open(url, "_blank", "noopener");
      if (!win) window.location.href = url; // pop-up blocked: open in this tab instead
      setStatus("sent");
      return;
    }

    // No WhatsApp number set: open the visitor's email app with the message filled in.
    if (!site.formEndpoint) {
      const subject = encodeURIComponent(`Enquiry from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <PageHeader
        title="Contact us"
        intro="Questions about classes, gradings or joining? Send us a message or drop in during class time."
      />

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>Visit or call</h2>
            <address>
              {site.address.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>
            <ul className="plain-list contact-links">
              {site.phone && (
                <li><a href={`tel:${site.phoneHref}`}>Call {site.phone}</a></li>
              )}
              {site.email && (
                <li><a href={`mailto:${site.email}`}>Email {site.email}</a></li>
              )}
              {site.whatsappDigits && (
                <li>
                  <a href={`https://wa.me/${site.whatsappDigits}`} target="_blank" rel="noreferrer">
                    Message on WhatsApp
                  </a>
                </li>
              )}
            </ul>

          </div>

          <div className="contact-form-wrap">
            <h2>Send a message</h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={update} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" required value={form.phone} onChange={update} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={update} />
              </div>
              <div className="field">
                <label htmlFor="message">How can we help?</label>
                <textarea id="message" name="message" rows="5" required value={form.message} onChange={update} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              {site.whatsappDigits && (
                <p className="owner-count">Your message opens in WhatsApp, ready to send to our sensei.</p>
              )}
              <p className="form-status" role="status" aria-live="polite">
                {status === "sent" && (site.whatsappDigits ? "WhatsApp is opening with your message. Tap Send there to finish." : "Thank you. We will get back to you soon.")}
                {status === "error" && "Your message could not be sent. Please call or email us instead."}
              </p>
            </form>
          </div>
        </div>

        {(branches.length > 0 || isOwner) && (
          <div className="container branches">
            <div className="toolbar">
              <h2>Our branches</h2>
              {isOwner && <AddButton label="Add branch" onClick={() => setEditing("new")} />}
            </div>

            {branches.length === 0 && (
              <div className="empty-state">
                <p>No branches added yet.</p>
                <p>Use the Add branch button to add the first one.</p>
              </div>
            )}

            <ul className="branch-list">
              {branches.map((b) => (
                <li className="branch" key={b.id}>
                  <div>
                    <h3>{b.name}</h3>
                    <p className="branch-sensei">Sensei {b.sensei}</p>
                  </div>
                  <div>
                    <address>{b.address}</address>
                    <div className="branch-links">
                      {b.phone && <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`}>{b.phone}</a>}
                      {b.email && <a href={`mailto:${b.email}`}>{b.email}</a>}
                    </div>
                    {isOwner && b.added && (
                      <div className="branch-actions">
                        <button type="button" className="edit-btn" onClick={() => setEditing(b)}>Edit</button>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleRemoveBranch(b.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="container map-wrap">
          {site.mapEmbedUrl ? (
            <iframe
              title={`Map showing ${site.name}`}
              src={site.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="photo-missing map-missing">
              <span>
                Add map link
                <strong>mapEmbedUrl in src/data/siteData.js</strong>
              </span>
            </div>
          )}
        </div>
      </section>
      {editing && (
        <Modal title={editing === "new" ? "Add a branch" : "Edit branch"} onClose={closeBranch}>
          <BranchForm
            initial={editing === "new" ? null : editing}
            onSave={(b) => (editing === "new" ? addBranch(b) : updateBranch(b))}
            onClose={closeBranch}
          />
        </Modal>
      )}
    </>
  );
}
