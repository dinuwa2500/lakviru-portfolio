'use client';

import * as React from 'react';
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Search,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ContactMessageData } from '@/types';
import { formatDate, formatDateTime } from '@/lib/utils';
import { markMessageReadAction, deleteMessageAction } from '@/actions/contact';

interface MessagesClientViewerProps {
  initialMessages: ContactMessageData[];
}

export function MessagesClientViewer({ initialMessages }: MessagesClientViewerProps) {
  const [messages, setMessages] = React.useState<ContactMessageData[]>(initialMessages);
  const [selectedId, setSelectedId] = React.useState<string | null>(
    initialMessages[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = React.useState('');

  const selectedMessage = messages.find((m) => m.id === selectedId) || null;

  const handleMarkAsRead = async (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
    await markMessageReadAction(id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) {
      const remaining = messages.filter((m) => m.id !== id);
      setSelectedId(remaining[0]?.id || null);
    }
    await deleteMessageAction(id);
  };

  const filteredMessages = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="text-xs font-mono text-zinc-500">
          Total Inquiries: <span className="font-bold text-zinc-900 dark:text-zinc-100">{messages.length}</span> (
          <span className="text-indigo-500 font-bold">
            {messages.filter((m) => !m.isRead).length} unread
          </span>
          )
        </div>
      </div>

      {/* Main Mailbox Grid */}
      {filteredMessages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Message List */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 shadow-sm max-h-[680px] overflow-y-auto">
            {filteredMessages.map((m) => {
              const isSelected = m.id === selectedId;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedId(m.id);
                    if (!m.isRead) handleMarkAsRead(m.id);
                  }}
                  className={`w-full text-left p-4.5 transition-colors cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-indigo-500/10 dark:bg-indigo-950/40 border-l-4 border-l-indigo-600'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {!m.isRead && (
                        <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                      <span>{m.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                      {formatDate(m.createdAt)}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                    {m.subject}
                  </div>

                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                    {m.message}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Message Detail Pane */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-md min-h-[420px]">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {selectedMessage.name}
                      </span>
                      <span>•</span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject
                      )}`}
                    >
                      <Button size="sm" variant="primary" className="gap-1.5 text-xs">
                        <Mail className="h-3.5 w-3.5" />
                        <span>Reply Email</span>
                      </Button>
                    </a>

                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata Badge */}
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Received on {formatDateTime(selectedMessage.createdAt)}</span>
                </div>

                {/* Message Body */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans text-sm bg-zinc-50/50 dark:bg-zinc-950/40 p-5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                  {selectedMessage.message}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400 space-y-3">
                <Inbox className="h-10 w-10 opacity-40" />
                <p className="text-sm font-medium">Select an inquiry to view its full details.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-12 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 mb-2">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            No Messages in Inbox Yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            When recruiters or visitors use the contact form at the bottom of your portfolio, their messages will arrive here instantly.
          </p>
        </div>
      )}
    </div>
  );
}
