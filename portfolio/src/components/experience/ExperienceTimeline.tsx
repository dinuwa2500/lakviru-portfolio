import * as React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle, Award } from 'lucide-react';
import { ExperienceData } from '@/types';
import { formatDate } from '@/lib/utils';

interface ExperienceTimelineProps {
  experiences: ExperienceData[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <section className="py-16 sm:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Career History</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Work Experience & Contributions
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Professional track record designing scalable software, optimizing microservices, and delivering real-world business value.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-950 border-2 border-indigo-500 group-hover:scale-125 transition-transform">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
              </div>

              {/* Card */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-6 sm:p-8 space-y-5 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {exp.position}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      <span>{exp.company}</span>
                      {exp.location && (
                        <>
                          <span className="text-zinc-400">•</span>
                          <span className="flex items-center gap-1 font-normal text-zinc-500 dark:text-zinc-400 text-xs">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 w-fit">
                    <Calendar className="h-3 w-3 text-zinc-400" />
                    <span>
                      {formatDate(exp.startDate)} &mdash; {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {exp.description ? (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {exp.description}
                  </p>
                ) : null}

                {/* Responsibilities */}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-semibold font-mono uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                      Key Engineering Responsibilities:
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs font-semibold font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5" />
                      Key Milestones & Impact:
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-zinc-500 mr-2 font-mono">Tech Stack:</span>
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
