'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { User, ShieldCheck } from 'lucide-react';
import { GitHubSyncButton } from './GitHubSyncButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface AdminHeaderProps {
  user?: {
    email: string;
    name: string;
    role: string;
  } | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes('/admin/projects/')) return 'Edit Project';
    if (pathname.includes('/admin/projects')) return 'Project Management';
    if (pathname.includes('/admin/skills')) return 'Skills & Capabilities';
    if (pathname.includes('/admin/experience')) return 'Work Experience';
    if (pathname.includes('/admin/education')) return 'Education';
    if (pathname.includes('/admin/profile')) return 'Profile & Bio';
    if (pathname.includes('/admin/settings')) return 'Settings & GitHub API';
    return 'CMS Dashboard Overview';
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* GitHub Sync Button */}
        <GitHubSyncButton />

        <ThemeToggle />

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="h-7 w-7 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
              {user?.name || 'Admin'}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              {user?.email }
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
