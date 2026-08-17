import React, { useEffect, useRef, useState } from "react";

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");

  const mousePos = useRef({ x: -200, y: -200 });
  const currentPos = useRef({ x: -200, y: -200 });
  const currentScale = useRef(1);
  const targetScale = useRef(1);
  const currentOpacity = useRef(0);
  const targetOpacity = useRef(0);

  useEffect(() => {
    // Only activate on devices with precise pointer (desktop mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) {
      return;
    }

    setIsVisible(true);

    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      targetOpacity.current = 1;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cardEl = target.closest(
        '[data-cursor="card"], [data-cursor="project"], [data-cursor-text]'
      );

      const interactiveEl = target.closest(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor-interactive]'
      );

      if (cardEl) {
        targetScale.current = 1.65;
        const customText = cardEl.getAttribute("data-cursor-text") || "VIEW";
        setCursorText(customText);
      } else if (interactiveEl) {
        targetScale.current = 1.35;
        setCursorText("");
      } else {
        targetScale.current = 1;
        setCursorText("");
      }
    };

    const onMouseDown = () => {
      targetScale.current *= 0.88;
    };

    const onMouseUp = () => {
      targetScale.current = 1;
    };

    const onMouseLeave = () => {
      targetOpacity.current = 0;
    };

    const onMouseEnter = () => {
      targetOpacity.current = 1;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    // Smooth lerp physics for cursor lag
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateCursor = () => {
      animFrameId = requestAnimationFrame(updateCursor);

      currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.16);
      currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.16);
      currentScale.current = lerp(currentScale.current, targetScale.current, 0.18);
      currentOpacity.current = lerp(currentOpacity.current, targetOpacity.current, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%) scale(${currentScale.current})`;
        cursorRef.current.style.opacity = `${currentOpacity.current}`;
      }
    };

    animFrameId = requestAnimationFrame(updateCursor);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor fixed top-0 left-0 w-[80px] h-[80px] rounded-full bg-white pointer-events-none mix-blend-difference z-[99999] flex items-center justify-center will-change-transform select-none"
      style={{
        transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%) scale(1)",
        opacity: 0,
      }}
      aria-hidden="true"
    >
      {cursorText && (
        <span
          ref={textRef}
          className="text-black text-[9px] font-mono font-black tracking-widest uppercase select-none transition-all duration-200"
        >
          {cursorText}
        </span>
      )}
    </div>
  );
};
