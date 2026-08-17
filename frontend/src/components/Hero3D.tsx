import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const WORDS = [
  "TRAN HIEU",
  "FULL-STACK",
  "ARCHITECT",
  "REACT • NODE",
  "DEV.SYSTEM",
];

// Sample high-density 3D particle coordinates from rasterized text
const generateTextParticleTargets = (
  text: string,
  count: number,
  scaleFactor: number = 1.0
): THREE.Vector3[] => {
  const canvas = document.createElement("canvas");
  canvas.width = 540;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Array.from({ length: count }, () => new THREE.Vector3(0, 0, 0));
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bold high-tech typography
  ctx.font = "900 52px 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const validPixels: { x: number; y: number }[] = [];

  const step = 3;
  const spreadX = 1.85 * scaleFactor;
  const spreadY = 1.85 * scaleFactor;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx]! > 110) {
        validPixels.push({
          x: (x - canvas.width / 2) * spreadX,
          y: -(y - canvas.height / 2) * spreadY,
        });
      }
    }
  }

  const targets: THREE.Vector3[] = [];
  const pixelCount = validPixels.length;

  for (let i = 0; i < count; i++) {
    if (pixelCount > 0) {
      const p = validPixels[i % pixelCount]!;
      const jitterZ = (Math.random() - 0.5) * 20 * scaleFactor;
      targets.push(new THREE.Vector3(p.x, p.y, jitterZ));
    } else {
      const angle = (i / count) * Math.PI * 2;
      const r = (160 + Math.random() * 50) * scaleFactor;
      targets.push(
        new THREE.Vector3(
          Math.cos(angle) * r,
          Math.sin(angle) * r,
          (Math.random() - 0.5) * 40 * scaleFactor
        )
      );
    }
  }

  return targets;
};

