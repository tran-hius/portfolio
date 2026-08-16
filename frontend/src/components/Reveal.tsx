import type { ReactNode } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal.js";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  durationMs?: number;
}

export const Reveal = ({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
  durationMs = 500,
}: RevealProps) => {
  const { ref, isVisible } = useScrollReveal();

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0) scale(1)";
    switch (direction) {
      case "up":
        return "translate3d(0, 24px, 0)";
      case "down":
        return "translate3d(0, -24px, 0)";
      case "left":
        return "translate3d(24px, 0, 0)";
      case "right":
        return "translate3d(-24px, 0, 0)";
      case "none":
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
      }}
      className={`transition-all ${className}`}
    >
      {children}
    </div>
  );
};
