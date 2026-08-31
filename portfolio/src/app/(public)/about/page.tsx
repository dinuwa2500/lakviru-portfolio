import { Metadata } from 'next';
import { User, Terminal, Code, Cpu, Server, ShieldCheck, Heart } from 'lucide-react';
import { dbService } from '@/lib/db';
import { SkillsSection } from '@/components/skills/SkillsSection';

export const metadata: Metadata = {
  title: 'About Me & Engineering Background',
  description:
    'Learn about Lakviru Perera, software engineering background, full-stack competencies, and distributed systems philosophy.',
};

export const revalidate = 60;

export default async function AboutPage() {
  const [profile, skills] = await Promise.all([
    dbService.getProfile(),
    dbService.getSkills(),
  ]);

  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <User className="h-3.5 w-3.5" />
          <span>Professional Background</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          About Lakviru Perera
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {profile.bio}
        </p>
      </div>

      {/* Engineering Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Server className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Backend Systems & Microservices
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Deep focus on concurrency models, connection pooling, Redis caching patterns, and relational database schema design with PostgreSQL and Prisma.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Code className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Full-Stack & Web Performance
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Crafting responsive, accessible, and fast web applications using Next.js App Router, TypeScript, Tailwind CSS, and Server Components.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              DevOps & Infrastructure
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Automating builds, testing pipelines, and staged releases with Docker, Linux environments, and GitHub Actions CI/CD workflows.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Security & Reliability
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Implementing robust authentication, rate-limiting, JWT security, parameterized SQL queries, and zero-trust API contracts.
          </p>
        </div>
      </div>

      {/* Skills Matrix */}
      <SkillsSection skills={skills} />
    </div>
  );
}
