'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Sparkles, Star, GitFork } from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { Badge } from '@/components/ui/Badge';
import { ProjectData } from '@/types';
import { getLanguageColor } from '@/lib/utils';

interface FloatingFeaturedCardProps {
  project?: ProjectData | null;
  highlightedNode?: string | null;
}

export function FloatingFeaturedCard({ project, highlightedNode }: FloatingFeaturedCardProps) {
  if (!project) return null;

  const title = project.customTitle || project.githubName || 'Featured Engineering Project';
  const description =
    project.customDescription ||
    project.githubDescription ||
    'High-performance production application built with modern architecture principles.';
  const primaryLanguage =
    project.githubLanguage || (project.technologies && project.technologies[0]) || 'TypeScript';
  const langColor = getLanguageColor(primaryLanguage);
  const techList =
    project.technologies && project.technologies.length > 0
      ? project.technologies.slice(0, 4)
      : project.githubLanguages && project.githubLanguages.length > 0
      ? project.githubLanguages.slice(0, 4)
      : ['Next.js', 'TypeScript', 'PostgreSQL'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="group relative rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl p-5 sm:p-6 shadow-2xl shadow-indigo-500/10 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/15">
        {/* Subtle Ambient Accent Glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity pointer-events-none -z-10" />

        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
              Featured Case Study
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code on GitHub"
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View live deployment"
                className="p-1 rounded-lg text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Project Title & Summary */}
        <div className="space-y-1.5 pt-3">
          <Link
            href={`/projects/${project.slug}`}
            className="group/link inline-flex items-center gap-1.5"
          >
            <h4 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors line-clamp-1">
              {title}
            </h4>
            <ArrowRight className="h-3.5 w-3.5 text-zinc-400 group-hover/link:text-indigo-500 group-hover/link:translate-x-0.5 transition-all shrink-0" />
          </Link>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3">
          {techList.map((tech) => {
            const isMatch = highlightedNode && tech.toLowerCase().includes(highlightedNode.toLowerCase());
            return (
              <span
                key={tech}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all duration-200 ${
                  isMatch
                    ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-500/30'
                    : 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/60'
                }`}
              >
                {tech}
              </span>
            );
          })}
        </div>

        {/* Bottom Bar: Language & CTA */}
        <div className="pt-3 mt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor }} />
              <span>{primaryLanguage}</span>
            </span>

            {project.githubStars > 0 && (
              <span className="flex items-center gap-1 text-zinc-500 font-mono">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                {project.githubStars}
              </span>
            )}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
          >
            <span>View Architecture</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
