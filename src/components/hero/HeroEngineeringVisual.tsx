'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Star,
  GitFork,
  ArrowRight,
  Sparkles,
  Layers,
  Server,
  Database,
  Cloud,
  Cpu,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { Badge } from '@/components/ui/Badge';
import { ProjectData } from '@/types';
import { getLanguageColor, truncate } from '@/lib/utils';

interface HeroEngineeringVisualProps {
  project?: ProjectData | null;
}

export function HeroEngineeringVisual({ project }: HeroEngineeringVisualProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'architecture'>('overview');

  // If a real featured project exists, render the Featured Engineering Card
  if (project) {
    const title = project.customTitle || project.githubName || 'Featured Engineering Project';
    const description =
      project.customDescription ||
      project.githubDescription ||
      'Software engineering project built with modern technologies and clean architecture.';
    const primaryLanguage = project.githubLanguage || (project.technologies && project.technologies[0]) || 'TypeScript';
    const langColor = getLanguageColor(primaryLanguage);
    const techList =
      project.technologies && project.technologies.length > 0
        ? project.technologies.slice(0, 5)
        : project.githubLanguages && project.githubLanguages.length > 0
        ? project.githubLanguages.slice(0, 5)
        : ['TypeScript', 'Next.js', 'PostgreSQL'];

    return (
      <div className="w-full max-w-lg lg:max-w-none">
        {/* Main Showcase Container */}
        <div className="relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 p-6 sm:p-7 space-y-6 transition-all duration-300 hover:border-indigo-500/40">
          {/* Top Header & Badges */}
          <div className="flex items-center justify-between gap-3 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                Featured Work
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <Badge variant="indigo" size="sm">
                {project.category}
              </Badge>
            </div>

            {/* Quick Link Out */}
            <div className="flex items-center gap-1.5">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Source on GitHub"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Live Demo"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Interactive Mode Toggle */}
          <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/50 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Project Overview
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              System Layers
            </button>
          </div>

          {/* Tab 1: Project Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="group inline-flex items-center gap-2"
                >
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {title}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {description}
                </p>
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {techList.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: System Layers & Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-3 animate-in fade-in duration-200 text-xs font-mono">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Layers className="h-4 w-4" />
                  <span className="font-semibold">Client Presentation</span>
                </div>
                <span className="text-zinc-500">React / Next.js UI</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <Server className="h-4 w-4" />
                  <span className="font-semibold">Services & API Gateway</span>
                </div>
                <span className="text-zinc-500">Node / TypeScript REST</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Database className="h-4 w-4" />
                  <span className="font-semibold">Persistence Layer</span>
                </div>
                <span className="text-zinc-500">PostgreSQL / Prisma</span>
              </div>
            </div>
          )}

          {/* Footer Metadata & Case Study CTA */}
          <div className="pt-4 border-t border-zinc-200/70 dark:border-zinc-800/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
                <span>{primaryLanguage}</span>
              </div>

              {(project.githubStars > 0 || project.githubForks > 0) && (
                <div className="flex items-center gap-2 text-zinc-500 font-mono">
                  {project.githubStars > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                      {project.githubStars}
                    </span>
                  )}
                  {project.githubForks > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" />
                      {project.githubForks}
                    </span>
                  )}
                </div>
              )}
            </div>

            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
            >
              <span>Explore Architecture</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: Clean Software Architecture Visual (No fake data)
  return (
    <div className="w-full max-w-lg lg:max-w-none">
      <div className="relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200/70 dark:border-zinc-800/70 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-800 dark:text-zinc-200 font-semibold">
              Software Architecture Stack
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">Full-Stack Core</span>
        </div>

        {/* Stack Flow Nodes */}
        <div className="space-y-3 text-xs sm:text-sm font-mono">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">Frontend Presentation</div>
                <div className="text-[11px] text-zinc-500">React • Next.js • Tailwind CSS • TypeScript</div>
              </div>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Server className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">Backend & API Layer</div>
                <div className="text-[11px] text-zinc-500">Node.js • Express • REST APIs • Server Actions</div>
              </div>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">Database & Data Layer</div>
                <div className="text-[11px] text-zinc-500">PostgreSQL • Prisma ORM • Relational Schemas</div>
              </div>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Cloud className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">DevOps & Cloud Deployment</div>
                <div className="text-[11px] text-zinc-500">Git • Docker • GitHub Actions CI/CD</div>
              </div>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Designed with modularity, type safety, and scalability.
        </div>
      </div>
    </div>
  );
}
