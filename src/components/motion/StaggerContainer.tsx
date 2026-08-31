'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from './motion-variants';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  viewportMargin?: string;
}

export function StaggerContainer({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.08,
  viewportMargin = '-40px',
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const customVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
