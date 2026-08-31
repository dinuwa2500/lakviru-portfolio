'use server';

import { revalidatePath } from 'next/cache';
import { dbService } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';
import { skillSchema } from '@/lib/validations';
import { SkillData } from '@/types';

export async function getSkillsAction() {
  return await dbService.getSkills();
}

export async function createSkillAction(data: Partial<SkillData>) {
  await requireAdminSession();
  const validation = skillSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0]?.message || 'Validation failed' };
  }

  try {
    const skill = await dbService.createSkill(data);
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/skills');
    return { success: true, skill };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to create skill' };
  }
}

export async function updateSkillAction(id: string, data: Partial<SkillData>) {
  await requireAdminSession();
  try {
    const skill = await dbService.updateSkill(id, data);
    if (!skill) return { success: false, error: 'Skill not found' };
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/skills');
    return { success: true, skill };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update skill' };
  }
}

export async function deleteSkillAction(id: string) {
  await requireAdminSession();
  try {
    const ok = await dbService.deleteSkill(id);
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/admin/skills');
    return { success: ok };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to delete skill' };
  }
}
