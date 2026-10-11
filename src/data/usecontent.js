import { useCallback, useEffect, useState } from "react";
import { achievements as baseAchievements, gallery as baseGallery, branches as baseBranches } from "./siteData.js";
import { supabase } from "./supabase.js";
import { processImage } from "./images.js";
import { friendlyError, removeByUrls, uploadDataUrl } from "./remote.js";

const NOT_CONNECTED = { ok: false, error: "The database is not connected yet." };

function readCache(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}
function writeCache(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* cache is optional */
  }
}

// Turns database rows into the shape the pages already use.
const mapAchievement = (r) => ({
  id: r.id, year: r.year, level: r.level, title: r.title, result: r.result, who: r.who, photo: r.photo_url || "", added: true,
});
const mapPhoto = (r) => ({
  id: r.id, file: r.thumb_url || r.file_url, full: r.file_url, alt: r.alt, category: r.category, ratio: r.ratio, added: true,
});
const mapBranch = (r) => ({
  id: r.id, name: r.name, sensei: r.sensei, address: r.address, phone: r.phone, email: r.email, added: true,
});

// Loads a table. Shows the last saved copy instantly (so pages don't flash empty), then refreshes.
function useTable(table, cacheKey, ascending, mapRow) {
  const cached = readCache(cacheKey);
  const [rows, setRows] = useState(cached ?? []);
  const [loading, setLoading] = useState(cached === null && Boolean(supabase));

  const reload = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending });
    if (!error && data) {
      const mapped = data.map(mapRow);
      setRows(mapped);
      writeCache(cacheKey, mapped);
    }
    setLoading(false);
  }, [table, cacheKey, ascending, mapRow]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { rows, loading, reload };
}

// Every add / update / remove returns { ok: true } or { ok: false, error: "message" }.

export function useAchievements() {
  const { rows, loading, reload } = useTable("achievements", "dojo_cache_achievements", false, mapAchievement);
  const items = [...rows, ...baseAchievements].sort((a, b) => b.year - a.year);

  const add = async (data, file) => {
    if (!supabase) return NOT_CONNECTED;
    try {
      let photo_url = null;
      if (file) {
        const { dataUrl } = await processImage(file, 700, 0.8);
        photo_url = await uploadDataUrl(dataUrl, "achievements");
      }
      const { error } = await supabase.from("achievements").insert({
        year: Number(data.year), level: data.level, title: data.title, result: data.result, who: data.who, photo_url,
      });
      if (error) throw error;
      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendlyError(e) };
    }
  };

  const remove = async (id) => {
    if (!supabase) return NOT_CONNECTED;
    try {
      const row = rows.find((r) => r.id === id);
      const { error } = await supabase.from("achievements").delete().eq("id", id);
      if (error) throw error;
      if (row?.photo) await removeByUrls([row.photo]);
      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendlyError(e) };
    }
  };

  return { items, loading, add, remove };
}

export function useGallery() {
  const { rows, loading, reload } = useTable("gallery_photos", "dojo_cache_gallery", false, mapPhoto);
  const items = [...rows, ...baseGallery];

  // meta: { alt, category }. files: array of image files. Each photo is saved twice:
  // a small version for the grid (saves data) and a larger one for the full-screen viewer.
  const add = async (meta, files) => {
    if (!supabase) return NOT_CONNECTED;
    try {
      const records = [];
      for (const file of files) {
        const full = await processImage(file, 1400, 0.8);
        const thumb = await processImage(file, 640, 0.75);
        records.push({
          file_url: await uploadDataUrl(full.dataUrl, "gallery"),
          thumb_url: await uploadDataUrl(thumb.dataUrl, "gallery"),
          alt: meta.alt, category: meta.category, ratio: full.ratio,
        });
      }
      const { error } = await supabase.from("gallery_photos").insert(records);
      if (error) throw error;
      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendlyError(e) };
    }
  };

  const remove = async (id) => {
    if (!supabase) return NOT_CONNECTED;
    try {
      const row = rows.find((r) => r.id === id);
      const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
      if (error) throw error;
      if (row) await removeByUrls([row.full, row.file]);
      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendlyError(e) };
    }
  };

  return { items, loading, add, remove };
}

export function useBranches() {
  const { rows, loading, reload } = useTable("branches", "dojo_cache_branches", true, mapBranch);
  const items = [...baseBranches, ...rows];

  const fields = (b) => ({ name: b.name, sensei: b.sensei, address: b.address, phone: b.phone, email: b.email });

  const add = async (branch) => {
    if (!supabase) return NOT_CONNECTED;
    try {
      const { error } = await supabase.from("branches").insert(fields(branch));
      if (error) throw error;
      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendlyError(e) };
    }
  };

  const update = async (branch) => {
    if (!supabase) return NOT_CONNECTED;
    try {
      const { error } = await supabase.from("branches").update(fields(branch)).eq("id", branch.id);
      if (error) throw error;
      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendlyError(e) };
    }
  };

  const remove = async (id) => {
    if (!supabase) return NOT_CONNECTED;
    try {
      const { error } = await supabase.from("branches").delete().eq("id", id);
      if (error) throw error;
      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendlyError(e) };
    }
  };

  return { items, loading, add, update, remove };
}
