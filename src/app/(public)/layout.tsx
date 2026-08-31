import * as React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { AnimatedBackground } from '@/components/motion/AnimatedBackground';
import { CustomCursor } from '@/components/motion/CustomCursor';
import { dbService } from '@/lib/db';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await dbService.getProfile();

  return (
    <div className="flex min-h-screen flex-col relative selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300">
      <ScrollProgress />
      <AnimatedBackground />
      <CustomCursor />

      <Navbar
        githubUrl={profile.githubUrl}
        linkedinUrl={profile.linkedinUrl}
        resumeUrl={profile.resumeUrl || '/resume.pdf'}
      />
      <main className="flex-1">{children}</main>
      <Footer
        name={profile.name}
        title={profile.primaryTitle}
        email={profile.email}
        githubUrl={profile.githubUrl}
        linkedinUrl={profile.linkedinUrl}
      />
    </div>
  );
}
