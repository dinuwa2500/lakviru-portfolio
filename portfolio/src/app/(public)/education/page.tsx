import { Metadata } from 'next';
import { dbService } from '@/lib/db';
import { EducationSection } from '@/components/education/EducationSection';

export const metadata: Metadata = {
  title: 'Education & Academic Qualifications',
  description:
    'Academic degrees, honors, and coursework for Lakviru Perera.',
};

export const revalidate = 60;

export default async function EducationPage() {
  const educations = await dbService.getEducations();

  return (
    <div className="pt-28 sm:pt-36 pb-20">
      <EducationSection educations={educations} />
    </div>
  );
}
