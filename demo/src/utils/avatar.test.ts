import { describe, it, expect } from 'vitest';
import { resolveAvatarUrl } from './avatar';

describe('resolveAvatarUrl', () => {
  it('returns null for null', () => {
    expect(resolveAvatarUrl(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(resolveAvatarUrl(undefined)).toBeNull();
  });

  it('passes through string paths unchanged', () => {
    expect(resolveAvatarUrl('demo/public/images/default-avatar.jpg')).toBe(
      'demo/public/images/default-avatar.jpg'
    );
  });

  it('prepends baseUrl to relative Strapi URLs', () => {
    expect(resolveAvatarUrl({ url: '/uploads/x.jpg' }, 'http://strapi:1337')).toBe(
      'http://strapi:1337/uploads/x.jpg'
    );
  });

  it('keeps absolute URLs as-is', () => {
    expect(resolveAvatarUrl({ url: 'https://cdn.example.com/x.jpg' })).toBe(
      'https://cdn.example.com/x.jpg'
    );
  });

  it('returns null for object without url', () => {
    expect(resolveAvatarUrl({ id: 1 } as any)).toBeNull();
  });
});