export const Hero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  const wordIdxRef = useRef(0);
  const triggerBlastRef = useRef(false);

  const handleNextWord = useCallback(() => {
    wordIdxRef.current = (wordIdxRef.current + 1) % WORDS.length;
    setCurrentWordIdx(wordIdxRef.current);
    triggerBlastRef.current = true;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;

    // Measure actual rendered parent container bounds (full available right column)
    const initialWidth = container.clientWidth || 600;
    const initialHeight = container.clientHeight || 600;

    // 1. Scene & Camera Setup (Full responsive aspect ratio)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      initialWidth / initialHeight,
      1,
      2000
    );
    camera.position.set(0, 0, 480);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(initialWidth, initialHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    } catch (err) {
      console.warn("WebGL Hero init failed:", err);
      return;
    }

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. High-Density Particle Setup (1300 particles for full-size visual fill)
    const PARTICLE_COUNT = 1300;
    const wordTargets: THREE.Vector3[][] = WORDS.map((word) =>
      generateTextParticleTargets(word, PARTICLE_COUNT, 1.15)
    );

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const initialTargets = wordTargets[0]!;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = initialTargets[i]!;
      positions[i * 3] = t.x + (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = t.y + (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = t.z + (Math.random() - 0.5) * 120;

      const mix = Math.random();
      if (mix > 0.5) {
        colors[i * 3] = 0.22; // R (Cyan #38bdf8)
        colors[i * 3 + 1] = 0.74; // G
        colors[i * 3 + 2] = 0.97; // B
      } else if (mix > 0.2) {
        colors[i * 3] = 0.06; // R (Emerald #10b981)
        colors[i * 3 + 1] = 0.72;
        colors[i * 3 + 2] = 0.5;
      } else {
        colors[i * 3] = 0.95; // White/Blue brilliance
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 1.0;
      }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 4.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // 3. Cybernetic Holographic Outer Rings (Expanded to fill large container)
    const ringGeo1 = new THREE.TorusGeometry(230, 1.2, 16, 90);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    mainGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(215, 1, 12, 70);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 3;
    mainGroup.add(ringMesh2);

    // Outer Orbit Data Nodes Ring
    const outerRingGeo = new THREE.RingGeometry(255, 258, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    mainGroup.add(outerRingMesh);

    // 4. Holographic Vertical Laser Scanner (Extended width)
    const laserGeo = new THREE.PlaneGeometry(480, 2.5);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    mainGroup.add(laserMesh);

    // 5. Interactive Mouse Parallax & Repulsion
    const mouse3D = new THREE.Vector3(0, 0, 0);
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      targetRotY = x * 0.38;
      targetRotX = -y * 0.28;

      mouse3D.set(x * (rect.width / 2.1), y * (rect.height / 2.1), 0);
    };

    const onClick = () => {
      handleNextWord();
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);

    // 6. Full-Size Dynamic ResizeObserver (No fixed pixel limits)
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH, false);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // 7. Auto Morph Timer (Every 3.8s)
    const morphInterval = setInterval(() => {
      wordIdxRef.current = (wordIdxRef.current + 1) % WORDS.length;
      setCurrentWordIdx(wordIdxRef.current);
    }, 3800);

    // 8. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth Camera Parallax Tilt
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      mainGroup.rotation.y = currentRotY + Math.sin(time * 0.35) * 0.07;
      mainGroup.rotation.x = currentRotX + Math.cos(time * 0.28) * 0.05;

      // Orbit rings rotation
      ringMesh1.rotation.z = time * 0.14;
      ringMesh2.rotation.y = -time * 0.18;
      ringMesh2.rotation.z = time * 0.08;
      outerRingMesh.rotation.z = -time * 0.05;

      // Laser Scanner oscillation across the text
      laserMesh.position.y = Math.sin(time * 2.0) * 80;
      laserMesh.rotation.z = Math.sin(time * 1.2) * 0.04;

      // Particle Physics & Text Morphing
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      const activeTargetWord = wordTargets[wordIdxRef.current]!;

      // Particle explosion pulse
      if (triggerBlastRef.current) {
        triggerBlastRef.current = false;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 14 + Math.random() * 28;
          velocities[i * 3] = Math.cos(angle) * speed;
          velocities[i * 3 + 1] = Math.sin(angle) * speed;
          velocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 2;
        }
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const target = activeTargetWord[i]!;

        const px = posArray[i3]!;
        const py = posArray[i3 + 1]!;
        const pz = posArray[i3 + 2]!;

        // 1. Spring force toward target text coordinate
        const dx = target.x - px;
        const dy = target.y - py;
        const dz = target.z - pz;

        const spring = 0.062;
        const damping = 0.88;

        velocities[i3] = (velocities[i3]! + dx * spring) * damping;
        velocities[i3 + 1] = (velocities[i3 + 1]! + dy * spring) * damping;
        velocities[i3 + 2] = (velocities[i3 + 2]! + dz * spring) * damping;

        // 2. Mouse magnetic repulsion force
        const mouseDistX = px - mouse3D.x;
        const mouseDistY = py - mouse3D.y;
        const mouseDist = Math.hypot(mouseDistX, mouseDistY);

        if (mouseDist < 85 && mouseDist > 0.1) {
          const force = (1 - mouseDist / 85) * 14;
          velocities[i3]! += (mouseDistX / mouseDist) * force;
          velocities[i3 + 1]! += (mouseDistY / mouseDist) * force;
          velocities[i3 + 2]! += (Math.random() - 0.5) * force * 2;
        }

        // 3. Ambient wave float
        const wave = Math.sin(time * 2.2 + px * 0.015) * 0.45;

        // Apply velocity
        posArray[i3] = px + velocities[i3]!;
        posArray[i3 + 1] = py + velocities[i3 + 1]! + wave;
        posArray[i3 + 2] = pz + velocities[i3 + 2]!;
      }

      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      clearInterval(morphInterval);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onClick);
      scene.clear();
      renderer.dispose();
    };
  }, [handleNextWord]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] xl:min-h-[640px] flex items-center justify-center select-none overflow-visible"
    >
      {/* Full-width ambient cyber glow */}
      <div className="absolute inset-0 w-full h-full bg-radial from-cyan-500/20 via-indigo-500/8 to-transparent blur-3xl opacity-80 pointer-events-none" />

      {/* 3D WebGL Canvas - 100% full size */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer relative z-10 drop-shadow-[0_0_40px_rgba(56,189,248,0.3)] focus:outline-none"
        title="Click to trigger quantum cyber blast"
      />

      {/* Futuristic Cyber Overlay HUD */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 pointer-events-auto">
        <button
          onClick={handleNextWord}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/85 border border-cyan-500/35 hover:border-cyan-400/70 backdrop-blur-md text-[11px] font-mono text-cyan-300 shadow-xl transition-all active:scale-95 group cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="opacity-80 group-hover:opacity-100 font-semibold tracking-wide">
            [MODE: {WORDS[currentWordIdx]}]
          </span>
          <span className="text-white/50 group-hover:text-cyan-300 transition-colors">
            • Click to Morph ⚡
          </span>
        </button>
      </div>
    </div>
  );
};
