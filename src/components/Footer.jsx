import { useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "./Navbar.jsx";
import { useOwner } from "./OwnerContext.jsx";
import { useSite } from "./SettingsContext.jsx";

export default function Footer() {
  const site = useSite();
  const { isOwner, login, logout } = useOwner();
  const [showLogin, setShowLogin] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (login(passcode)) {
      setShowLogin(false);
      setPasscode("");
      setError("");
    } else {
      setError("That passcode is not correct.");
    }
  }

  return (
    <footer className="site-footer on-indigo">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">{site.name}</p>
          <p className="muted-on-indigo">{site.tagline}.</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="footer-title">Pages</h2>
          <ul className="plain-list">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer-title">Find us</h2>
          <address>
            {site.address.map((line) => (
              <div key={line}>{line}</div>
            ))}
            {site.phone && <a href={`tel:${site.phoneHref}`}>{site.phone}</a>}
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          </address>
        </div>

        {site.social.length > 0 && (
          <div>
            <h2 className="footer-title">Follow</h2>
            <ul className="plain-list">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="container footer-base muted-on-indigo">
        <div>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>

        <div className="owner-bar">
          {isOwner ? (
            <>
              <span>Owner mode is on. Use the Edit site button to change photos and details.</span>
              <button type="button" className="link-btn" onClick={logout}>Log out</button>
            </>
          ) : showLogin ? (
            <form className="owner-login" onSubmit={handleLogin}>
              <label htmlFor="owner-pass" className="sr-only">Owner passcode</label>
              <input
                id="owner-pass"
                type="password"
                placeholder="Owner passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoComplete="current-password"
              />
              <button type="submit" className="btn btn-light">Unlock</button>
              <span role="alert">{error}</span>
            </form>
          ) : (
            <button type="button" className="link-btn" onClick={() => setShowLogin(true)}>
              Owner login
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}