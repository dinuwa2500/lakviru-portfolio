import { Variants } from 'framer-motion';

// Professional Animation Timing Guidelines
// Fast interaction: 150–250ms | Normal transition: 300–500ms | Section reveal: 500–800ms
export const TRANSITION_EASE = [0.16, 1, 0.3, 1] as const; // Apple/Linear-style smooth ease-out

export const SPRING_SNAPPY = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const SPRING_GENTLE = {
  type: 'spring',
  stiffness: 200,
  damping: 24,
};

export const SPRING_MAGNETIC = {
  type: 'spring',
  stiffness: 150,
  damping: 15,
  mass: 0.1,
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: TRANSITION_EASE },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: TRANSITION_EASE },
  },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: TRANSITION_EASE },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: TRANSITION_EASE },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: TRANSITION_EASE },
  },
};
