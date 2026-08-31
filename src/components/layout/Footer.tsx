'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';
import { FadeIn } from '@/components/motion/FadeIn';

interface FooterProps {
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  name?: string;
  title?: string;
}

export function Footer({
  githubUrl = 'https://github.com/dinuwa2500',
  linkedinUrl = 'https://www.linkedin.com/in/lakviru-perera-006050371/',
  email = 'dinuwaperera123@gmail.com',
  name = 'Lakviru Perera',
  title = 'Software Engineer',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50 mt-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Col */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  {name}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Available for hire
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
                {title} building resilient distributed systems, modern full-stack web platforms, and cloud solutions.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Github className="h-4 w-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={`mailto:${email}`}
                  aria-label="Email"
                  className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </motion.a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
                Navigation
              </h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Projects Directory
                  </Link>
                </li>
                <li>
                  <Link href="/#skills" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Technical Skills
                  </Link>
                </li>
                <li>
                  <Link href="/experience" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Work Experience
                  </Link>
                </li>
                <li>
                  <Link href="/education" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Education
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Contact */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-mono">
                Get in Touch
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Have an engineering opportunity or project in mind? Let&apos;s connect.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Send a message &rarr;
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500">
            <p>&copy; {currentYear} {name}. All rights reserved.</p>
            <div className="flex items-center gap-1 font-mono">
              <span>Built with Next.js, TypeScript & PostgreSQL</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
