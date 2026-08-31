'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Mail, Code2 } from 'lucide-react';
import { Github, Linkedin } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { LivingArchitecture } from './LivingArchitecture';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { TRANSITION_EASE } from '@/components/motion/motion-variants';
import { ProfileData, ProjectData } from '@/types';

interface HeroSectionProps {
  profile: ProfileData;
  featuredProject?: ProjectData | null;
}

export function HeroSection({ profile, featuredProject }: HeroSectionProps) {
  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Personal Intro & CTAs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.05,
                },
              },
            }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Status Pill */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: TRANSITION_EASE },
                },
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for Software Engineering Roles</span>
              </div>
            </motion.div>

            {/* Name & Headline */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: TRANSITION_EASE },
                },
              }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
                Hi, I&apos;m{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-400 bg-clip-text text-transparent">
                  {profile.name}
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-700 dark:text-zinc-300 font-mono flex items-center gap-2">
                <Code2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>{profile.primaryTitle}</span>
              </h2>
            </motion.div>

            {/* Supporting Introduction Text */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: TRANSITION_EASE },
                },
              }}
              className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl"
            >
              {profile.heroSubtitle}
            </motion.p>

            {/* Action CTAs with Magnetic Effect */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: TRANSITION_EASE },
                },
              }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <MagneticButton strength={10}>
                <Link href="/projects">
                  <Button size="lg" variant="primary" className="gap-2 group shadow-lg shadow-indigo-500/25">
                    <span>View Projects</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </MagneticButton>

              <MagneticButton strength={8}>
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Contact Me</span>
                  </Button>
                </Link>
              </MagneticButton>

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
            </motion.div>

            {/* Social Links & Professional Networks */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.45, ease: TRANSITION_EASE },
                },
              }}
              className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400"
            >
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Connect:</span>
              <div className="flex items-center gap-2">
                <MagneticButton strength={6}>
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </a>
                </MagneticButton>

                <MagneticButton strength={6}>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </MagneticButton>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Senior Living Architecture Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: TRANSITION_EASE }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <LivingArchitecture featuredProject={featuredProject} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
