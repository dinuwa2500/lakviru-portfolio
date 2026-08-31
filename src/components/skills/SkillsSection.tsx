'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Layers,
  Server,
  Database,
  Cloud,
  Terminal,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/motion/StaggerContainer';
import { FadeIn } from '@/components/motion/FadeIn';
import { SkillData } from '@/types';
import { cn } from '@/lib/utils';
import { TRANSITION_EASE } from '@/components/motion/motion-variants';

interface SkillsSectionProps {
  skills: SkillData[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = React.useState<string>('ALL');

  const categories = [
    { key: 'ALL', label: 'All Technologies', icon: Sparkles },
    { key: 'LANGUAGES', label: 'Languages', icon: Code },
    { key: 'FRONTEND', label: 'Frontend', icon: Layers },
    { key: 'BACKEND', label: 'Backend', icon: Server },
    { key: 'DATABASES', label: 'Databases', icon: Database },
    { key: 'DEVOPS_CLOUD', label: 'DevOps & Cloud', icon: Cloud },
  ];

  const filteredSkills = React.useMemo(() => {
    if (activeCategory === 'ALL') return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  return (
    <section id="skills" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <FadeIn direction="up" className="space-y-3 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Cpu className="h-3.5 w-3.5" />
            <span>Tech Stack & Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Engineering Tooling & Technologies
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            A comprehensive overview of programming languages, modern frameworks, database engines, and infrastructure tools I leverage in production.
          </p>
        </FadeIn>

        {/* Category Pills with Animated Layout Pill */}
        <FadeIn direction="up" delay={0.1} className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'text-white font-semibold'
                    : 'bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeSkillCategory"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 bg-indigo-600 rounded-xl -z-0 shadow-md shadow-indigo-600/25"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </span>
              </button>
            );
          })}
        </FadeIn>

        {/* Skills Grid with Staggered Entrance */}
        <StaggerContainer
          key={activeCategory}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredSkills.map((skill) => (
            <StaggerItem key={skill.id}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2, ease: TRANSITION_EASE } }}
                className="group relative rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-5 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                        {skill.name}
                      </h3>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {skill.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {skill.isFeatured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Primary
                    </span>
                  )}
                </div>

                {skill.description && (
                  <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {skill.description}
                  </p>
                )}

                {/* Progress / Proficiency bar */}
                {skill.skillLevel && (
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      <span>Proficiency</span>
                      <span>{skill.skillLevel}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.skillLevel}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: TRANSITION_EASE }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
