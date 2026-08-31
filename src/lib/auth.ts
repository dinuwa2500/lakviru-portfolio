import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma, isDbConnected } from './db';
import { getJwtSecret } from './env';

const COOKIE_NAME = 'auth_session';

export interface AuthSessionPayload {
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function createSessionToken(payload: AuthSessionPayload): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<AuthSessionPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return {
      email: payload.email as string,
      role: payload.role as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AuthSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: AuthSessionPayload }> {
  const envEmail = process.env.DEFAULT_ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  // Check environment-configured admin credentials
  if (envEmail && envPassword && email.trim().toLowerCase() === envEmail && password === envPassword) {
    return {
      success: true,
      user: {
        email: envEmail,
        name: 'Admin',
        role: 'ADMIN',
      },
    };
  }

  // Check database admin credentials if connected
  try {
    if (await isDbConnected()) {
      const user = await prisma.adminUser.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (user && (await comparePassword(password, user.passwordHash))) {
        return {
          success: true,
          user: {
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      }
    }
  } catch (err) {
    console.error('Error during DB authentication verification');
  }

  return { success: false, error: 'Invalid email or password' };
}

export async function requireAdminSession(): Promise<AuthSessionPayload> {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session;
}
