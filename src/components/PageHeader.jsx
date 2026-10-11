// The dark band at the top of every inner page.
export default function PageHeader({ title, intro }) {
  return (
    <section className="page-header on-indigo">
      <div className="container">
        <h1>{title}</h1>
        {intro && <p className="lead muted-on-indigo">{intro}</p>}
      </div>
    </section>
  );
}
