import { Metadata } from 'next';
import { dbService } from '@/lib/db';
import { MessagesClientViewer } from './MessagesClientViewer';

export const metadata: Metadata = {
  title: 'Inbox & Inquiries | Admin CMS',
};

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const messages = await dbService.getMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Inbox & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Review, respond to, and manage contact messages received from your portfolio.
        </p>
      </div>

      <MessagesClientViewer initialMessages={messages} />
    </div>
  );
}
