export type AvatarInput = string | { url: string; id?: number } | null | undefined;

const BASE = import.meta.env.BASE_URL;
const STRAPI_URL = (import.meta.env.VITE_STRAPI_URL as string | undefined) ?? 'http://localhost:1337';

export function resolveAvatarUrl(
  avatar: AvatarInput,
  baseUrl: string = STRAPI_URL
): string | null {
  if (!avatar) return null;
  if (typeof avatar === 'string') {
    if (avatar.startsWith('http')) return avatar;
    if (avatar.startsWith('/')) return `${BASE}${avatar.slice(1)}`;
    return avatar;
  }
  if (typeof avatar === 'object' && avatar.url) {
    if (avatar.url.startsWith('http')) return avatar.url;
    if (avatar.url.startsWith('/')) return `${baseUrl}${avatar.url}`;
    return avatar.url;
  }
  return null;
}
