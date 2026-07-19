// Shared helpers for turning stored media values (path or full URL) into displayable URLs.
// A stored value can be:
//  - a full http(s) URL (external image) -> pass through
//  - a plain storage path within the "media" bucket (e.g. "products/uuid/x.jpg") -> caller signs it
//  - an empty string / null -> caller uses a fallback

export function isHttpUrl(v?: string | null): boolean {
  return !!v && /^https?:\/\//i.test(v);
}

// Extract a media-bucket storage path from either a raw path or a Supabase URL.
// Returns null when the value is not a media-bucket reference.
export function extractMediaPath(v?: string | null): string | null {
  if (!v) return null;
  const trimmed = v.trim();
  if (!trimmed) return null;
  const m = trimmed.match(/\/storage\/v1\/object\/(?:sign|public|authenticated)\/media\/([^?#]+)/);
  if (m) return decodeURIComponent(m[1]);
  if (/^https?:\/\//i.test(trimmed)) return null;
  return trimmed.replace(/^\/+/, "");
}
