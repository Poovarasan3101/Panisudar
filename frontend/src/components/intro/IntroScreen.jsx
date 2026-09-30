import React, { useState, useEffect } from 'react';
import BlurText from './BlurText';
import './IntroScreen.css';

const INTRO_SEEN_KEY = 'panisudarIntroSeen';

/**
 * IntroScreen Component
 *
 * One-time website loading splash screen.
 *
 * Timeline:
 * 0ms        : Appears immediately on initial mount
 * 0ms - 350ms: Title and frame smoothly enter
 * 350ms-650ms: Remains visible
 * 650ms      : Exit animation starts (isExiting = true)
 * 1000ms     : Intro is completely unmounted from the DOM (showIntro = false)
 *
 * Does not re-trigger on route navigation.
 * Uses sessionStorage so it shows once per browser session.
 */
export default function IntroScreen() {
  const [showIntro, setShowIntro] = useState(() => {
    // Only show if not previously seen in this browser session
    try {
      return !sessionStorage.getItem(INTRO_SEEN_KEY);
    } catch {
      return true;
    }
  });

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!showIntro) return;

    // Mark as seen immediately so any rapid refreshes/routes won't show it again
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {
      // sessionStorage unavailable fallback
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setShowIntro(false);
      return;
    }

    // 1. At 3400ms: begin smooth exit animation (opacity 1 -> 0, translateY 0 -> -20px)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3400);

    // 2. At 4000ms (4s): completely remove/unmount intro screen from DOM
    const removeTimer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [showIntro]);

  if (!showIntro) {
    return null;
  }

  return (
    <aside
      className={`intro-screen-overlay ${isExiting ? 'exiting' : ''}`}
      aria-label="Website loading intro"
      aria-live="polite"
    >
      {/* Subtle architectural viewport frame */}
      <div className="intro-screen-frame" />

      {/* Top watermark / brand badge */}
      <div className="intro-screen-badge">
        <span className="intro-screen-dot" />
        <span>PANISUDAR // 2026</span>
      </div>

      {/* Ambient background glow */}
      <div className="intro-screen-glow" />

      {/* Centered Typography */}
      <div className="intro-screen-content">
        <BlurText
          text="PANISUDAR CAREERS"
          delay={180}
          animateBy="words"
          direction="top"
          className="intro-screen-title"
        />
        <p className="intro-screen-subtitle">Find. Apply. Grow.</p>
      </div>
    </aside>
  );
}
