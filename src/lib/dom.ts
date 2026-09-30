/**
 * Micro-helpers de rendu. Volontairement sans dépendance :
 * le HTML de ce site est statique, ces fonctions évitent seulement
 * de répéter des littéraux de balises.
 */

/** Échappe une valeur destinée à être insérée dans du HTML. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Concatène des fragments de template. */
export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  return strings.reduce(
    (acc, part, i) => acc + part + (i < values.length ? String(values[i]) : ""),
    "",
  );
}

/** Rend une liste d'éléments, avec un séparateur optionnel. */
export function list(items: readonly string[], separator = ""): string {
  return items.join(separator);
}
