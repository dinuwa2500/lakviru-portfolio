'use client';

import * as React from 'react';
import { Save, CheckCircle2, AlertCircle, RefreshCw, Database, ShieldCheck } from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GitHubSyncButton } from '@/components/admin/GitHubSyncButton';
import { updateGitHubSettingsAction } from '@/actions/github';
import { SyncLogData } from '@/types';
import { formatDateTime } from '@/lib/utils';

interface SettingsClientEditorProps {
  initialUsername: string;
  syncLogs: SyncLogData[];
}

export function SettingsClientEditor({ initialUsername, syncLogs }: SettingsClientEditorProps) {
  const [username, setUsername] = React.useState(initialUsername);
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsSaving(true);
    setFeedback(null);
    try {
      const res = await updateGitHubSettingsAction(username.trim());
      if (res.success) {
        setFeedback({ type: 'success', message: 'GitHub settings saved successfully!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update settings' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to update settings' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* GitHub Configuration Card */}
      <form onSubmit={handleSave} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                GitHub API & Sync Configuration
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Set target username for automatic and manual repository synchronization
              </p>
            </div>
          </div>
          <Button type="submit" variant="primary" size="sm" isLoading={isSaving} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            <span>Save Settings</span>
          </Button>
        </div>

        <div className="max-w-md space-y-4">
          <Input
            label="GitHub Target Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="lakviruperera"
            required
            helperText="The public username used when querying GitHub REST API"
          />
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Ready to pull repository updates now?
          </div>
          <GitHubSyncButton />
        </div>
      </form>

      {/* Database & Security Card */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Database & Storage Architecture
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Prisma ORM with PostgreSQL database adapter and resilient fallback store
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="text-zinc-500">ORM Provider</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">Prisma Client (@prisma/client)</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="text-zinc-500">Database Engine</div>
            <div className="font-bold text-zinc-900 dark:text-zinc-100">PostgreSQL (Neon / Supabase Ready)</div>
          </div>
        </div>
      </div>

      {/* Recent Sync Audit Log */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          GitHub Synchronization Audit Log
        </h3>

        {syncLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400">
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Trigger</th>
                  <th className="pb-2">Found</th>
                  <th className="pb-2">New</th>
                  <th className="pb-2">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
                {syncLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5">{formatDateTime(log.startedAt)}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5">{log.triggerType}</td>
                    <td className="py-2.5">{log.reposFound}</td>
                    <td className="py-2.5 text-emerald-500">+{log.reposNew}</td>
                    <td className="py-2.5 text-indigo-500">{log.reposUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs text-zinc-400">No sync logs recorded yet.</div>
        )}
      </div>
    </div>
  );
}
