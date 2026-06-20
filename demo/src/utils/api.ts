const STRAPI_URL =
  (import.meta.env.VITE_STRAPI_URL as string | undefined) ?? 'http://localhost:1337';

export interface CreateInstructorInput {
  type: 'individual' | 'organization';
  name: string;
  title?: string;
  course_categories?: string[];
  instructor_sources?: string[];
  locations?: string[];
  keywords?: string[];
  teaching_domain?: string;
  target_audience?: string;
  service_highlights?: string;
  contact_info?: Record<string, string>;
  review_status?: 'draft' | 'pending' | 'published' | 'rejected';
  review_note?: string;
  avatar?: number;
}

export interface ApiResult {
  success: boolean;
  data?: unknown;
  error?: string;
  savedLocally?: boolean;
}

const STORAGE_KEY = 'fitnfun-pending-instructors';

export async function createInstructor(
  input: CreateInstructorInput,
): Promise<ApiResult> {
  const payload = {
    data: {
      ...input,
      review_status: input.review_status ?? 'draft',
    },
  };

  try {
    const res = await fetch(`${STRAPI_URL}/api/instructors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const msg =
        err?.error?.message ?? `HTTP ${res.status}: ${res.statusText}`;
      return { success: false, error: `API 错误: ${msg}` };
    }

    const data = await res.json();
    removePendingEntry(input.name);
    return { success: true, data };
  } catch {
    return saveLocally(
      payload.data,
      '无法连线至伺服器，已暂存至本地',
    );
  }
}

function saveLocally(
  data: CreateInstructorInput,
  reason: string,
): ApiResult {
  const pending = getPending();
  pending.push({ ...data, _savedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  return { success: false, error: reason, savedLocally: true };
}

function removePendingEntry(name: string): void {
  const pending = getPending().filter(
    (e: CreateInstructorInput & { _savedAt?: string }) => e.name !== name,
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
}

export function getPending(): (CreateInstructorInput & { _savedAt?: string })[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function clearPending(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function uploadAvatar(file: File): Promise<number | null> {
  const form = new FormData();
  form.append('files', file);

  try {
    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return extractMediaId(data);
  } catch {
    return null;
  }
}

function extractMediaId(body: unknown): number | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  if (b.data && typeof b.data === 'object') {
    const id = (b.data as Record<string, unknown>).id;
    if (typeof id === 'number') return id;
  }
  if (Array.isArray(b) && b[0] && typeof b[0] === 'object') {
    const id = (b[0] as Record<string, unknown>).id;
    if (typeof id === 'number') return id;
  }
  if (typeof b.id === 'number') return b.id;
  return null;
}
