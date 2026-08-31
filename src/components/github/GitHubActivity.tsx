'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, BookOpen, ExternalLink, Code2 } from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import { FadeIn } from '@/components/motion/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { GitHubContributionStats } from '@/types';
import { getLanguageColor } from '@/lib/utils';
import { TRANSITION_EASE } from '@/components/motion/motion-variants';

interface GitHubActivityProps {
  stats: GitHubContributionStats;
  githubUsername?: string;
}

export function GitHubActivity({ stats, githubUsername = 'dinuwa2500' }: GitHubActivityProps) {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <FadeIn direction="up" className="space-y-3 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Github className="h-3.5 w-3.5" />
            <span>Open Source & GitHub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            GitHub Live Activity & Repositories
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Real-time GitHub statistics synced server-side directly from GitHub REST APIs.
          </p>
        </FadeIn>

        {/* Stats Grid */}
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StaggerItem>
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2, ease: TRANSITION_EASE } }}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 space-y-2 hover:border-indigo-500/40 transition-colors shadow-md"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">Repositories</span>
                <BookOpen className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                {stats.totalRepos}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Public & synced repositories</p>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2, ease: TRANSITION_EASE } }}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 space-y-2 hover:border-amber-500/40 transition-colors shadow-md"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">Total Stars</span>
                <Star className="h-4 w-4 text-amber-500 fill-amber-500/30" />
              </div>
              <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                {stats.totalStars}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Earned across repositories</p>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2, ease: TRANSITION_EASE } }}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 space-y-2 hover:border-purple-500/40 transition-colors shadow-md"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">Total Forks</span>
                <GitFork className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
                {stats.totalForks}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Community contributions</p>
            </motion.div>
          </StaggerItem>

          <StaggerItem>
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.2, ease: TRANSITION_EASE } }}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 space-y-2 hover:border-cyan-500/40 transition-colors shadow-md"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-mono uppercase tracking-wider">GitHub Profile</span>
                <Github className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono truncate">
                @{githubUsername}
              </div>
              <a
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium pt-1"
              >
                <span>Visit profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

        {/* Language Breakdown Card */}
        {stats.topLanguages && stats.topLanguages.length > 0 && (
          <FadeIn direction="up" delay={0.15}>
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                  <Code2 className="h-4 w-4 text-indigo-500" />
                  <span>Primary Languages Breakdown</span>
                </div>
                <span className="text-xs font-mono text-zinc-500">Calculated from repository codebases</span>
              </div>

              {/* Segmented Bar with Reveal */}
              <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex">
                {stats.topLanguages.map((lang) => (
                  <motion.div
                    key={lang.name}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: TRANSITION_EASE }}
                    style={{
                      backgroundColor: getLanguageColor(lang.name),
                    }}
                    title={`${lang.name}: ${lang.percentage}%`}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                  />
                ))}
              </div>

              {/* Legend Items */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
                {stats.topLanguages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2 text-xs font-mono">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: getLanguageColor(lang.name) }}
                    />
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{lang.name}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
