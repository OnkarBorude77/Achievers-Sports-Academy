import { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { OwnerProvider } from "./components/OwnerContext.jsx";
import OwnerTools from "./components/OwnerTools.jsx";
import { useSite } from "./components/SettingsContext.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Achievements from "./pages/Achievements.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";

const PAGE_TITLES = {
  "/": { title: "Karate Classes for Kids, Teens and Adults", desc: "Join professional karate training. Build discipline, fitness and confidence." },
  "/about": { title: "About Us", desc: "Meet our instructors and learn the story behind our karate academy." },
  "/achievements": { title: "Achievements", desc: "Medals, belts and tournament results from our karate students." },
  "/gallery": { title: "Gallery", desc: "Photos from our karate classes, gradings and tournaments." },
  "/contact": { title: "Contact and Admissions", desc: "Contact us for admissions, class timings and fees." },
};

function NotFound() {
  return (
    <section className="section">
      <div className="container narrow">
        <h1>Page not found</h1>
        <p className="lead">That page does not exist. Head back to the home page and try again.</p>
        <Link className="btn btn-primary" to="/">Go to home</Link>
      </div>
    </section>
  );
}

export default function App() {
  const site = useSite();
  const { pathname } = useLocation();

  useEffect(() => {
    const key = pathname.replace(/\/+$/, "") || "/";
    const page = PAGE_TITLES[key];
    document.title = page
      ? `${site.name} | ${page.title}`
      : `${site.name} | Karate Classes`;

    if (page) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", `${site.name}: ${page.desc}`);
    }
  }, [site.name, pathname]);

  return (
    <OwnerProvider>
      <button
        type="button"
        className="skip-link"
        onClick={() => document.getElementById("main")?.focus()}
      >
        Skip to content
      </button>
      <ScrollToTop />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <OwnerTools />
    </OwnerProvider>
  );
}