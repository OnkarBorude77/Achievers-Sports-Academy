// The dark band at the top of every inner page. The big kanji in the background matches the page.
const KANJI = { "About us": "心", Achievements: "勝", Gallery: "気", "Contact us": "礼" };

export default function PageHeader({ title, intro }) {
  return (
    <section className="page-header on-indigo">
      <span className="page-kanji" aria-hidden="true">{KANJI[title] ?? "空"}</span>
      <div className="container">
        <h1 className="rise">{title}</h1>
        {intro && (
          <p className="lead muted-on-indigo rise" style={{ "--d": "140ms" }}>
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
