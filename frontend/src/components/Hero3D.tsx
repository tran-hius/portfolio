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
const generateTextParticleTargets = (text: string, count: number): THREE.Vector3[] => {
  const canvas = document.createElement("canvas");
  canvas.width = 460;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return Array.from({ length: count }, () => new THREE.Vector3(0, 0, 0));
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bold typography
  ctx.font = "900 46px 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const validPixels: { x: number; y: number }[] = [];

  const step = 3;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx]! > 120) {
        validPixels.push({
          x: (x - canvas.width / 2) * 1.55,
          y: -(y - canvas.height / 2) * 1.55,
        });
      }
    }
  }

  const targets: THREE.Vector3[] = [];
  const pixelCount = validPixels.length;

  for (let i = 0; i < count; i++) {
    if (pixelCount > 0) {
      const p = validPixels[i % pixelCount]!;
      const jitterZ = (Math.random() - 0.5) * 16;
      targets.push(new THREE.Vector3(p.x, p.y, jitterZ));
    } else {
      // Fallback ring distribution
      const angle = (i / count) * Math.PI * 2;
      const r = 120 + Math.random() * 40;
      targets.push(
        new THREE.Vector3(
          Math.cos(angle) * r,
          Math.sin(angle) * r,
          (Math.random() - 0.5) * 30
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
  const morphProgressRef = useRef(1);
  const triggerBlastRef = useRef(false);

  const handleNextWord = useCallback(() => {
    wordIdxRef.current = (wordIdxRef.current + 1) % WORDS.length;
    setCurrentWordIdx(wordIdxRef.current);
    morphProgressRef.current = 0;
    triggerBlastRef.current = true;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;

    const width = Math.max(container.clientWidth || 480, 320);
    const height = Math.max(container.clientHeight || 480, 360);

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 0, 420);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    } catch (err) {
      console.warn("WebGL Hero init failed:", err);
      return;
    }

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Pre-generate particle targets for each word
    const PARTICLE_COUNT = 900;
    const wordTargets: THREE.Vector3[][] = WORDS.map((word) =>
      generateTextParticleTargets(word, PARTICLE_COUNT)
    );

    // Current & Target positions array
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const initialTargets = wordTargets[0]!;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = initialTargets[i]!;
      // Start slightly randomized around target
      positions[i * 3] = t.x + (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = t.y + (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = t.z + (Math.random() - 0.5) * 80;

      // Glowing Cyan to Electric Indigo colors
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
        colors[i * 3] = 0.9; // White/Blue glow
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 1.0;
      }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Material with Soft Circular Falloff
    const particleMat = new THREE.PointsMaterial({
      size: 3.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particleSystem);

    // 3. Cybernetic Holographic Rings & Framework
    const ringGeo = new THREE.TorusGeometry(190, 1.2, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    mainGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(175, 1, 12, 60);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = Math.PI / 3;
    mainGroup.add(ringMesh2);

    // 4. Holographic Vertical Laser Scanner Line
    const laserGeo = new THREE.PlaneGeometry(360, 2);
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

      targetRotY = x * 0.35;
      targetRotX = -y * 0.25;

      mouse3D.set(x * (rect.width / 2.2), y * (rect.height / 2.2), 0);
    };

    const onClick = () => {
      // Trigger instant cyber blast and cycle word
      handleNextWord();
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);

    // 6. Responsive Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth || 480;
      const newH = container.clientHeight || 480;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    setTimeout(handleResize, 50);

    // 7. Auto Morph Timer (Every 3.8 seconds)
    const morphInterval = setInterval(() => {
      wordIdxRef.current = (wordIdxRef.current + 1) % WORDS.length;
      setCurrentWordIdx(wordIdxRef.current);
      morphProgressRef.current = 0;
    }, 3800);

    // 8. Main Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth Camera / Matrix Tilt Parallax
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      mainGroup.rotation.y = currentRotY + Math.sin(time * 0.4) * 0.08;
      mainGroup.rotation.x = currentRotX + Math.cos(time * 0.3) * 0.05;

      // Orbit rings rotation
      ringMesh1.rotation.z = time * 0.15;
      ringMesh2.rotation.y = -time * 0.2;
      ringMesh2.rotation.z = time * 0.1;

      // Laser Scanner oscillation
      laserMesh.position.y = Math.sin(time * 2.2) * 65;
      laserMesh.rotation.z = Math.sin(time * 1.5) * 0.05;

      // Particle Physics & Text Morphing
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      const activeTargetWord = wordTargets[wordIdxRef.current]!;

      // Check if blast burst was triggered
      if (triggerBlastRef.current) {
        triggerBlastRef.current = false;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 12 + Math.random() * 25;
          velocities[i * 3] = Math.cos(angle) * speed;
          velocities[i * 3 + 1] = Math.sin(angle) * speed;
          velocities[i * 3 + 2] = (Math.random() - 0.5) * speed * 2;
        }
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const target = activeTargetWord[i]!;

        // Current particle coords
        let px = posArray[i3]!;
        let py = posArray[i3 + 1]!;
        let pz = posArray[i3 + 2]!;

        // 1. Spring force toward target text coordinate
        const dx = target.x - px;
        const dy = target.y - py;
        const dz = target.z - pz;

        const spring = 0.065;
        const damping = 0.88;

        velocities[i3] = (velocities[i3]! + dx * spring) * damping;
        velocities[i3 + 1] = (velocities[i3 + 1]! + dy * spring) * damping;
        velocities[i3 + 2] = (velocities[i3 + 2]! + dz * spring) * damping;

        // 2. Mouse magnetic repulsion force
        const mouseDistX = px - mouse3D.x;
        const mouseDistY = py - mouse3D.y;
        const mouseDist = Math.hypot(mouseDistX, mouseDistY);

        if (mouseDist < 75 && mouseDist > 0.1) {
          const force = (1 - mouseDist / 75) * 12;
          velocities[i3]! += (mouseDistX / mouseDist) * force;
          velocities[i3 + 1]! += (mouseDistY / mouseDist) * force;
          velocities[i3 + 2]! += (Math.random() - 0.5) * force * 2;
        }

        // 3. Ambient wave float
        const wave = Math.sin(time * 2.5 + px * 0.02) * 0.4;

        // Apply velocity to position
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
      className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] flex items-center justify-center select-none"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial from-cyan-500/15 via-indigo-500/5 to-transparent blur-3xl opacity-70 pointer-events-none" />

      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer relative z-10 drop-shadow-[0_0_30px_rgba(56,189,248,0.25)] focus:outline-none"
        title="Click to trigger quantum cyber blast"
      />

      {/* Futuristic Cyber Overlay HUD */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 pointer-events-auto">
        <button
          onClick={handleNextWord}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-400/60 backdrop-blur-md text-[11px] font-mono text-cyan-300 shadow-lg transition-all active:scale-95 group"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="opacity-70 group-hover:opacity-100">
            [MODE: {WORDS[currentWordIdx]}]
          </span>
          <span className="text-white/40 group-hover:text-cyan-300 transition-colors">
            • Click to Morph ⚡
          </span>
        </button>
      </div>
    </div>
  );
};
