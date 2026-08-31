'use server';

import { revalidatePath } from 'next/cache';
import { authenticateAdmin, createSessionToken, setSessionCookie, clearSessionCookie, getSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || 'Invalid input',
    };
  }

  const authResult = await authenticateAdmin(email, password);
  if (!authResult.success || !authResult.user) {
    return {
      success: false,
      error: authResult.error || 'Invalid email or password',
    };
  }

  const token = await createSessionToken(authResult.user);
  await setSessionCookie(token);

  return {
    success: true,
  };
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  revalidatePath('/admin');
}

export async function getSessionAction() {
  return await getSession();
}
