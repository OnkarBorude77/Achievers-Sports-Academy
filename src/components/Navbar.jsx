import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSettings } from "./SettingsContext.jsx";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About us" },
  { to: "/achievements", label: "Achievements" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact us" },
];

export default function Navbar() {
  const { site, photos } = useSettings();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // close the mobile menu whenever the page changes
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label={`${site.name}, home`}>
          {photos.logo ? (
            <img className="brand-logo" src={photos.logo} alt="" />
          ) : (
            <svg width="34" height="34" viewBox="0 0 200 200" aria-hidden="true">
              <path
                d="M100 16C150 14 186 52 182 104C178 154 138 188 92 182C46 176 14 138 18 94C20 66 36 44 62 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="16"
                strokeLinecap="round"
              />
            </svg>
          )}
          <span>{site.name}</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav id="primary-nav" className={`nav-links ${open ? "is-open" : ""}`} aria-label="Main">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}