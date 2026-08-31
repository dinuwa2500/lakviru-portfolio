import { Metadata } from 'next';
import { ProfileClientEditor } from './ProfileClientEditor';
import { dbService } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Profile Bio & Links | Admin CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const profile = await dbService.getProfile();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Profile & Personal Bio
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Update your developer persona, engineering bio, and contact URLs across the portfolio.
        </p>
      </div>

      <ProfileClientEditor initialProfile={profile} />
    </div>
  );
}
