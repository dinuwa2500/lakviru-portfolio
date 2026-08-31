'use client';

import * as React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { syncGitHubProjectsAction } from '@/actions/github';
import { GitHubSyncResult } from '@/types';
import { formatDateTime } from '@/lib/utils';

export function GitHubSyncButton({ className }: { className?: string }) {
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [result, setResult] = React.useState<GitHubSyncResult | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await syncGitHubProjectsAction();
      setResult(res);
      setIsModalOpen(true);
    } catch (err: any) {
      setResult({
        success: false,
        reposFound: 0,
        reposNew: 0,
        reposUpdated: 0,
        reposUnchanged: 0,
        message: err?.message || 'Sync failed',
        timestamp: new Date().toISOString(),
        error: err?.message,
      });
      setIsModalOpen(true);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleSync}
        isLoading={isSyncing}
        variant="primary"
        size="sm"
        className={className}
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
        <span>{isSyncing ? 'Syncing GitHub...' : 'Sync GitHub Projects'}</span>
      </Button>

      {/* Sync Result Report Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="GitHub Synchronization Report"
        description="Summary of repositories discovered and synchronized from GitHub API"
        maxWidth="md"
      >
        {result && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
              {result.success ? (
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
                  <AlertCircle className="h-6 w-6" />
                </div>
              )}
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {result.success ? 'Synchronization Successful' : 'Synchronization Notice'}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {result.message}
                </p>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {result.reposFound}
                </div>
                <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Found</div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  +{result.reposNew}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">New (Hidden)</div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40">
                <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {result.reposUpdated}
                </div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">Updated</div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xl font-bold font-mono text-zinc-600 dark:text-zinc-400">
                  {result.reposUnchanged}
                </div>
                <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Unchanged</div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
              <span>Timestamp:</span>
              <span>{formatDateTime(result.timestamp)}</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close Report
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
