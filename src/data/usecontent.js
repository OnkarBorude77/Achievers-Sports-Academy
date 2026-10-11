import { useCallback, useState } from "react";
import { achievements as baseAchievements, gallery as baseGallery, branches as baseBranches } from "./siteData.js";
import { loadAdded, saveAdded } from "./storage.js";

function useAdded(kind) {
  const [added, setAdded] = useState(() => loadAdded(kind));

  // newItems: array of items. Returns false if the browser storage is full.
  const add = useCallback(
    (newItems) => {
      const next = [...newItems, ...added];
      if (!saveAdded(kind, next)) return false;
      setAdded(next);
      return true;
    },
    [kind, added]
  );

  const remove = useCallback(
    (id) => {
      const next = added.filter((item) => item.id !== id);
      saveAdded(kind, next);
      setAdded(next);
    },
    [kind, added]
  );

  return { added, add, remove };
}

// Added items first, then the ones from siteData.js. Achievements are sorted newest year first.
export function useAchievements() {
  const { added, add, remove } = useAdded("achievements");
  const items = [...added.map((a) => ({ ...a, added: true })), ...baseAchievements].sort(
    (a, b) => b.year - a.year
  );
  return { items, add, remove };
}

export function useGallery() {
  const { added, add, remove } = useAdded("gallery");
  const items = [...added.map((g) => ({ ...g, added: true })), ...baseGallery];
  return { items, add, remove };
}

// Branches keep the order you added them in. Each function returns false if browser storage is full.
export function useBranches() {
  const [added, setAdded] = useState(() => loadAdded("branches"));

  const persist = (next) => {
    if (!saveAdded("branches", next)) return false;
    setAdded(next);
    return true;
  };

  return {
    items: [...baseBranches, ...added.map((b) => ({ ...b, added: true }))],
    add: (branch) => persist([...added, branch]),
    update: (branch) => persist(added.map((b) => (b.id === branch.id ? branch : b))),
    remove: (id) => persist(added.filter((b) => b.id !== id)),
  };
}