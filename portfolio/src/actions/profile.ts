'use server';

import { revalidatePath } from 'next/cache';
import { dbService } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';
import { profileSchema } from '@/lib/validations';
import { ProfileData } from '@/types';

export async function getProfileAction(): Promise<ProfileData> {
  return await dbService.getProfile();
}

export async function updateProfileAction(data: Partial<ProfileData>) {
  await requireAdminSession();
  const validation = profileSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0]?.message || 'Validation failed' };
  }

  try {
    const updated = await dbService.updateProfile(data);
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/profile');
    return { success: true, profile: updated };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update profile' };
  }
}
