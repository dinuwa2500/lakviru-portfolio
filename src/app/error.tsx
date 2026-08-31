'use client';

import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Unexpected Error Encountered
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          An issue occurred while processing this page. The system is designed to recover gracefully.
        </p>
      </div>
      <Button onClick={() => reset()} variant="primary" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        <span>Try Again</span>
      </Button>
    </div>
  );
}
