import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
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
  useEffect(() => {
    document.title = `${site.name} | Karate Classes`;
  }, [site.name]);

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