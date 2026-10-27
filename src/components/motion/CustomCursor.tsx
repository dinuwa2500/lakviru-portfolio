"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

/**
 * CursorSpotlight
 *
 * Renders two things:
 *   1. A fancy glowing ring that trails the native cursor (CSS transition)
 *   2. A soft ambient radial-gradient spotlight behind the cursor
 *
 * Performance strategy:
 *   - Native OS cursor is kept visible (no cursor:none)
 *   - JS only does: e.clientX/Y → body CSS custom property (one line per event)
 *   - CSS `@property` (registered <length> type) enables the browser to
 *     transition --cx / --cy natively on the compositor — zero rAF, zero
 *     React re-renders, zero layout reflow.
 *   - Hover/click state is toggled via body dataset attributes → CSS selectors
 *     handle all visual changes. No JS animation at all.
 */
export function CursorSpotlight() {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (shouldReduceMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setActive(true);

    const body = document.body;

    const onMove = (e: MouseEvent) => {
      body.style.setProperty("--cx", `${e.clientX}px`);
      body.style.setProperty("--cy", `${e.clientY}px`);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const hoverable =
        t.closest("a") ||
        t.closest("button") ||
        t.closest('[role="button"]') ||
        t.closest("input") ||
        t.closest("select") ||
        t.closest("textarea") ||
        t.closest("label") ||
        t.getAttribute("data-cursor-hover") === "true";
      body.dataset.cursorHover = hoverable ? "true" : "false";
    };

    const onDown = () => { body.dataset.cursorClick = "true"; };
    const onUp   = () => { body.dataset.cursorClick = "false"; };
    const onLeave = () => { body.dataset.cursorVisible = "false"; };
    const onEnter = () => { body.dataset.cursorVisible = "true"; };

    body.dataset.cursorVisible = "false";

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup",   onUp,   { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      body.style.removeProperty("--cx");
      body.style.removeProperty("--cy");
      delete body.dataset.cursorHover;
      delete body.dataset.cursorClick;
      delete body.dataset.cursorVisible;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (shouldReduceMotion || !active) return null;

  return (
    <>
      {/* Trailing glow ring — styled entirely via CSS, no inline animation */}
      <div aria-hidden="true" className="cursor-ring hidden md:block" />
      {/* Page-wide ambient spotlight */}
      <div aria-hidden="true" className="cursor-spotlight pointer-events-none fixed inset-0 z-[9989] hidden md:block" />
    </>
  );
}
