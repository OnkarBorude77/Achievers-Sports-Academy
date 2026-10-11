import { useState } from "react";
import { useSettings } from "./SettingsContext.jsx";

const isUrl = (value) => /^(data:|https?:\/\/)/.test(value);

// Shows /public/images/<file>. If you replaced this photo with "Edit site", the new one is shown.
// Photos from the database arrive as web addresses and are shown directly.
// If a file isn't there yet, shows a labelled placeholder so you know which photo to add.
export default function Photo({ file, alt, className = "" }) {
  const { photos } = useSettings();
  const [failedFile, setFailedFile] = useState(null);

  const shown = !isUrl(file) && photos[file] ? photos[file] : file;

  if (failedFile === shown) {
    return (
      <div className={`photo-missing ${className}`} role="img" aria-label={alt}>
        <span>
          Add photo
          <strong>{isUrl(file) ? "Photo unavailable" : file}</strong>
        </span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={isUrl(shown) ? shown : `${import.meta.env.BASE_URL}images/${shown}`}
      alt={alt}
      loading="lazy"
      onError={() => setFailedFile(shown)}
    />
  );
}
