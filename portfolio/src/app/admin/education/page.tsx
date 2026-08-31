import { Metadata } from 'next';
import { EducationClientManager } from './EducationClientManager';
import { dbService } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Education CMS | Admin Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function AdminEducationPage() {
  const educations = await dbService.getEducations();

  return (
    <div className="space-y-6">
      <EducationClientManager initialEducations={educations} />
    </div>
  );
}
