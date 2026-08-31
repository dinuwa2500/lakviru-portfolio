import { Metadata } from 'next';
import { ExperienceClientManager } from './ExperienceClientManager';
import { dbService } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Experience CMS | Admin Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function AdminExperiencePage() {
  const experiences = await dbService.getExperiences();

  return (
    <div className="space-y-6">
      <ExperienceClientManager initialExperiences={experiences} />
    </div>
  );
}
