import { Terminal } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 animate-pulse">
        <Terminal className="h-6 w-6" />
      </div>
      <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 animate-pulse">
        Loading engineering environment...
      </div>
    </div>
  );
}
