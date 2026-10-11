import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { site as baseSite } from "../data/siteData.js";
import { supabase } from "../data/supabase.js";
import { friendlyError, removeByUrls, uploadDataUrl } from "../data/remote.js";

const SettingsContext = createContext(null);
const CACHE_KEY = "dojo_cache_settings";
const EMPTY = { fields: {}, photos: {} };

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}
function writeCache(value) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {
    /* cache is optional */
  }
}

// Starting values from siteData.js, overridden by anything saved through "Edit site".
function buildSite(fields) {
  const m = { ...baseSite, ...fields };
  return {
    ...m,
    address: Array.isArray(m.address) ? m.address : [],
    senseiCredentials: Array.isArray(m.senseiCredentials) ? m.senseiCredentials : [],
    phoneHref: (m.phone || "").replace(/[^\d+]/g, ""),
    whatsappDigits: (m.whatsapp || "").replace(/\D/g, ""),
    social: [
      { label: "Instagram", href: m.instagram },
      { label: "Facebook", href: m.facebook },
      { label: "YouTube", href: m.youtube },
    ].filter((s) => s.href && s.href !== "#"),
  };
}

export function SettingsProvider({ children }) {
  // show the last saved copy instantly, then refresh from the database
  const [saved, setSaved] = useState(readCache);
  const site = useMemo(() => buildSite(saved.fields), [saved.fields]);

  useEffect(() => {
    if (!supabase) return undefined;
    let live = true;
    supabase
      .from("site_settings")
      .select("key,value")
      .then(({ data, error }) => {
        if (!live || error || !data) return;
        const next = { fields: {}, photos: {} };
        data.forEach((row) => {
          if (row.key === "fields") next.fields = row.value;
          if (row.key === "photos") next.photos = row.value;
        });
        setSaved(next);
        writeCache(next);
      });
    return () => {
      live = false;
    };
  }, []);

  // next = { fields, photos }. Photos that are new arrive as data URLs and are uploaded here.
  const save = useCallback(
    async (next) => {
      if (!supabase) return { ok: false, error: "The database is not connected yet." };
      try {
        const photos = {};
        for (const [key, value] of Object.entries(next.photos)) {
          photos[key] = value.startsWith("data:") ? await uploadDataUrl(value, "site") : value;
        }
        const now = new Date().toISOString();
        const { error } = await supabase.from("site_settings").upsert([
          { key: "fields", value: next.fields, updated_at: now },
          { key: "photos", value: photos, updated_at: now },
        ]);
        if (error) throw error;
        // delete files that were replaced or removed
        const old = Object.entries(saved.photos)
          .filter(([key, url]) => photos[key] !== url)
          .map(([, url]) => url);
        await removeByUrls(old);
        const result = { fields: next.fields, photos };
        setSaved(result);
        writeCache(result);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: friendlyError(e) };
      }
    },
    [saved.photos]
  );

  const reset = useCallback(async () => {
    if (!supabase) return { ok: false, error: "The database is not connected yet." };
    try {
      const { error } = await supabase.from("site_settings").delete().in("key", ["fields", "photos"]);
      if (error) throw error;
      await removeByUrls(Object.values(saved.photos));
      setSaved(EMPTY);
      writeCache(EMPTY);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: friendlyError(e) };
    }
  }, [saved.photos]);

  const value = useMemo(() => ({ site, photos: saved.photos, save, reset }), [site, saved.photos, save, reset]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
export const useSite = () => useContext(SettingsContext).site;
