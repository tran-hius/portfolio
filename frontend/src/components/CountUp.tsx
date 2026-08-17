import React, { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number | string;
  durationMs?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

// Ease out cubic function for ultra-smooth counting deceleration
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const CountUp: React.FC<CountUpProps> = ({
  value,
  durationMs = 1400,
  decimals,
  prefix = "",
  suffix = "",
  className = "",
}) => {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  // Automatically parse numeric value, prefixes, and suffixes if string is provided
  let targetNum = 0;
  let detectedPrefix = prefix;
  let detectedSuffix = suffix;
  let detectedDecimals = decimals;

  if (typeof value === "number") {
    targetNum = value;
    if (detectedDecimals === undefined) {
      detectedDecimals = Number.isInteger(value) ? 0 : 1;
    }
  } else {
    const str = String(value).trim();
    // Check for leading characters like "< ", "> ", "$"
    const prefixMatch = str.match(/^[^\d.]+/);
    if (prefixMatch && !prefix) {
      detectedPrefix = prefixMatch[0];
    }

    // Check for trailing characters like "+", "%", "ms", "k"
    const suffixMatch = str.match(/[^\d.]+$/);
    if (suffixMatch && !suffix) {
      detectedSuffix = suffixMatch[0];
    }

    // Extract numeric part
    const numMatch = str.match(/[\d.]+/);
    if (numMatch) {
      targetNum = parseFloat(numMatch[0]);
      if (detectedDecimals === undefined) {
        const dotIndex = numMatch[0].indexOf(".");
        detectedDecimals = dotIndex >= 0 ? numMatch[0].length - dotIndex - 1 : 0;
      }
    }
  }

  const effectiveDecimals = detectedDecimals ?? 0;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplayValue(targetNum.toFixed(effectiveDecimals));
      return;
    }

    let animationFrameId: number;

    const startCounting = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const easedProgress = easeOutExpo(progress);

        const currentVal = easedProgress * targetNum;
        setDisplayValue(currentVal.toFixed(effectiveDecimals));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCounter);
        } else {
          setDisplayValue(targetNum.toFixed(effectiveDecimals));
        }
      };

      animationFrameId = requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          startCounting();
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetNum, durationMs, effectiveDecimals]);

  return (
    <span ref={elementRef} className={`inline-flex items-baseline ${className}`}>
      {detectedPrefix}
      {displayValue}
      {detectedSuffix}
    </span>
  );
};
