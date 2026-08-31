'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    // Only run continuous animated mesh on non-touch desktop screens
    const isFinePointer = window.matchMedia('(pointer: fine) and (min-width: 768px)').matches;
    setIsDesktop(isFinePointer);
  }, []);

  // For mobile or reduced motion: Render a static, lightweight ambient glow with zero JS loop
  if (shouldReduceMotion || !isDesktop) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[300px] bg-indigo-600/10 dark:bg-indigo-600/15 blur-[60px] rounded-full" />
        <div className="absolute top-2/3 right-4 w-[250px] h-[200px] bg-purple-600/5 dark:bg-purple-600/10 blur-[50px] rounded-full hidden sm:block" />
      </div>
    );
  }

  // Desktop: Smooth animated ambient background
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden will-change-transform">
      {/* Primary Ambient Gradient Orb */}
      <motion.div
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.05, 0.97, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-transparent blur-[110px] rounded-full"
      />

      {/* Secondary Cyan Ambient Accent */}
      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -25, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-cyan-500/8 blur-[100px] rounded-full"
      />
    </div>
  );
}
