import { Metadata } from 'next';
import { ProjectsClientTable } from './ProjectsClientTable';
import { dbService } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Project Management | Admin CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await dbService.getProjects({ includeHidden: true });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Projects & Repositories CMS
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Control which repositories appear on your public portfolio, toggle featured showcases, and edit case studies.
        </p>
      </div>

      <ProjectsClientTable initialProjects={projects} />
    </div>
  );
}
