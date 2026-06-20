export const ACCEPTED_AVATAR_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
export const MAX_AVATAR_SIZE_LABEL = '5MB';

export type AvatarValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateAvatarFile(file: File): AvatarValidationResult {
  if (
    !ACCEPTED_AVATAR_MIME_TYPES.includes(
      file.type as (typeof ACCEPTED_AVATAR_MIME_TYPES)[number],
    )
  ) {
    return { ok: false, message: '僅支援 JPG / PNG / WebP' };
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return { ok: false, message: `檔案大小不能超過 ${MAX_AVATAR_SIZE_LABEL}` };
  }
  return { ok: true };
}
