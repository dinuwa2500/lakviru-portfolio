'use server';

import { revalidatePath } from 'next/cache';
import { dbService } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';
import { educationSchema } from '@/lib/validations';
import { EducationData } from '@/types';

export async function getEducationsAction() {
  return await dbService.getEducations();
}

export async function createEducationAction(data: Partial<EducationData>) {
  await requireAdminSession();
  const validation = educationSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0]?.message || 'Validation failed' };
  }

  try {
    const education = await dbService.createEducation(data);
    revalidatePath('/');
    revalidatePath('/education');
    revalidatePath('/admin/education');
    return { success: true, education };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to create education' };
  }
}

export async function updateEducationAction(id: string, data: Partial<EducationData>) {
  await requireAdminSession();
  try {
    const edu = await dbService.updateEducation(id, data);
    if (!edu) return { success: false, error: 'Education not found' };
    revalidatePath('/');
    revalidatePath('/education');
    revalidatePath('/admin/education');
    return { success: true, education: edu };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update education' };
  }
}

export async function deleteEducationAction(id: string) {
  await requireAdminSession();
  try {
    const ok = await dbService.deleteEducation(id);
    revalidatePath('/');
    revalidatePath('/education');
    revalidatePath('/admin/education');
    return { success: ok };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to delete education' };
  }
}
