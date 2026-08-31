'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
      {/* Primary Ambient Gradient Orb */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] rounded-full"
      />

      {/* Secondary Cyan Ambient Accent */}
      <motion.div
        animate={{
          x: [0, -40, 25, 0],
          y: [0, 25, -30, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 right-10 w-[450px] h-[350px] bg-cyan-500/8 blur-[130px] rounded-full"
      />

      {/* Tertiary Violet Ambient Accent */}
      <motion.div
        animate={{
          x: [0, 25, -35, 0],
          y: [0, -20, 25, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 left-10 w-[400px] h-[350px] bg-purple-500/8 blur-[120px] rounded-full"
      />
    </div>
  );
}
