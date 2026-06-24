"use client";

import { useEffect, useMemo, useState } from "react";

export interface CoreSpinLoaderProps {
  className?: string;
  messages?: string[];
  messageIntervalMs?: number;
  ariaLabel?: string;
}

/**
 * Local drop-in implementation inspired by the referenced 21st.dev Core Spin Loader.
 * It intentionally contains no external runtime dependency and is designed to be
 * restyled with the Silverstone design tokens before production use.
 */
export function CoreSpinLoader({
  className = "",
  messages = [
    "Initializing",
    "Loading...",
    "Fetching data...",
    "Syncing...",
    "Processing...",
    "Optimizing...",
  ],
  messageIntervalMs = 1000,
  ariaLabel = "Loading page",
}: CoreSpinLoaderProps) {
  const safeMessages = useMemo(
    () => (messages.length > 0 ? messages : ["Loading..."]),
    [messages],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (safeMessages.length <= 1) return;
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeMessages.length);
    }, messageIntervalMs);
    return () => window.clearInterval(interval);
  }, [messageIntervalMs, safeMessages]);

  return (
    <div
      aria-label={ariaLabel}
      aria-live="polite"
      className={`relative flex min-h-[320px] w-full flex-col items-center justify-center gap-8 overflow-hidden ${className}`}
      role="status"
    >
      <div className="relative size-40 sm:size-48" aria-hidden="true">
        <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle,rgba(94,197,208,0.28),rgba(169,124,192,0.12)_42%,transparent_72%)] blur-xl" />
        <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full border border-dashed border-cyan-300/45" />
        <div className="absolute inset-3 animate-[spin_3.8s_cubic-bezier(.45,0,.55,1)_infinite] rounded-full border-[3px] border-transparent border-r-fuchsia-300 border-t-cyan-300 shadow-[0_0_26px_rgba(94,197,208,0.3)]" />
        <div className="absolute inset-7 animate-[spin_2.8s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-violet-300 border-l-blue-300" />
        <div className="absolute inset-11 animate-[spin_1.4s_linear_infinite] rounded-full border border-transparent border-r-white/85 border-t-pink-300" />
        <div className="absolute inset-[3.35rem] rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#e9eaef_12%,#5ec5d0_38%,#597fad_58%,#a97cc0_74%,#1a2025_100%)] shadow-[0_0_30px_rgba(200,132,195,0.35)]" />
        <div className="absolute left-1/2 top-0 size-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_18px_4px_rgba(94,197,208,0.75)]" />
      </div>
      <p className="max-w-xl px-6 text-center text-sm font-medium tracking-[0.16em] text-white/80 sm:text-base">
        {safeMessages[index]}
      </p>
    </div>
  );
}
