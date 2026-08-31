'use server';

import { revalidatePath } from 'next/cache';
import { syncGitHubProjects, fetchGitHubUserStats } from '@/lib/github';
import { requireAdminSession } from '@/lib/auth';
import { dbService } from '@/lib/db';

export async function syncGitHubProjectsAction(customUsername?: string) {
  await requireAdminSession();
  try {
    const result = await syncGitHubProjects(customUsername);
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    revalidatePath('/admin/dashboard');
    return result;
  } catch (error: any) {
    return {
      success: false,
      reposFound: 0,
      reposNew: 0,
      reposUpdated: 0,
      reposUnchanged: 0,
      message: error?.message || 'Sync failed',
      timestamp: new Date().toISOString(),
      error: error?.message,
    };
  }
}

export async function getGitHubStatsAction() {
  return await fetchGitHubUserStats();
}

export async function getSyncLogsAction() {
  await requireAdminSession();
  return await dbService.getSyncLogs(10);
}

export async function updateGitHubSettingsAction(username: string) {
  await requireAdminSession();
  try {
    await dbService.setSetting('GITHUB_USERNAME', username.trim(), 'Target GitHub username for project synchronization');
    revalidatePath('/admin/settings');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Failed to update GitHub username' };
  }
}
