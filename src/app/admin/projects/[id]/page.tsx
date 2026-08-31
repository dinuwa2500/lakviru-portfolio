import { notFound } from 'next/navigation';
import { ProjectEditorClient } from './ProjectEditorClient';
import { dbService } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await dbService.getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProjectEditorClient project={project} />
    </div>
  );
}
