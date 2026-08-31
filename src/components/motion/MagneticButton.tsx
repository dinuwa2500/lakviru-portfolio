'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { SPRING_MAGNETIC } from './motion-variants';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  strength = 12,
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine) and (min-width: 768px)').matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRING_MAGNETIC);
  const springY = useSpring(y, SPRING_MAGNETIC);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !isDesktop || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = (clientX - centerX) / (width / 2);
    const distanceY = (clientY - centerY) / (height / 2);

    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    x.set(0);
    y.set(0);
  };

  if (shouldReduceMotion || !isDesktop) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
