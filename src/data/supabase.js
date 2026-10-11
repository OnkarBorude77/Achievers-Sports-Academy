import { createClient } from "@supabase/supabase-js";

// These two values come from your Supabase project (see the setup steps).
// Locally: put them in a file named .env.local. On Cloudflare: Settings > Environment variables.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If the values are missing the site still opens, it just shows the starting content.
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      })
    : null;

export const BUCKET = "site-images";
