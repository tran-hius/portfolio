import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const statusMessages = [
    "Initializing system kernel & runtime...",
    "Loading editorial typography & design tokens...",
    "Establishing 3D geometric coordinate matrix...",
    "Connecting realtime SSE telemetry stream...",
    "SYSTEM INITIALIZATION COMPLETE // READY",
  ];

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 300);
      return;
    }

    const startTime = Date.now();
    const duration = 1100; // ~1.1s smooth cinematic initialization

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(rawProgress);

      // Advance status messages along progress
      if (rawProgress >= 85) setStatusIndex(4);
      else if (rawProgress >= 65) setStatusIndex(3);
      else if (rawProgress >= 40) setStatusIndex(2);
      else if (rawProgress >= 15) setStatusIndex(1);
      else setStatusIndex(0);

      if (rawProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 450); // wait for exit animation
        }, 180);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#050507] text-[#f4f4f6] flex flex-col justify-between p-6 sm:p-10 select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? "opacity-0 -translate-y-8 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      {/* Subtle Technical Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      {/* Top Header Corner Metadata */}
      <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-muted tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>SYSTEM // TRAN HIEU PORTFOLIO</span>
        </div>
        <div className="text-muted-foreground hidden sm:block">
          BUILD 2026.08 // V2.4
        </div>
      </div>

      {/* Center Monogram & Progress */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
        {/* Monogram Box */}
        <div className="relative mb-8 group">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-surface-50 to-surface-100 border border-white/[0.12] flex items-center justify-center text-cyan-300 font-mono font-bold text-xl sm:text-2xl shadow-[0_0_40px_rgba(56,189,248,0.2)]">
            TH
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-cyan-400/20 blur-xl -z-10 animate-pulse" />
        </div>

        {/* System Title */}
        <h2 className="text-sm sm:text-base font-mono font-semibold tracking-widest text-white uppercase mb-2">
          System Initialization
        </h2>

        {/* Progressive Status Message */}
        <p className="text-xs font-mono text-cyan-300/90 h-5 mb-8 transition-all">
          {`> ${statusMessages[statusIndex]}`}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-surface-100 p-1 rounded-full border border-white/[0.08] mb-3">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-400 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(56,189,248,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Numeric Percentage */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-muted">
          <span>BOOTING</span>
          <span className="text-white font-semibold">{progress}%</span>
        </div>
      </div>

      {/* Bottom Footer Corner Metadata */}
      <div className="relative z-10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-muted tracking-widest uppercase">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">CLUSTER:</span>
          <span className="text-cyan-400">NODE-V24-ONLINE</span>
        </div>
        <div>
          <span>[{String(progress).padStart(3, "0")}% COMPLETE]</span>
        </div>
      </div>
    </div>
  );
};
