import { defineConfig, loadEnv, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Génère `sitemap.xml` et `robots.txt` au moment du build.
 *
 * ## Pourquoi un plugin, et pas des fichiers dans `public/`
 *
 * `index.html` est transforme par Vite, qui y remplace `%VITE_*%`. Les
 * fichiers de `public/` ne le sont PAS : ils sont copies tels quels. Un
 * sitemap contenant `%VITE_SITE_URL%` finirait donc litteralement dans
 * `dist/`, avec un `<loc>` que Google ne peut pas resoudre — donc aucune page
 * indexee.
 *
 * Ces deux fichiers sont de la configuration, pas du contenu : ils doivent
 * vivre dans la configuration. Le plugin les genere depuis `seo/`, ou ils
 * restent lisibles et versionnes, et l'URL vient de la meme variable que le
 * canonical — donc les deux ne peuvent pas diverger.
 *
 * `closeBundle` plutot que `generateBundle` : on ecrit apres la copie de
 * `public/`, ce qui garantit que rien n'ecrase nos fichiers.
 *
 * L'URL est recue en parametre, et non lue dans `process.env` : au moment ou
 * ce module est evalue, Vite n'a pas encore charge le `.env`. La lire ici
 * donnerait `undefined` meme avec un `.env` parfaitement renseigne.
 */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: "pressingpro-seo",
    closeBundle() {
      /*
       * On refuse de produire un sitemap sans URL. Un sitemap dont le `<loc>`
       * est vide est pire qu'absent : il est signale comme invalide, et il
       * laisse croire que le site a declare ses pages alors que non.
       * L'echec est bruyant, au build, donc avant le deploiement.
       */
      if (!siteUrl) {
        throw new Error(
          "VITE_SITE_URL est absente. Renseignez-la dans .env (et dans les variables " +
            "Vercel) : sans elle, le sitemap et le canonical ne peuvent pas etre generes.",
        );
      }

      for (const name of ["sitemap.xml", "robots.txt"]) {
        const source = readFileSync(
          fileURLToPath(new URL(`./seo/${name}`, import.meta.url)),
          "utf8",
        );
        // `%VITE_SITE_URL%` -> URL reelle, meme mecanisme que index.html.
        const output = source.replaceAll("%VITE_SITE_URL%", siteUrl);

        // `dist` est la sortie configuree dans `build.outDir` ci-dessous.
        const outDir = fileURLToPath(new URL("./dist", import.meta.url));
        mkdirSync(outDir, { recursive: true });
        writeFileSync(`${outDir}/${name}`, output, "utf8");
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  /*
   * `loadEnv` est la seule facon fiable de lire le `.env` ici : Vite ne
   * l'injecte pas dans `process.env` au moment de l'evaluation de la
   * configuration. Sans cela, le build echouerait meme avec un `.env`
   * correctement renseigne — ce qui est exactement le piege que la premiere
   * version du plugin tombait dedans.
   */
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = (env.VITE_SITE_URL ?? "").trim().replace(/\/+$/, "");

  return {
    plugins: [tailwindcss(), seoFiles(siteUrl)],
    server: { port: 5173, open: true },
    // Vercel sert `dist/` : pas de fallback SPA nécessaire ici, la page est
    // unique et le rendu client se fait sur la racine.
    build: { outDir: "dist", sourcemap: false },
  };
});
