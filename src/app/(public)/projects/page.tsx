import { Metadata } from 'next';
import { Sparkles, FolderGit2 } from 'lucide-react';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { dbService } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Projects Directory & Engineering Case Studies',
  description:
    'Explore software engineering projects, distributed backend systems, full-stack web applications, and open-source repositories built by Lakviru Perera.',
};

export const revalidate = 60;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tech?: string }>;
}) {
  const params = await searchParams;
  const initialCategory = params.category || 'All';
  const initialTechnology = params.tech || '';

  const projects = await dbService.getProjects({ includeHidden: false });

  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <FolderGit2 className="h-3.5 w-3.5" />
          <span>Complete Engineering Index</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Projects & Code Repositories
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Search and filter through production systems, distributed services, and open-source tools with real-time GitHub stars and metrics.
        </p>
      </div>

      {/* Interactive Project Grid */}
      <ProjectGrid
        initialProjects={projects}
        initialCategory={initialCategory}
        initialTechnology={initialTechnology}
      />
    </div>
  );
}
