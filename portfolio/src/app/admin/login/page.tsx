'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Terminal, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { loginAction } from '@/actions/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  React.useEffect(() => {
    if (state?.success) {
      router.push('/admin/dashboard');
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-1">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Admin CMS Login
            </h1>
            <p className="text-xs text-zinc-400">
              Enter your authorized credentials to manage portfolio projects, GitHub sync, and content.
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <Input
              label="Admin Email"
              name="email"
              type="email"
              defaultValue="admin@lakviru.dev"
              placeholder="admin@lakviru.dev"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              defaultValue="Admin@2026!"
              placeholder="••••••••"
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="w-full gap-2"
              >
                <Lock className="h-4 w-4" />
                <span>{isPending ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              </Button>
            </div>
          </form>

          {/* Initial Setup Helper Box */}
          <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1 font-mono">
            <div className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>Default Credentials:</span>
            </div>
            <div className="text-zinc-400">Email: <span className="text-zinc-200">admin@lakviru.dev</span></div>
            <div className="text-zinc-400">Pass: <span className="text-zinc-200">Admin@2026!</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
