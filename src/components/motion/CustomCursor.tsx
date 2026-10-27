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

  // All state stored as MotionValues — zero React re-renders during animation
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // MotionValues for hover/click state to avoid React re-renders
  const hovered = useMotionValue(0); // 0 = normal, 1 = hovered
  const clicking = useMotionValue(0); // 0 = normal, 1 = clicking
  const visible = useMotionValue(0); // 0 = hidden, 1 = visible

  // Tighter spring: higher stiffness + damping = faster, less sluggish trailing
  const springConfig = { damping: 30, stiffness: 500, mass: 0.1 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  // Derive scale and opacity from MotionValues (no re-renders)
  const outerScale = useTransform(
    [hovered, clicking],
    ([h, c]: number[]) => (c ? 0.8 : h ? 1.8 : 1)
  );
  const outerOpacity = useTransform(
    [hovered, visible],
    ([h, v]: number[]) => v * (h ? 0.6 : 0.45)
  );
  const outerBorderColor = useTransform(hovered, [0, 1], ["#818cf8", "#6366f1"]);

  const innerScale = useTransform(
    [hovered, clicking],
    ([h, c]: number[]) => (c ? 1.5 : h ? 0.6 : 1)
  );
  const innerBg = useTransform(hovered, [0, 1], ["#6366f1", "#4f46e5"]);
  const innerOpacity = useTransform(visible, [0, 1], [0, 1]);

  React.useEffect(() => {
    // Only enable on non-touch desktop devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      visible.set(1);
    };

    const handleMouseDown = () => clicking.set(1);
    const handleMouseUp = () => clicking.set(0);

    // Use mouseover/mouseout on document (event delegation) — much less frequent than mousemove
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
  }, []);

  if (shouldReduceMotion || !mounted) return null;

  return (
    <>
      {/* 1. Outer Smooth Trailing Motion Round Ring / Aura */}
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

      {/* 2. Inner Instant Precision Center Dot */}
      <motion.div
        style={{
          x: rawX,
          y: rawY,
          translateX: "-50%",
          translateY: "-50%",
          scale: innerScale,
          backgroundColor: innerBg,
          opacity: innerOpacity,
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 pointer-events-none z-[9999] shadow-sm shadow-indigo-500/50 hidden md:block"
      />
    </>
  );
}
