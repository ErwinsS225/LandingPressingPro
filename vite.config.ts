import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: { port: 5173, open: true },
  // Vercel sert `dist/` : pas de fallback SPA nécessaire ici, la page est
  // unique et le rendu client se fait sur la racine.
  build: { outDir: "dist", sourcemap: false },
});
