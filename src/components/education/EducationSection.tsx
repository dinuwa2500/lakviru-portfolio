'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';
import { EducationData } from '@/types';
import { TRANSITION_EASE } from '@/components/motion/motion-variants';

interface EducationSectionProps {
  educations: EducationData[];
}

export function EducationSection({ educations }: EducationSectionProps) {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <FadeIn direction="up" className="space-y-3 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Education & Qualifications
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Formal foundations in computer science, software engineering principles, and distributed systems.
          </p>
        </FadeIn>

        {/* Education Cards */}
        <div className="grid grid-cols-1 gap-6">
          {educations.map((edu, idx) => (
            <FadeIn key={edu.id} direction="up" delay={idx * 0.12}>
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.2, ease: TRANSITION_EASE } }}
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-6 sm:p-8 space-y-4 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {edu.degree}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      <span>{edu.institution}</span>
                      {edu.location && (
                        <>
                          <span className="text-zinc-400">•</span>
                          <span className="flex items-center gap-1 font-normal text-zinc-500 dark:text-zinc-400 text-xs">
                            <MapPin className="h-3 w-3" />
                            {edu.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {edu.grade && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Award className="h-3 w-3" />
                        {edu.grade}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
                      <Calendar className="h-3 w-3 text-zinc-400" />
                      <span>{edu.startDate} &mdash; {edu.endDate || 'Present'}</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  Major Focus: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{edu.field}</span>
                </div>

                {edu.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                    {edu.description}
                  </p>
                )}
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
