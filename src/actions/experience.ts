'use server';

import { revalidatePath } from 'next/cache';
import { dbService } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';
import { experienceSchema } from '@/lib/validations';
import { ExperienceData } from '@/types';

export async function getExperiencesAction() {
  return await dbService.getExperiences();
}

export async function createExperienceAction(data: Partial<ExperienceData>) {
  await requireAdminSession();
  const validation = experienceSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0]?.message || 'Validation failed' };
  }

  try {
    const experience = await dbService.createExperience(data);
    revalidatePath('/');
    revalidatePath('/experience');
    revalidatePath('/admin/experience');
    return { success: true, experience };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to create experience' };
  }
}

export async function updateExperienceAction(id: string, data: Partial<ExperienceData>) {
  await requireAdminSession();
  try {
    const exp = await dbService.updateExperience(id, data);
    if (!exp) return { success: false, error: 'Experience not found' };
    revalidatePath('/');
    revalidatePath('/experience');
    revalidatePath('/admin/experience');
    return { success: true, experience: exp };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update experience' };
  }
}

export async function deleteExperienceAction(id: string) {
  await requireAdminSession();
  try {
    const ok = await dbService.deleteExperience(id);
    revalidatePath('/');
    revalidatePath('/experience');
    revalidatePath('/admin/experience');
    return { success: ok };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to delete experience' };
  }
}
