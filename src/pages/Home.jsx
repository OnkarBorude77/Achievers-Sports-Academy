import { Link } from "react-router-dom";
import Photo from "../components/Photo.jsx";
import { classes } from "../data/siteData.js";
import { useSite } from "../components/SettingsContext.jsx";
import { useAchievements, useGallery } from "../data/useContent.js";

export default function Home() {
  const site = useSite();
  const { items: allAchievements } = useAchievements();
  const { items: allPhotos } = useGallery();
  const featured = allAchievements.slice(0, 3);
  const preview = allPhotos.slice(0, 6);

  return (
    <>
      {/* HERO: the photo fades into the page */}
      <section className="hero">
        <div className="hero-media">
          <Photo className="hero-photo" file="herophoto.jpg" alt="A student performing a kick in the dojo" />
        </div>

        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>{site.heroTitle}</h1>
            <p className="lead">{site.heroText}</p>
            <div className="btn-row">
              <Link className="btn btn-primary" to="/contact">Contact us</Link>
              <Link className="btn btn-ghost" to="/about">About us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SNIPPET */}
      <section className="section">
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
      <section className="section section-gi">
        <div className="container">
          <div className="section-head">
            <h2>Classes for every age</h2>
            <p className="lead">
              Small groups, clear goals and steady progress. Pick the class that fits and we will
              help you settle in.
            </p>
          </div>
          <ul className="class-list">
            {classes.map((c) => (
              <li className="class-row" key={c.name}>
                <span className="class-ages">{c.ages}</span>
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.text}</p>
                </div>
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
              Our students compete at district, state, national and international level.
            </p>
          </div>
          <ul className="ach-list">
            {featured.map((a) => (
              <li className="ach-row" key={a.id}>
                <span className="ach-year">{a.year}</span>
                <div>
                  <h3>{a.result}</h3>
                  <p className="muted-on-indigo">
                    {a.title}, {a.level.toLowerCase()} level. {a.who}.
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
        <div className="container closing-inner">
          <h2>Questions about classes?</h2>
          <p className="lead">Call, message or visit us. We are happy to talk it through.</p>
          <Link className="btn btn-primary" to="/contact">Get in touch</Link>
        </div>
      </section>
    </>
  );
}