export const appBase = import.meta.env?.BASE_URL ?? '/';

/** Public assets use Vite's deployment prefix; remote URLs remain unchanged. */
export function publicUrl(path: string, base = appBase) {
  if (/^(?:https?:|data:|blob:|\/\/)/i.test(path)) return path;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function restoredPagesPath(search: string, base = appBase) {
  const path = new URLSearchParams(search).get('__atlas_route');
  if (!path || !path.startsWith(base) || path.startsWith('//') || path.includes('\\')) return null;
  return path;
}
