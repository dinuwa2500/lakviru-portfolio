import { Metadata } from 'next';
import { SkillsClientManager } from './SkillsClientManager';
import { dbService } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Skills & Capabilities | Admin CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage() {
  const skills = await dbService.getSkills();

  return (
    <div className="space-y-6">
      <SkillsClientManager initialSkills={skills} />
    </div>
  );
}
