import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { Skill } from "../types/portfolio.js";

interface SkillGalaxy3DProps {
  skills: Skill[];
  activeCategory: string;
  onSelectCategory?: (category: string) => void;
}

interface SkillNodeData {
  skill: Skill;
  position: THREE.Vector3;
  colorHex: string;
  colorNum: number;
  lightHex: string;
  mesh: THREE.Mesh;
  haloMesh: THREE.Mesh;
  sprite: THREE.Sprite;
  currentScale: number;
  targetScale: number;
  currentOpacity: number;
  targetOpacity: number;
}

const getCategoryColor = (category?: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("front") || cat.includes("ui") || cat.includes("web")) {
    return { main: 0x06b6d4, hex: "#06b6d4", light: "#38bdf8" }; // Cyan
  }
  if (cat.includes("back") || cat.includes("api") || cat.includes("node")) {
    return { main: 0x10b981, hex: "#10b981", light: "#34d399" }; // Emerald
  }
  if (cat.includes("data") || cat.includes("db") || cat.includes("sql")) {
    return { main: 0xf59e0b, hex: "#f59e0b", light: "#fbbf24" }; // Amber
  }
  if (cat.includes("devops") || cat.includes("cloud") || cat.includes("tool")) {
    return { main: 0x8b5cf6, hex: "#8b5cf6", light: "#a78bfa" }; // Purple
  }
  return { main: 0x38bdf8, hex: "#38bdf8", light: "#7dd3fc" }; // Sky Default
};

const createTextSprite = (skill: Skill, colorHex: string, lightHex: string): THREE.Sprite => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const fallbackMat = new THREE.SpriteMaterial({ transparent: true, opacity: 0 });
    return new THREE.Sprite(fallbackMat);
  }

  canvas.width = 384;
  canvas.height = 140;

  const radius = 24;
  const x = 12;
  const y = 14;
  const w = canvas.width - 24;
  const h = canvas.height - 28;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background Glass Pill
  const bgGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  bgGrad.addColorStop(0, "rgba(8, 14, 28, 0.92)");
  bgGrad.addColorStop(1, "rgba(15, 23, 42, 0.85)");

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Glowing Border
  ctx.lineWidth = 3;
  ctx.strokeStyle = colorHex;
  ctx.stroke();

  // Category Tag Badge
  const catText = (skill.category || "TECH").toUpperCase();
  ctx.font = "bold 18px monospace";
  ctx.fillStyle = lightHex;
  ctx.fillText(catText, x + 20, y + 36);

  // Skill Name
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(skill.name, x + 20, y + 74);

  // Proficiency Indicator if available
  if (typeof skill.proficiency === "number" && skill.proficiency > 0) {
    const barW = 70;
    const barH = 5;
    const barX = x + w - barW - 20;
    const barY = y + 66;

    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 3);
    ctx.fill();

    ctx.fillStyle = lightHex;
    ctx.beginPath();
    ctx.roundRect(barX, barY, (barW * Math.min(100, skill.proficiency)) / 100, barH, 3);
    ctx.fill();
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(44, 16, 1);
  return sprite;
};

