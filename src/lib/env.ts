/**
 * Server-Side Environment Configuration & Validation
 * Centralized, type-safe access to environment variables.
 * Never import this file into "use client" components.
 */

export const env = {
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || '',
  DIRECT_URL: process.env.DIRECT_URL || '',

  // Authentication & Security (Server-only)
  AUTH_SECRET: process.env.AUTH_SECRET || '',
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL || '',
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || '',

  // GitHub Integration (Server-only)
  GITHUB_USERNAME: process.env.GITHUB_USERNAME || 'dinuwa2500',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',

  // Public Configuration
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export function validateRequiredEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!env.AUTH_SECRET) {
    missing.push('AUTH_SECRET');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error('AUTH_SECRET environment variable is missing. Set AUTH_SECRET in .env or deployment configuration.');
  }
  return new TextEncoder().encode(secret.trim());
}
