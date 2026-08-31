import Link from 'next/link';
import {
  FolderGit2,
  Sparkles,
  Eye,
  EyeOff,
  Archive,
  RefreshCw,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Layers,
  Cpu,
  UserCheck,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GitHubSyncButton } from '@/components/admin/GitHubSyncButton';
import { dbService } from '@/lib/db';
import { formatDateTime, formatDate, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [allProjects, syncLogs, profile, messages] = await Promise.all([
    dbService.getProjects({ includeHidden: true }),
    dbService.getSyncLogs(5),
    dbService.getProfile(),
    dbService.getMessages(),
  ]);

  const totalRepos = allProjects.length;
  const publishedCount = allProjects.filter(
    (p) => p.status === 'PUBLISHED' || (p.isVisible && p.status !== 'HIDDEN' && p.status !== 'ARCHIVED')
  ).length;
  const featuredCount = allProjects.filter((p) => p.isFeatured).length;
  const hiddenCount = allProjects.filter((p) => p.status === 'HIDDEN' || !p.isVisible).length;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const lastSync = syncLogs[0];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Welcome back, {profile.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Active Session
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Control portfolio projects, synchronize repositories with GitHub API, and manage inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GitHubSyncButton />
          <Link href="/admin/projects">
            <Button size="sm" variant="secondary" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Custom Project</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Repos</span>
            <FolderGit2 className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
            {totalRepos}
          </div>
          <div className="text-[11px] text-zinc-500">In database store</div>
        </div>

        <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-mono uppercase tracking-wider">Published</span>
            <Eye className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {publishedCount}
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Live on public site</div>
        </div>

        <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-mono uppercase tracking-wider">Featured</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
            {featuredCount}
          </div>
          <div className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80">Homepage highlights</div>
        </div>

        <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-md space-y-1">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-mono uppercase tracking-wider">Hidden</span>
            <EyeOff className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {hiddenCount}
          </div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80">Pending approval</div>
        </div>

        <Link
          href="/admin/messages"
          className="p-5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-500/10 dark:bg-indigo-950/30 backdrop-blur-md space-y-1 hover:border-indigo-500 transition-colors block"
        >
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-mono uppercase tracking-wider">Inbox Inquiries</span>
            <Mail className="h-4 w-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
            {messages.length}
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
            {unreadMessagesCount > 0 ? `${unreadMessagesCount} unread` : 'All caught up'}
          </div>
        </Link>
      </div>

      {/* Two Columns: Recent Inquiries & Sync Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Inquiries Feed */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Recent Inquiries from Contact Form
              </h3>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All ({messages.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {messages.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {messages.slice(0, 4).map((msg) => (
                <div key={msg.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                      <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {msg.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        ({msg.email})
                      </span>
                    </div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                      {msg.subject}
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-zinc-400">
              No inquiries received yet. New messages from your website will appear here.
            </div>
          )}
        </div>

        {/* Right: GitHub API Sync Log */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                GitHub API Synchronization
              </h3>
            </div>
            <Link
              href="/admin/settings"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Settings
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1.5">
              <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px]">
                <span>Status</span>
                <Badge variant={lastSync?.status === 'SUCCESS' ? 'success' : 'danger'}>
                  {lastSync?.status || 'IDLE'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px]">
                <span>Last Synced</span>
                <span className="text-zinc-800 dark:text-zinc-200">
                  {lastSync ? formatDateTime(lastSync.startedAt) : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px]">
                <span>Repositories Found</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {lastSync?.reposFound || 0}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <GitHubSyncButton />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects Table Preview */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-indigo-500" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              Recent Projects Overview
            </h3>
          </div>
          <Link
            href="/admin/projects"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Open Full Inventory ({totalRepos})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-mono">
                <th className="pb-3 font-medium">Project Name</th>
                <th className="pb-3 font-medium">Language</th>
                <th className="pb-3 font-medium">Stars</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Featured</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
              {allProjects.slice(0, 6).map((project) => (
                <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    <div className="flex items-center gap-2">
                      <span>{project.customTitle || project.githubName}</span>
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <FolderGit2 className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-mono text-[11px]">
                    {project.githubLanguage || (project.technologies && project.technologies[0]) || '—'}
                  </td>
                  <td className="py-3 font-mono">{project.githubStars}</td>
                  <td className="py-3">
                    {project.status === 'FEATURED' ? (
                      <Badge variant="purple">Featured</Badge>
                    ) : project.status === 'PUBLISHED' ? (
                      <Badge variant="success">Published</Badge>
                    ) : project.status === 'ARCHIVED' ? (
                      <Badge variant="default">Archived</Badge>
                    ) : (
                      <Badge variant="warning">Hidden</Badge>
                    )}
                  </td>
                  <td className="py-3 font-mono">
                    {project.isFeatured ? (
                      <span className="text-indigo-500 font-semibold">Yes</span>
                    ) : (
                      <span className="text-zinc-400">No</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="inline-flex items-center px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
