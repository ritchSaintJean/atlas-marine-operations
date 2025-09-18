import { Request, Response, NextFunction } from 'express';
import { randomBytes, createHmac } from 'crypto';

// CSRF secret for signing tokens (in production this should be from env)
const CSRF_SECRET = process.env.CSRF_SECRET || 'dev-csrf-secret-change-in-production';

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  const randomValue = randomBytes(32).toString('hex');
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(randomValue)
    .digest('hex');
  
  return `${randomValue}.${signature}`;
}

/**
 * Validate a CSRF token
 */
export function validateCsrfToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return false;
  }

  const [randomValue, signature] = parts;
  const expectedSignature = createHmac('sha256', CSRF_SECRET)
    .update(randomValue)
    .digest('hex');

  return signature === expectedSignature;
}

/**
 * CSRF protection middleware
 * Validates CSRF token for state-changing requests (POST, PUT, PATCH, DELETE)
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Only protect state-changing methods
  const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!protectedMethods.includes(req.method)) {
    return next();
  }

  // Get token from X-CSRF-Token header or _csrf field in body
  const token = req.headers['x-csrf-token'] as string || req.body._csrf;

  if (!validateCsrfToken(token)) {
    return res.status(403).json({ 
      error: 'CSRF token missing or invalid',
      code: 'CSRF_INVALID'
    });
  }

  next();
}

/**
 * Endpoint to get a CSRF token
 */
export function getCsrfToken(req: Request, res: Response) {
  const token = generateCsrfToken();
  res.json({ csrfToken: token });
}