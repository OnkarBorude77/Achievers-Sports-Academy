import { supabase, BUCKET } from "./supabase.js";
import { dataUrlToBlob } from "./images.js";

// Uploads a processed image (data URL) to the public bucket and returns its public web address.
export async function uploadDataUrl(dataUrl, folder) {
  const blob = await dataUrlToBlob(dataUrl);
  const ext = blob.type === "image/png" ? "png" : "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

const MARK = `/storage/v1/object/public/${BUCKET}/`;

function pathFromUrl(url) {
  const i = url ? url.indexOf(MARK) : -1;
  return i > -1 ? decodeURIComponent(url.slice(i + MARK.length)) : null;
}

// Deletes files from the bucket, given their public addresses. Never throws.
export async function removeByUrls(urls) {
  const paths = urls.map(pathFromUrl).filter(Boolean);
  if (paths.length === 0) return;
  try {
    await supabase.storage.from(BUCKET).remove(paths);
  } catch {
    /* a leftover file is harmless */
  }
}

export function friendlyError(e) {
  const msg = (e && e.message) || "";
  if (/row-level security|jwt|not authorized|permission|401|403/i.test(msg)) {
    return "You are not logged in as the owner. Please log in again.";
  }
  if (/fetch|network/i.test(msg)) return "Could not reach the database. Check your internet connection.";
  return msg || "Something went wrong. Please try again.";
}
