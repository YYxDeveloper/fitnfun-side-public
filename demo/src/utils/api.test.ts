import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { uploadAvatar } from './api';

const STRAPI_URL = 'http://localhost:1337';

function makeResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Internal Server Error',
    json: async () => body,
  } as Response;
}

function makePng(sizeBytes = 1024): File {
  return new File([new Uint8Array(sizeBytes)], 'avatar.png', {
    type: 'image/png',
  });
}

describe('uploadAvatar', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns media id on successful upload', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      makeResponse({ data: { id: 42, url: '/uploads/avatar.png' } }),
    );

    const id = await uploadAvatar(makePng());
    expect(id).toBe(42);
  });

  it('returns null on non-2xx response', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(
      makeResponse({ error: { message: 'too large' } }, false, 413),
    );

    const id = await uploadAvatar(makePng());
    expect(id).toBeNull();
  });

  it('returns null on network error', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network down'));

    const id = await uploadAvatar(makePng());
    expect(id).toBeNull();
  });

  it('returns null when response shape is unexpected', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(makeResponse({}));

    const id = await uploadAvatar(makePng());
    expect(id).toBeNull();
  });

  it('POSTs multipart/form-data to /api/upload', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(makeResponse({ data: { id: 1 } }));

    await uploadAvatar(makePng());

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe(`${STRAPI_URL}/api/upload`);
    expect(init?.method).toBe('POST');
    expect(init?.body).toBeInstanceOf(FormData);
  });
});
