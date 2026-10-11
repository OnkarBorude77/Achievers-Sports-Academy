import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { site as baseSite } from "../data/siteData.js";
import { clearSettings, loadSettings, saveSettings } from "../data/storage.js";

const SettingsContext = createContext(null);

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
  const [saved, setSaved] = useState(loadSettings);
  const site = useMemo(() => buildSite(saved.fields), [saved.fields]);

  // returns false if browser storage is full
  const save = useCallback((next) => {
    if (!saveSettings(next)) return false;
    setSaved(next);
    return true;
  }, []);

  const reset = useCallback(() => {
    clearSettings();
    setSaved({ fields: {}, photos: {} });
  }, []);

  const value = useMemo(
    () => ({ site, photos: saved.photos, save, reset }),
    [site, saved.photos, save, reset]
  );
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
export const useSite = () => useContext(SettingsContext).site;