export const SkillGalaxy3D: React.FC<SkillGalaxy3DProps> = ({
  skills,
  activeCategory,
  onSelectCategory,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const isAutoRotatingRef = useRef(true);
  const activeCategoryRef = useRef(activeCategory);
  const skillsRef = useRef(skills);
  const onSelectCategoryRef = useRef(onSelectCategory);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const nodesListRef = useRef<SkillNodeData[]>([]);

  // Keep refs up-to-date without triggering full WebGL teardowns
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    activeCategoryRef.current = activeCategory;
  }, [activeCategory]);

  useEffect(() => {
    skillsRef.current = skills;
  }, [skills]);

  useEffect(() => {
    onSelectCategoryRef.current = onSelectCategory;
  }, [onSelectCategory]);

  // Reset View
  const handleResetCamera = useCallback(() => {
    if (!cameraRef.current || !mainGroupRef.current) return;
    mainGroupRef.current.rotation.set(0, 0, 0);
    cameraRef.current.position.set(0, 15, 390);
    cameraRef.current.lookAt(0, 0, 0);
    setIsAutoRotating(true);
    isAutoRotatingRef.current = true;
    setSelectedSkill(null);
    setHoveredSkill(null);
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotating((prev) => {
      isAutoRotatingRef.current = !prev;
      return !prev;
    });
  }, []);

  // Main WebGL Scene Initialization (runs once on mount)
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;

    const width = Math.max(container.clientWidth || 600, 300);
    const height = Math.max(container.clientHeight || 520, 350);

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 15, 390);
    cameraRef.current = camera;

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
      rendererRef.current = renderer;
    } catch (err) {
      console.warn("WebGL initialization failed:", err);
      return;
    }

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // 2. Cosmic Core (Icosahedron + Glowing center)
    const coreGeo = new THREE.IcosahedronGeometry(24, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    const innerCoreGeo = new THREE.SphereGeometry(12, 16, 16);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.85,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    mainGroup.add(innerCoreMesh);

    // 3. Background Starfield
    const starCount = 300;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 240 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const colorMix = Math.random();
      if (colorMix > 0.6) {
        starColors[i * 3] = 0.22;
        starColors[i * 3 + 1] = 0.74;
        starColors[i * 3 + 2] = 0.97;
      } else if (colorMix > 0.3) {
        starColors[i * 3] = 0.06;
        starColors[i * 3 + 1] = 0.72;
        starColors[i * 3 + 2] = 0.5;
      } else {
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 1.0;
      }
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 800);
    pointLight.position.set(150, 150, 150);
    scene.add(pointLight);

    // 5. Create Skill Nodes
    const currentSkills = skillsRef.current;
    const nodes: SkillNodeData[] = [];
    const sphereRadius = 160;
    const count = Math.max(currentSkills.length, 1);

    currentSkills.forEach((skill, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const pos = new THREE.Vector3(
        sphereRadius * Math.sin(phi) * Math.cos(theta),
        sphereRadius * Math.cos(phi),
        sphereRadius * Math.sin(phi) * Math.sin(theta)
      );

      const colorData = getCategoryColor(skill.category);

      // Node Sphere
      const sphereGeo = new THREE.SphereGeometry(7, 20, 20);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: colorData.main,
        emissive: colorData.main,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });
      const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeMesh.position.copy(pos);

      // Outer Halo Ring
      const haloGeo = new THREE.RingGeometry(8.5, 10.5, 20);
      const haloMat = new THREE.MeshBasicMaterial({
        color: colorData.main,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.copy(pos);

      // Text Sprite Label
      const sprite = createTextSprite(skill, colorData.hex, colorData.light);
      sprite.position.set(pos.x, pos.y + 13, pos.z);

      mainGroup.add(nodeMesh);
      mainGroup.add(haloMesh);
      mainGroup.add(sprite);

      nodes.push({
        skill,
        position: pos,
        colorHex: colorData.hex,
        colorNum: colorData.main,
        lightHex: colorData.light,
        mesh: nodeMesh,
        haloMesh,
        sprite,
        currentScale: 1,
        targetScale: 1,
        currentOpacity: 1,
        targetOpacity: 1,
      });
    });

    nodesListRef.current = nodes;

    // 6. Constellation Connecting Lines
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i]!;
        const n2 = nodes[j]!;
        const isSameCat = n1.skill.category === n2.skill.category;
        const dist = n1.position.distanceTo(n2.position);

        if ((isSameCat && dist < sphereRadius * 1.5) || dist < sphereRadius * 0.7) {
          linePositions.push(n1.position.x, n1.position.y, n1.position.z);
          linePositions.push(n2.position.x, n2.position.y, n2.position.z);

          const c1 = new THREE.Color(n1.colorNum);
          const c2 = new THREE.Color(n2.colorNum);

          lineColors.push(c1.r, c1.g, c1.b);
          lineColors.push(c2.r, c2.g, c2.b);
        }
      }
    }

    if (linePositions.length > 0) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const constellationLines = new THREE.LineSegments(lineGeo, lineMat);
      mainGroup.add(constellationLines);
    }

    // 7. Interactive Controls & Mouse / Touch Dragging
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotVelX = 0;
    let rotVelY = 0.003;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let hoveredMeshTarget: THREE.Mesh | null = null;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      isAutoRotatingRef.current = false;
      setIsAutoRotating(false);
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0]!.clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        rotVelY = deltaX * 0.005;
        rotVelX = deltaY * 0.005;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const meshes = nodesListRef.current.map((n) => n.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hit = intersects[0]!.object as THREE.Mesh;
        const targetNode = nodesListRef.current.find((n) => n.mesh === hit);
        if (targetNode) {
          setSelectedSkill(targetNode.skill);
          if (onSelectCategoryRef.current && targetNode.skill.category) {
            onSelectCategoryRef.current(targetNode.skill.category);
          }
        }
      }
    };

    canvas.addEventListener("mousedown", onPointerDown);
    canvas.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    canvas.addEventListener("click", onClick);

    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    canvas.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // 8. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = Math.max(container.clientWidth || 600, 300);
      const newHeight = Math.max(container.clientHeight || 520, 350);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Trigger initial resize sync
    setTimeout(handleResize, 50);

    // 9. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Physics Damping
      if (!isDragging) {
        rotVelX *= 0.94;
        rotVelY *= 0.94;
        if (Math.abs(rotVelY) < 0.0015 && isAutoRotatingRef.current) {
          rotVelY = 0.003;
        }
      }

      mainGroup.rotation.y += rotVelY;
      mainGroup.rotation.x += rotVelX;

      starField.rotation.y = time * 0.012;
      coreMesh.rotation.y = time * 0.2;
      coreMesh.rotation.x = time * 0.12;
      innerCoreMesh.scale.setScalar(1 + Math.sin(time * 2.5) * 0.1);

      // Raycasting
      raycaster.setFromCamera(mouse, camera);
      const meshes = nodesListRef.current.map((n) => n.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        hoveredMeshTarget = intersects[0]!.object as THREE.Mesh;
        const targetNode = nodesListRef.current.find((n) => n.mesh === hoveredMeshTarget);
        setHoveredSkill(targetNode?.skill || null);
        canvas.style.cursor = "pointer";
      } else {
        hoveredMeshTarget = null;
        setHoveredSkill(null);
        canvas.style.cursor = isDragging ? "grabbing" : "grab";
      }

      // Update Nodes Scale & Filtering
      const currentCat = activeCategoryRef.current;
      nodesListRef.current.forEach((n) => {
        const isHovered = n.mesh === hoveredMeshTarget;
        const isMatch =
          currentCat === "All" ||
          (n.skill.category || "").toLowerCase() === currentCat.toLowerCase();

        n.targetScale = isHovered ? 1.5 : isMatch ? 1.0 : 0.6;
        n.targetOpacity = isMatch ? 1.0 : 0.25;

        n.currentScale += (n.targetScale - n.currentScale) * 0.12;
        n.currentOpacity += (n.targetOpacity - n.currentOpacity) * 0.12;

        n.mesh.scale.setScalar(n.currentScale);
        n.haloMesh.scale.setScalar(
          n.currentScale * (1 + Math.sin(time * 3 + n.position.x) * 0.12)
        );
        n.haloMesh.lookAt(camera.position);

        const mat = n.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = isHovered ? 1.4 : isMatch ? 0.7 : 0.15;
        mat.opacity = n.currentOpacity;
        mat.transparent = true;

        (n.haloMesh.material as THREE.MeshBasicMaterial).opacity = n.currentOpacity * 0.5;
        (n.sprite.material as THREE.SpriteMaterial).opacity = n.currentOpacity;
        n.sprite.scale.set(44 * n.currentScale, 16 * n.currentScale, 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean-up
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      canvas.removeEventListener("mousedown", onPointerDown);
      canvas.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      canvas.removeEventListener("click", onClick);

      canvas.removeEventListener("touchstart", onPointerDown);
      canvas.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);

      scene.clear();
      renderer.dispose();
    };
  }, []);

  const activeDisplaySkill = hoveredSkill || selectedSkill;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-border-subtle bg-radial from-[#0d1527] via-[#050711] to-[#020408] shadow-2xl flex items-center justify-center select-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block focus:outline-none"
        tabIndex={0}
      />

      {/* Top Floating Helper Controls */}
      <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-6 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md text-[11px] font-mono text-cyan-300 shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Interactive 3D Constellation</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleAutoRotate}
            title={isAutoRotating ? "Pause auto-rotation" : "Resume auto-rotation"}
            className="p-2 rounded-xl bg-slate-900/80 border border-border-subtle hover:border-cyan-500/50 text-muted hover:text-white text-xs backdrop-blur-md transition-all shadow-md active:scale-95"
          >
            {isAutoRotating ? "⏸️ Pause" : "▶️ Spin"}
          </button>
          <button
            onClick={handleResetCamera}
            title="Reset perspective"
            className="p-2 rounded-xl bg-slate-900/80 border border-border-subtle hover:border-cyan-500/50 text-muted hover:text-white text-xs backdrop-blur-md transition-all shadow-md active:scale-95"
          >
            🎯 Reset View
          </button>
        </div>
      </div>

      {/* Bottom Interactive HUD / Skill Detail Card */}
      {activeDisplaySkill ? (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-80 p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl z-20 pointer-events-auto transition-all animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              {activeDisplaySkill.category || "Skill Node"}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>

          <div className="flex items-center gap-3 my-2">
            {activeDisplaySkill.icon ? (
              <img
                src={activeDisplaySkill.icon}
                alt={activeDisplaySkill.name}
                className="w-10 h-10 rounded-xl object-contain bg-slate-900 p-1.5 border border-cyan-500/30 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-mono font-bold text-sm shadow-sm">
                {activeDisplaySkill.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-base font-bold text-white tracking-tight">
                {activeDisplaySkill.name}
              </h4>
              <p className="text-xs text-muted">Core Technology Stack</p>
            </div>
          </div>

          {typeof activeDisplaySkill.proficiency === "number" && (
            <div className="mt-3 pt-2.5 border-t border-border-subtle">
              <div className="flex justify-between text-xs font-mono text-muted mb-1.5">
                <span>Proficiency Level</span>
                <span className="text-cyan-300 font-semibold">
                  {activeDisplaySkill.proficiency}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, activeDisplaySkill.proficiency)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-950/70 border border-border-subtle backdrop-blur-md text-xs font-mono text-muted pointer-events-none z-20 shadow-lg whitespace-nowrap">
          🖱️ Drag to rotate sphere • Hover / click any 3D node
        </div>
      )}
    </div>
  );
};
