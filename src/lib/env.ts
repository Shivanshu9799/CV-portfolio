/** Public build-time flags. Safe to import from server and client code. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
export const SHOW_UNCONFIRMED = process.env.NEXT_PUBLIC_SHOW_UNCONFIRMED === 'true';
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '';
/** Optional second line under the scale chart. Off unless the candidate asks for it. */
export const SHOW_CUMULATIVE_LINE = process.env.NEXT_PUBLIC_SHOW_CUMULATIVE === 'true';

/** Prefix a root-relative asset path (public/ files, plain anchors) with the base path. */
export function withBase(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}
