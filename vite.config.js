import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" lets the built site work from any folder or sub-path
// (GitHub Pages, Netlify, a shared hosting folder, etc.)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
