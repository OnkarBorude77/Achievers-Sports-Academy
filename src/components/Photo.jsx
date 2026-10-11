import { useState } from "react";
import { useSettings } from "./SettingsContext.jsx";

// Shows /public/images/<file>. If you replaced this photo with "Edit site", the new one is shown.
// Photos added in Owner mode are stored as data URLs and shown directly.
// If a file isn't there yet, shows a labelled placeholder so you know which photo to add.
export default function Photo({ file, alt, className = "" }) {
  const { photos } = useSettings();
  const [failedFile, setFailedFile] = useState(null);

  const shown = !file.startsWith("data:") && photos[file] ? photos[file] : file;
  const isData = shown.startsWith("data:");

  if (failedFile === shown) {
    return (
      <div className={`photo-missing ${className}`} role="img" aria-label={alt}>
        <span>
          Add photo
          <strong>{file}</strong>
        </span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={isData ? shown : `${import.meta.env.BASE_URL}images/${shown}`}
      alt={alt}
      loading="lazy"
      onError={() => setFailedFile(shown)}
    />
  );
}