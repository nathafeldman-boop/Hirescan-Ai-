// Simple in-process rate limiter (per serverless instance).
// Sufficient for burst protection; use Upstash Redis for cross-instance limits.

interface Bucket { count: number; resetAt: number }

const store = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Cleanup expired entries periodically (1/100 chance per call)
  if (Math.random() < 0.01) {
    Array.from(store.entries()).forEach(([k, v]) => {
      if (v.resetAt < now) store.delete(k);
    });
  }

  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count++;
  return true;
}

export function getClientIp(req: { headers: { get: (h: string) => string | null } }): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}
