import * as React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { dbService } from '@/lib/db';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await dbService.getProfile();

  return (
    <div className="flex min-h-screen flex-col">
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
