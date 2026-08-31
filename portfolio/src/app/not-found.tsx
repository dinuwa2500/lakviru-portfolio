import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700">
        <Terminal className="h-8 w-8 text-indigo-500" />
      </div>
      <div className="space-y-2 max-w-md">
        <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          404 // Page Not Found
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
          Route Does Not Exist
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The requested path could not be found or has been moved.
        </p>
      </div>
      <Link href="/">
        <Button variant="primary" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Button>
      </Link>
    </div>
  );
}
