export function buildCanonicalUrl(origin: string, path: string): string {
  const normalizedOrigin = origin.replace(/\/+$/, "");
  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;
  return `${normalizedOrigin}${normalizedPath}`;
}
