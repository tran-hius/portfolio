import { useEffect, useRef } from "react";

export const Hero3D = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = x / (width / 2);
      mouseY = y / (height / 2);
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.45;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const phi = (1 + Math.sqrt(5)) / 2; 
    const scale = Math.min(width, height) * 0.28;

    const baseVertices: [number, number, number][] = [
      [-1, phi, 0],
      [1, phi, 0],
      [-1, -phi, 0],
      [1, -phi, 0],
      [0, -1, phi],
      [0, 1, phi],
      [0, -1, -phi],
      [0, 1, -phi],
      [phi, 0, -1],
      [phi, 0, 1],
      [-phi, 0, -1],
      [-phi, 0, 1],
    ].map(([x, y, z]) => [x * scale * 0.65, y * scale * 0.65, z * scale * 0.65]);

    const numParticles = 40;
    const particles: { x: number; y: number; z: number; size: number; speed: number; angle: number; radius: number }[] = [];

    for (let i = 0; i < numParticles; i++) {
      const radius = scale * (0.85 + Math.random() * 0.6);
      const angle = (i / numParticles) * Math.PI * 2;
      particles.push({
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.5) * scale * 0.9,
        z: Math.sin(angle) * radius,
        size: Math.random() * 1.8 + 0.8,
        speed: 0.004 + Math.random() * 0.006,
        angle,
        radius,
      });
    }

    let baseAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
      baseAngle += 0.005;

      const currentRotY = baseAngle + rotY;
      const currentRotX = Math.sin(baseAngle * 0.5) * 0.15 + rotX;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      const project = (x: number, y: number, z: number): [number, number, number, number] => {
        
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        const fov = 400;
        const depth = fov / (fov + z2 + 250);
        const px = width / 2 + x1 * depth;
        const py = height / 2 + y2 * depth;

        return [px, py, z2, depth];
      };

      const projected = baseVertices.map(([x, y, z]) => project(x, y, z));

      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const [x1, y1, z1_orig] = baseVertices[i]!;
          const [x2, y2, z2_orig] = baseVertices[j]!;
          const dist3D = Math.hypot(x1 - x2, y1 - y2, z1_orig - z2_orig);

          if (dist3D < scale * 1.5) {
            const [p1x, p1y, p1z] = projected[i]!;
            const [p2x, p2y] = projected[j]!;

            const avgZ = (p1z + projected[j]![2]) / 2;
            const alpha = Math.max(0.04, Math.min(0.35, (avgZ + scale) / (scale * 2.5)));

            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < projected.length; i++) {
        const [px, py, pz, depth] = projected[i]!;
        const radius = Math.max(1.5, 3.5 * depth);
        const alpha = Math.max(0.2, (pz + scale) / (scale * 2));

        const grad = ctx.createRadialGradient(px, py, 0, px, py, radius * 3);
        grad.addColorStop(0, `rgba(56, 189, 248, ${alpha})`);
        grad.addColorStop(1, "rgba(56, 189, 248, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(224, 242, 254, ${alpha + 0.2})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of particles) {
        p.angle += p.speed;
        const px3d = Math.cos(p.angle) * p.radius;
        const pz3d = Math.sin(p.angle) * p.radius;

        const [projX, projY, projZ, depth] = project(px3d, p.y, pz3d);
        const alpha = Math.max(0.1, Math.min(0.6, (projZ + scale * 1.5) / (scale * 3)));

        ctx.fillStyle = `rgba(125, 211, 252, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(projX, projY, p.size * depth, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] lg:h-[540px] flex items-center justify-center pointer-events-none">
      
      <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent blur-3xl opacity-60 pointer-events-none" />
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10 opacity-90 drop-shadow-[0_0_25px_rgba(56,189,248,0.2)]"
        aria-hidden="true"
      />
    </div>
  );
};
