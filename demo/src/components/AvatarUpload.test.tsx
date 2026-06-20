import { describe, it, expect } from 'vitest';
import { validateAvatarFile } from '../utils/avatarUpload';

function makeFile(type: string, sizeBytes: number): File {
  return new File([new Uint8Array(sizeBytes)], 'test', { type });
}

describe('validateAvatarFile', () => {
  it('accepts a valid PNG file under 5MB', () => {
    const file = makeFile('image/png', 1024);
    expect(validateAvatarFile(file)).toEqual({ ok: true });
  });

  it('accepts a valid JPEG file', () => {
    const file = makeFile('image/jpeg', 1024);
    expect(validateAvatarFile(file)).toEqual({ ok: true });
  });

  it('accepts a valid WebP file', () => {
    const file = makeFile('image/webp', 1024);
    expect(validateAvatarFile(file)).toEqual({ ok: true });
  });

  it('rejects unsupported MIME type with format error', () => {
    const file = makeFile('application/pdf', 1024);
    const result = validateAvatarFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe('僅支援 JPG / PNG / WebP');
    }
  });

  it('rejects GIF with format error', () => {
    const file = makeFile('image/gif', 1024);
    const result = validateAvatarFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe('僅支援 JPG / PNG / WebP');
    }
  });

  it('rejects files over 5MB with size error', () => {
    const file = makeFile('image/png', 5 * 1024 * 1024 + 1);
    const result = validateAvatarFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe('檔案大小不能超過 5MB');
    }
  });

  it('accepts file at exactly 5MB', () => {
    const file = makeFile('image/png', 5 * 1024 * 1024);
    expect(validateAvatarFile(file)).toEqual({ ok: true });
  });
});
