'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, ArrowUpRight, Sparkles, ArrowRight } from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { Badge } from '@/components/ui/Badge';
import { ProjectData } from '@/types';
import { getLanguageColor, truncate } from '@/lib/utils';
import { TRANSITION_EASE } from '@/components/motion/motion-variants';

interface ProjectCardProps {
  project: ProjectData;
  isPriority?: boolean;
}

export function ProjectCard({ project, isPriority = false }: ProjectCardProps) {
  const displayTitle = project.customTitle || project.githubName || 'Project';
  const displayDesc = project.customDescription || project.githubDescription || 'Software engineering project.';
  const primaryLang = project.githubLanguage || (project.technologies && project.technologies[0]) || 'Code';
  const langColor = getLanguageColor(primaryLang);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: TRANSITION_EASE }}
      className="group relative flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md overflow-hidden hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-colors duration-300 shadow-md hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      {/* Thumbnail Area with Zoom and Interactive Overlay */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-950/80 border-b border-zinc-200/60 dark:border-zinc-800/60">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={isPriority}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 via-indigo-950/30 to-zinc-900 text-zinc-600 dark:text-zinc-400 font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
              <span>{primaryLang} Architecture</span>
            </div>
          </div>
        )}

        {/* Hover Overlay with Case Study Link */}
        <Link
          href={`/projects/${project.slug}`}
          className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 font-mono text-xs font-semibold shadow-lg border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span>Explore Case Study</span>
            <ArrowRight className="h-3.5 w-3.5 text-indigo-500" />
          </span>
        </Link>

        {/* Featured Badge */}
        {project.isFeatured && (
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-md shadow-indigo-600/30 backdrop-blur-md">
              <Sparkles className="h-3 w-3 fill-current" />
              Featured
            </span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <Badge variant="outline" className="bg-zinc-900/80 text-zinc-200 backdrop-blur-md border-zinc-700/80 text-[11px]">
            {project.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Link
            href={`/projects/${project.slug}`}
            className="group/link inline-flex items-center gap-1.5 text-lg font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <span className="line-clamp-1">{displayTitle}</span>
            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all text-indigo-600 dark:text-indigo-400" />
          </Link>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {truncate(displayDesc, 140)}
          </p>
        </div>

        {/* Technologies Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {project.technologies && project.technologies.length > 0
            ? project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                >
                  {tech}
                </span>
              ))
            : project.githubTopics?.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  #{topic}
                </span>
              ))}
        </div>

        {/* Footer info: GitHub stats & Links */}
        <div className="mt-auto pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            {primaryLang && (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: langColor }} />
                <span>{primaryLang}</span>
              </div>
            )}
            {project.githubStars > 0 && (
              <div className="flex items-center gap-1" title={`${project.githubStars} Stars`}>
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/30" />
                <span>{project.githubStars}</span>
              </div>
            )}
            {project.githubForks > 0 && (
              <div className="flex items-center gap-1" title={`${project.githubForks} Forks`}>
                <GitFork className="h-3.5 w-3.5" />
                <span>{project.githubForks}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View GitHub Repository"
                className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Live Demo"
                className="p-1.5 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
