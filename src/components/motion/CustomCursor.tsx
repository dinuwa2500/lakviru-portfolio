"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isClicking, setIsClicking] = React.useState(false);

  // Exact immediate cursor coordinates for the center dot
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Smooth spring physics for the outer trailing round aura
  const springConfig = { damping: 26, stiffness: 350, mass: 0.25 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  React.useEffect(() => {
    // Only enable on non-touch desktop devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea") ||
        target.closest("label") ||
        target.getAttribute("data-cursor-hover") === "true"
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [rawX, rawY, isVisible]);

  if (shouldReduceMotion || !isVisible) return null;

  return (
    <>
      {/* 1. Outer Smooth Trailing Motion Round Ring / Aura */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 1.8 : 1,
          opacity: isHovered ? 0.6 : 0.45,
          borderColor: isHovered ? "#6366f1" : "#818cf8",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className='fixed top-0 left-0 w-8 h-8 rounded-full border border-indigo-500/80 bg-indigo-500/10 pointer-events-none z-[9998] backdrop-blur-[0.5px] hidden md:block'
      />

      {/* 2. Inner Instant Precision Center Dot */}
      <motion.div
        style={{
          x: rawX,
          y: rawY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 1.5 : isHovered ? 0.6 : 1,
          backgroundColor: isHovered ? "#4f46e5" : "#6366f1",
        }}
        transition={{ duration: 0.1 }}
        className='fixed top-0 left-0 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 pointer-events-none z-[9999] shadow-sm shadow-indigo-500/50 hidden md:block'
      />
    </>
  );
}
