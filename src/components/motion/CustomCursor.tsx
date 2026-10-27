"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
} from "framer-motion";

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  // Positional MotionValues — these drive the DOM directly, no React re-renders
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // State MotionValues — set these instead of React state to avoid re-renders
  const hovered = useMotionValue(0);  // 0 = normal, 1 = hovered
  const clicking = useMotionValue(0); // 0 = normal, 1 = clicking
  const visible = useMotionValue(0);  // 0 = hidden, 1 = visible

  // Snappier spring: high stiffness, low mass removes the lagging/sluggish feel
  const springConfig = { damping: 30, stiffness: 500, mass: 0.1 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  // All visual properties derived from MotionValues — GPU-composited, no layout
  const outerOpacity = useTransform(visible, [0, 1], [0, 1]);
  const outerBorderColor = useTransform(hovered, [0, 1], ["#818cf8", "#6366f1"]);

  // Outer ring scale: clicking=0.8, hovered=1.8, normal=1
  // We chain two transforms: first hovered→scale, then clicking overrides
  const outerScaleFromHover = useTransform(hovered, [0, 1], [1, 1.8]);
  const outerScaleFromClick = useTransform(clicking, [0, 1], [1, 0.8]);
  // Use a combined spring on the merged scale
  const outerScale = useTransform(
    [outerScaleFromHover, outerScaleFromClick],
    // clicking takes priority, otherwise hover scale
    (latest: number[]) => (latest[1] < 1 ? latest[1] : latest[0])
  );

  const innerOpacity = useTransform(visible, [0, 1], [0, 1]);
  const innerBg = useTransform(hovered, [0, 1], ["#6366f1", "#4f46e5"]);

  // Inner dot scale: clicking=1.5, hovered=0.6, normal=1
  const innerScaleFromHover = useTransform(hovered, [0, 1], [1, 0.6]);
  const innerScaleFromClick = useTransform(clicking, [0, 1], [1, 1.5]);
  const innerScale = useTransform(
    [innerScaleFromHover, innerScaleFromClick],
    (latest: number[]) => (latest[1] > 1 ? latest[1] : latest[0])
  );

  React.useEffect(() => {
    // Only enable on non-touch desktop pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      visible.set(1);
    };

    const handleMouseDown = () => clicking.set(1);
    const handleMouseUp = () => clicking.set(0);

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
        hovered.set(1);
      } else {
        hovered.set(0);
      }
    };

    const handleMouseLeave = () => {
      visible.set(0);
    };

    // All passive — never blocks the browser's main thread scroll/paint
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — no listener re-registration on state changes

  if (shouldReduceMotion || !mounted) return null;

  return (
    <>
      {/* 1. Outer Smooth Trailing Ring / Aura — follows with spring physics */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          scale: outerScale,
          opacity: outerOpacity,
          borderColor: outerBorderColor,
        }}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-indigo-500/80 bg-indigo-500/10 pointer-events-none z-[9998] backdrop-blur-[0.5px] hidden md:block"
      />

      {/* 2. Inner Instant Precision Center Dot — snaps to exact cursor position */}
      <motion.div
        style={{
          x: rawX,
          y: rawY,
          translateX: "-50%",
          translateY: "-50%",
          scale: innerScale,
          opacity: innerOpacity,
          backgroundColor: innerBg,
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 pointer-events-none z-[9999] shadow-sm shadow-indigo-500/50 hidden md:block"
      />
    </>
  );
}
