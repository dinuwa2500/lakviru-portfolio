import { Metadata } from 'next';
import { dbService } from '@/lib/db';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact & Inquiry',
  description:
    'Get in touch with Lakviru Perera for engineering roles, technical collaboration, or project inquiries.',
};

export default async function ContactPage() {
  const profile = await dbService.getProfile();

  return (
    <div className="pt-28 sm:pt-36 pb-20">
      <ContactForm profile={profile} />
    </div>
  );
}
