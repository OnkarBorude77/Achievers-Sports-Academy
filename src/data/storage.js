// Items added through Owner mode are saved in this browser (localStorage).
// To save them on a server instead, replace loadAdded / saveAdded with calls to your backend.
const KEYS = {
  achievements: "dojo_added_achievements",
  gallery: "dojo_added_gallery",
  branches: "dojo_added_branches",
};

export function loadAdded(kind) {
  try {
    return JSON.parse(localStorage.getItem(KEYS[kind])) ?? [];
  } catch {
    return [];
  }
}

// returns false if the browser is out of storage space
export function saveAdded(kind, items) {
  try {
    localStorage.setItem(KEYS[kind], JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

// Site details and photos changed in Owner mode ("Edit site").
const SETTINGS_KEY = "dojo_settings";

export function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return { fields: s?.fields ?? {}, photos: s?.photos ?? {} };
  } catch {
    return { fields: {}, photos: {} };
  }
}

// returns false if the browser is out of storage space
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
}

export function clearSettings() {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch {
    /* ignore */
  }
}