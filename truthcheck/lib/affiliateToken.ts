import { createHmac } from 'crypto';

const SECRET = process.env.AFFILIATE_SECRET ?? 'change-me-in-production';

export function generateAffiliateToken(slug: string): string {
  return createHmac('sha256', SECRET).update(slug).digest('hex').slice(0, 32);
}

export function verifyAffiliateToken(slug: string, token: string): boolean {
  const expected = generateAffiliateToken(slug);
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}
