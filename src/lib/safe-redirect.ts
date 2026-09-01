/**
 * Only accepts an internal, non-protocol-relative path (e.g. `/checkout`),
 * never an absolute URL or `//host` — the only defense against an
 * open-redirect via the `redirect` query param.
 */
export const safeRedirect = (param: string | null | undefined): string =>
  param && /^\/(?!\/)/.test(param) ? param : "/";
