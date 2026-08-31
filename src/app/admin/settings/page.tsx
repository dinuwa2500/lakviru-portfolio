import { Metadata } from 'next';
import { SettingsClientEditor } from './SettingsClientEditor';
import { dbService } from '@/lib/db';
import { getTargetGitHubUsername } from '@/lib/github';

export const metadata: Metadata = {
  title: 'Settings & GitHub Integration | Admin CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const [username, syncLogs] = await Promise.all([
    getTargetGitHubUsername(),
    dbService.getSyncLogs(10),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          CMS Settings & GitHub API
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Configure GitHub API parameters and inspect synchronization logs.
        </p>
      </div>

      <SettingsClientEditor initialUsername={username} syncLogs={syncLogs} />
    </div>
  );
}
