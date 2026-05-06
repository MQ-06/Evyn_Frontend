const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

/**
 * Fetch wrapper for server components — no auth header needed for public endpoints.
 * Uses Next.js fetch with ISR revalidation.
 */
export async function serverFetch<T>(
  path: string,
  options?: { revalidate?: number | false }
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate: options?.revalidate ?? 60 },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} on ${path}`);
  }
  return res.json() as Promise<T>;
}

/** Build a query string from an object, dropping undefined/empty values. */
export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}
