import { Metadata } from 'next';
import { dbService } from '@/lib/db';
import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline';

export const metadata: Metadata = {
  title: 'Work Experience & Contributions',
  description:
    'Detailed work history, technical roles, responsibilities, and achievements for Lakviru Perera.',
};

export const revalidate = 60;

export default async function ExperiencePage() {
  const experiences = await dbService.getExperiences();

  return (
    <div className="pt-28 sm:pt-36 pb-20">
      <ExperienceTimeline experiences={experiences} />
    </div>
  );
}
