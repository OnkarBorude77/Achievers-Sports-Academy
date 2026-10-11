import { useCallback, useState } from "react";
import Photo from "../components/Photo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import AddButton from "../components/AddButton.jsx";
import AchievementForm from "../components/AchievementForm.jsx";
import { useOwner } from "../components/OwnerContext.jsx";
import { useAchievements } from "../data/useContent.js";
import { achievementLevels } from "../data/siteData.js";

export default function Achievements() {
  const [level, setLevel] = useState("All");
  const [adding, setAdding] = useState(false);
  const { isOwner } = useOwner();
  const { items, add, remove } = useAchievements();

  const closeForm = useCallback(() => setAdding(false), []);
  const handleAdd = (newItems) => {
    const saved = add(newItems);
    if (saved) setLevel("All");
    return saved;
  };

  const shown = items.filter((a) => level === "All" || a.level === level);
  const years = [...new Set(shown.map((a) => a.year))].sort((a, b) => b - a);

  return (
    <>
      <PageHeader
        title="Achievements"
        intro="Medals, trophies and personal milestones from our students. Every result starts with ordinary weeknight training."
      />

      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="chips" role="group" aria-label="Filter by level">
              {achievementLevels.map((l) => (
                <button
                  key={l}
                  type="button"
                  className="chip"
                  aria-pressed={level === l}
                  onClick={() => setLevel(l)}
                >
                  {l}
                </button>
              ))}
            </div>
            {isOwner && <AddButton label="Add achievement" onClick={() => setAdding(true)} />}
          </div>

          {shown.length === 0 && (
            <div className="empty-state">
              <p>
                {items.length === 0
                  ? "No achievements have been added yet."
                  : "No achievements listed for this level yet."}
              </p>
              {isOwner && items.length === 0 && <p>Use the Add achievement button to add the first one.</p>}
            </div>
          )}

          {years.map((year) => (
            <div className="year-block" key={year}>
              <h2 className="year-title">{year}</h2>
              <ul className="result-list">
                {shown
                  .filter((a) => a.year === year)
                  .map((a) => (
                    <li className={`result ${a.photo ? "" : "no-photo"}`} key={a.id}>
                      {a.photo && (
                        <div className="result-photo frame">
                          <Photo file={a.photo} alt={`${a.title}: ${a.result}`} />
                        </div>
                      )}
                      <div>
                        <h3>{a.result}</h3>
                        <p className="result-meta">{a.title}</p>
                        <p>
                          {a.level} level.{a.who ? ` ${a.who}.` : ""}
                        </p>
                        {isOwner && a.added && (
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => window.confirm("Delete this achievement?") && remove(a.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {adding && (
        <Modal title="Add an achievement" onClose={closeForm}>
          <AchievementForm onAdd={handleAdd} onClose={closeForm} />
        </Modal>
      )}
    </>
  );
}