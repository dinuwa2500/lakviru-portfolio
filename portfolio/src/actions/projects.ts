'use server';

import { revalidatePath } from 'next/cache';
import { dbService } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';
import { ProjectData } from '@/types';

export async function getProjectsAction(options?: {
  includeHidden?: boolean;
  featuredOnly?: boolean;
  category?: string;
}) {
  return await dbService.getProjects(options);
}

export async function getProjectBySlugAction(slug: string) {
  return await dbService.getProjectBySlug(slug);
}

export async function getProjectByIdAction(id: string) {
  return await dbService.getProjectById(id);
}

export async function createProjectAction(data: Partial<ProjectData>) {
  await requireAdminSession();
  const validation = projectSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0]?.message || 'Validation failed' };
  }

  try {
    const project = await dbService.createProject(data);
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/admin/dashboard');
    return { success: true, project };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to create project' };
  }
}

export async function updateProjectAction(id: string, data: Partial<ProjectData>) {
  await requireAdminSession();
  try {
    const updated = await dbService.updateProject(id, data);
    if (!updated) {
      return { success: false, error: 'Project not found' };
    }
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath(`/projects/${updated.slug}`);
    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath('/admin/dashboard');
    return { success: true, project: updated };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update project' };
  }
}

export async function deleteProjectAction(id: string) {
  await requireAdminSession();
  try {
    const ok = await dbService.deleteProject(id);
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/admin/dashboard');
    return { success: ok };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to delete project' };
  }
}

export async function toggleProjectVisibilityAction(id: string, isVisible: boolean) {
  await requireAdminSession();
  try {
    const status = isVisible ? 'PUBLISHED' : 'HIDDEN';
    const updated = await dbService.updateProject(id, { isVisible, status });
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    return { success: true, project: updated };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to toggle visibility' };
  }
}

export async function toggleProjectFeaturedAction(id: string, isFeatured: boolean) {
  await requireAdminSession();
  try {
    const updated = await dbService.updateProject(id, {
      isFeatured,
      status: isFeatured ? 'FEATURED' : 'PUBLISHED',
      isVisible: isFeatured ? true : undefined,
    });
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    return { success: true, project: updated };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to toggle featured status' };
  }
}

export async function archiveProjectAction(id: string) {
  await requireAdminSession();
  try {
    const updated = await dbService.updateProject(id, {
      status: 'ARCHIVED',
      isVisible: false,
      isFeatured: false,
    });
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    return { success: true, project: updated };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to archive project' };
  }
}
