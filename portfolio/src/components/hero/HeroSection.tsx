import Link from 'next/link';
import { ArrowRight, FileText, Mail, Sparkles, Terminal } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { HeroTerminal } from './HeroTerminal';
import { ProfileData } from '@/types';

interface HeroSectionProps {
  profile: ProfileData;
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute -top-10 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Intro & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for Software Engineering Roles</span>
            </div>

            {/* Name & Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
                Hi, I&apos;m{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 bg-clip-text text-transparent">
                  {profile.name}
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-700 dark:text-zinc-300 font-mono flex items-center gap-2">
                <Terminal className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>{profile.primaryTitle}</span>
              </h2>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              {profile.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/projects">
                <Button size="lg" variant="primary" className="gap-2 group shadow-lg shadow-indigo-500/25">
                  <span>View Projects</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Contact Me</span>
                </Button>
              </Link>

              <a
                href={profile.resumeUrl || '/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Download CV</span>
                </Button>
              </a>
            </div>

            {/* Social Buttons & Tech Badges */}
            <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Quick Links:</span>
              <div className="flex items-center gap-2">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Terminal */}
          <div className="lg:col-span-6 flex justify-center">
            <HeroTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}
