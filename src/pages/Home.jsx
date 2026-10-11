import { Link } from "react-router-dom";
import Photo from "../components/Photo.jsx";
import { classes } from "../data/siteData.js";
import { useSite } from "../components/SettingsContext.jsx";
import { useAchievements, useGallery } from "../data/useContent.js";

// Karate virtues for the scrolling strip: [kanji, meaning]
const VIRTUES = [
  ["礼", "Respect"],
  ["心", "Spirit"],
  ["技", "Technique"],
  ["体", "Body"],
  ["道", "The way"],
  ["忍", "Perseverance"],
];

// A large background character for each class card, in the same order as the classes list.
const CLASS_KANJI = ["龍", "少", "武", "護"];

export default function Home() {
  const site = useSite();
  const { items: allAchievements } = useAchievements();
  const { items: allPhotos } = useGallery();
  const featured = allAchievements.slice(0, 3);
  const preview = allPhotos.slice(0, 6);

  // the sun and the big kanji drift a little with the mouse (mouse devices only)
  function handleMove(e) {
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    e.currentTarget.style.setProperty("--px", `${(x * -28).toFixed(1)}px`);
    e.currentTarget.style.setProperty("--py", `${(y * -20).toFixed(1)}px`);
    e.currentTarget.style.setProperty("--kx", `${(x * 22).toFixed(1)}px`);
  }

  const words = site.heroTitle.split(" ");

  return (
    <>
      {/* HERO: a rising sun behind the photo, the headline lifts in word by word */}
      <section className="hero on-indigo" onMouseMove={handleMove}>
        <div className="hero-sky" aria-hidden="true">
          <div className="hero-rays" />
          <div className="hero-sun" />
          <span className="hero-kanji">空手</span>
        </div>

        <div className="hero-media">
          <Photo className="hero-photo" file="herophoto.jpg" alt="A student performing a kick in the dojo" />
          <div className="seal" aria-hidden="true"><span>空手</span></div>
        </div>

        <div className="container hero-inner">
          <div className="hero-copy">
            <h1 aria-label={site.heroTitle}>
              {words.map((word, i) => (
                <span key={`${word}-${i}`}>
                  <span className="word" aria-hidden="true">
                    <span style={{ "--i": i }}>{word}</span>
                  </span>{" "}
                </span>
              ))}
            </h1>
            <p className="lead rise" style={{ "--d": "750ms" }}>{site.heroText}</p>
            <div className="btn-row rise" style={{ "--d": "900ms" }}>
              <Link className="btn btn-primary" to="/contact">Contact us</Link>
              <Link className="btn btn-light" to="/about">About us</Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="scroll-cue"
          aria-label="Scroll down"
          onClick={() => document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" })}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 7l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      {/* VALUES STRIP: scrolls sideways on its own */}
      <div className="marquee" role="region" aria-label="Our values">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul className="marquee-group" key={copy} aria-hidden={copy === 1}>
              {VIRTUES.map(([kanji, meaning]) => (
                <li key={kanji}>
                  <span className="mk" lang="ja">{kanji}</span>
                  <span className="mw">{meaning}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ABOUT SNIPPET */}
      <section className="section" id="intro">
        <div className="container split">
          <div className="frame frame-offset">
            <Photo file="senseiphoto.jpg" alt="Sensei in a white gi, bowing in the dojo" />
          </div>
          <div>
            <h2>A dojo where everyone is expected to grow</h2>
            <p>
              We train in the {site.style} tradition. Technique matters, but so do manners, effort
              and looking out for the person beside you. Every class begins and ends with a bow.
            </p>
            <p>
              Our students range from first-time beginners to competitive athletes, and our sensei
              knows every one of them by name.
            </p>
            <Link className="text-link" to="/about">Read our story</Link>
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section className="section section-mist">
        <div className="container">
          <div className="section-head">
            <h2>Classes for every age</h2>
            <p className="lead">
              Small groups, clear goals and steady progress. Pick the class that fits and we will
              help you settle in.
            </p>
          </div>
          <ul className="class-grid">
            {classes.map((c, i) => (
              <li className="class-card" key={c.name}>
                <span className="class-kanji" aria-hidden="true" lang="ja">{CLASS_KANJI[i] ?? "空"}</span>
                <span className="class-ages">{c.ages}</span>
                <h3>{c.name}</h3>
                <p>{c.text}</p>
                <Link className="text-link" to="/contact">Ask about this class</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ACHIEVEMENTS (hidden until you add some) */}
      {featured.length > 0 && (
        <section className="section section-indigo on-indigo">
          <div className="container">
            <div className="section-head">
              <h2>Results we are proud of</h2>
              <p className="lead muted-on-indigo">
                Our students compete at district, state and national level.
              </p>
            </div>
            <ul className="ach-list">
              {featured.map((a) => (
                <li className="ach-row" key={a.id}>
                  <span className="ach-year">{a.year}</span>
                  <div>
                    <h3>{a.result}</h3>
                    <p className="muted-on-indigo">
                      {a.title}, {a.level.toLowerCase()} level.{a.who ? ` ${a.who}.` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Link className="btn btn-light" to="/achievements">See all achievements</Link>
          </div>
        </section>
      )}

      {/* GALLERY PREVIEW (hidden until you add photos) */}
      {preview.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head row-head">
              <h2>Life in the dojo</h2>
              <Link className="text-link" to="/gallery">Open the full gallery</Link>
            </div>
            <div className="mosaic">
              {preview.map((g) => (
                <div className="mosaic-item" key={g.id ?? g.file}>
                  <Photo file={g.file} alt={g.alt} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLOSING CALL */}
      <section className="closing">
        <div className="closing-sun" aria-hidden="true" />
        <div className="container closing-inner">
          <h2>Questions about classes?</h2>
          <p className="lead">Call, message or visit us. We are happy to talk it through.</p>
          <Link className="btn btn-light" to="/contact">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
