import Photo from "../components/Photo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useSite } from "../components/SettingsContext.jsx";
import { dojoKun } from "../data/siteData.js";

const NUMERALS = ["一", "二", "三", "四", "五"];

const paragraphs = (text) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export default function About() {
  const site = useSite();

  return (
    <>
      <PageHeader
        title="About us"
        intro={`${site.name} was founded in ${site.foundedYear} with one aim: to teach karate the traditional way, in a friendly and disciplined setting.`}
      />

      {/* STORY */}
      <section className="section">
        <div className="container split">
          <div>
            <h2>Our story</h2>
            {paragraphs(site.story).map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              We teach in the {site.style} tradition and follow a clear belt syllabus, so every
              student always knows what to work on next.
            </p>
          </div>
          <div className="frame">
            <Photo file="dojophoto.jpg" alt="The dojo floor with students lined up for class" />
          </div>
        </div>
      </section>

      {/* SENSEI */}
      <section className="section section-gi">
        <div className="container split split-reverse">
          <div className="frame frame-offset">
            <Photo file="senseiphoto.jpg" alt="Sensei in a black belt, portrait" />
          </div>
          <div>
            <h2>Meet your sensei</h2>
            <p className="sensei-name">
              {site.senseiName}
              {site.senseiRank ? `, ${site.senseiRank}` : ""}
            </p>
            {paragraphs(site.senseiBio).map((p) => (
              <p key={p}>{p}</p>
            ))}
            {site.senseiCredentials.length > 0 && (
              <ul className="check-list">
                {site.senseiCredentials.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* DOJO KUN */}
      <section className="section">
        <div className="container split">
          <div>
            <h2>The dojo kun</h2>
            <p>
              Five principles are recited at the end of class. They apply as much outside the dojo
              as inside it.
            </p>
          </div>
          <ol className="kun-list">
            {dojoKun.map((line, i) => (
              <li key={line}>
                <span className="kun-num" aria-hidden="true" lang="ja">{NUMERALS[i] ?? i + 1}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PHOTO BAND */}
      <section className="section-tight">
        <div className="container band-grid">
          <div className="frame band-item"><Photo file="about-01.jpg" alt="Students practising together" /></div>
          <div className="frame band-item"><Photo file="about-02.jpg" alt="Children bowing at the start of class" /></div>
          <div className="frame band-item"><Photo file="about-03.jpg" alt="Students holding their new belts" /></div>
        </div>
      </section>
    </>
  );
}
