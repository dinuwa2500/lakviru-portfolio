"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

/**
 * CursorSpotlight — replaces the old JS-tracked custom cursor.
 *
 * Technique: Updates two CSS custom properties (--cx, --cy) on <body>
 * via requestAnimationFrame. A pure-CSS radial-gradient on a fixed overlay
 * div reads those vars and renders a soft ambient glow that trails the cursor.
 *
 * Performance characteristics:
 * - Zero React re-renders (no state, no refs that trigger renders)
 * - One rAF loop — coalesces with browser paint, never blocks main thread
 * - CSS radial-gradient is GPU-composited (no layout, no paint)
 * - Native OS cursor is fully restored — zero perceived input lag
 */
export function CursorSpotlight() {
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    // Only enable on real pointer (desktop) devices
    if (shouldReduceMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let cx = -500;
    let cy = -500;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
    };

    const tick = () => {
      document.body.style.setProperty("--cx", `${cx}px`);
      document.body.style.setProperty("--cy", `${cy}px`);
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      document.body.style.removeProperty("--cx");
      document.body.style.removeProperty("--cy");
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="cursor-spotlight pointer-events-none fixed inset-0 z-[9990] hidden md:block"
    />
  );
}
