import { useCallback, useEffect, useRef, useState } from "react";
import Photo from "../components/Photo.jsx";
import PageHeader from "../components/PageHeader.jsx";
import GalleryForm from "../components/GalleryForm.jsx";
import Modal from "../components/Modal.jsx";
import AddButton from "../components/AddButton.jsx";
import { useOwner } from "../components/OwnerContext.jsx";
import { useGallery } from "../data/useContent.js";
import { galleryCategories } from "../data/siteData.js";

export default function Gallery() {
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(null); // index of the open photo, or null
  const [adding, setAdding] = useState(false);
  const closeRef = useRef(null);
  const { isOwner } = useOwner();
  const { items, loading, add, remove } = useGallery();

  const closeForm = useCallback(() => setAdding(false), []);
  const handleAdd = async (meta, files) => {
    const result = await add(meta, files);
    if (result.ok) setCategory("All");
    return result;
  };
  async function handleRemove(id) {
    if (!window.confirm("Delete this photo?")) return;
    const result = await remove(id);
    if (!result.ok) window.alert(result.error);
  }

  const shown = items.filter((g) => category === "All" || g.category === category);
  const isOpen = open !== null;

  // keyboard: Esc closes, arrows move between photos
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % shown.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + shown.length) % shown.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, shown.length]);

  const current = isOpen ? shown[open] : null;

  return (
    <>
      <PageHeader
        title="Gallery"
        intro="Training, tournaments, gradings and celebrations from the dojo."
      />

      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="chips" role="group" aria-label="Filter by category">
              {galleryCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="chip"
                  aria-pressed={category === c}
                  onClick={() => {
                    setCategory(c);
                    setOpen(null);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            {isOwner && <AddButton label="Add photos" onClick={() => setAdding(true)} />}
          </div>

          {loading && shown.length === 0 && <p className="note">Loading…</p>}

          {!loading && shown.length === 0 && (
            <div className="empty-state">
              <p>{items.length === 0 ? "No photos have been added yet." : "No photos in this category yet."}</p>
              {isOwner && items.length === 0 && <p>Use the Add photos button to upload the first ones.</p>}
            </div>
          )}

          <div className="masonry">
            {shown.map((g, i) => (
              <div className="masonry-tile" key={g.id ?? g.file} style={{ aspectRatio: g.ratio }}>
                <button
                  type="button"
                  className="masonry-item"
                  onClick={() => setOpen(i)}
                  aria-label={`Open photo: ${g.alt}`}
                >
                  <Photo file={g.file} alt={g.alt} />
                </button>
                <span className="tile-caption" aria-hidden="true">{g.alt}</span>
                {isOwner && g.added && (
                  <button type="button" className="tile-remove" onClick={() => handleRemove(g.id)}>
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {adding && (
        <Modal title="Add photos" onClose={closeForm}>
          <GalleryForm onAdd={handleAdd} onClose={closeForm} />
        </Modal>
      )}

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
          <button ref={closeRef} type="button" className="lb-btn lb-close" onClick={() => setOpen(null)}>
            Close
          </button>
          <button
            type="button"
            className="lb-btn lb-prev"
            onClick={() => setOpen((open - 1 + shown.length) % shown.length)}
          >
            Previous
          </button>
          <figure className="lb-figure">
            <Photo key={current.id ?? current.file} file={current.full ?? current.file} alt={current.alt} />
            <figcaption>{current.alt}</figcaption>
          </figure>
          <button
            type="button"
            className="lb-btn lb-next"
            onClick={() => setOpen((open + 1) % shown.length)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
