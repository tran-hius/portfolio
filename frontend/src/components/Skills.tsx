import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { fetchSkills } from "../services/skill.service.js";
import { Reveal } from "./Reveal.js";
import type { Skill } from "../types/portfolio.js";

const SkillGalaxy3D = lazy(() =>
  import("./SkillGalaxy3D.js").then((m) => ({ default: m.SkillGalaxy3D }))
);

const DEFAULT_SKILLS: Record<string, Skill[]> = {
  Frontend: [
    { _id: "f1", name: "React", category: "Frontend", proficiency: 95 },
    { _id: "f2", name: "TypeScript", category: "Frontend", proficiency: 92 },
    { _id: "f3", name: "Next.js", category: "Frontend", proficiency: 88 },
    { _id: "f4", name: "Tailwind CSS", category: "Frontend", proficiency: 95 },
    { _id: "f5", name: "Three.js / WebGL", category: "Frontend", proficiency: 85 },
    { _id: "f6", name: "HTML5 & CSS3", category: "Frontend", proficiency: 96 },
    { _id: "f7", name: "Redux Toolkit", category: "Frontend", proficiency: 86 },
    { _id: "f8", name: "Vite", category: "Frontend", proficiency: 92 },
  ],
  Backend: [
    { _id: "b1", name: "Node.js", category: "Backend", proficiency: 92 },
    { _id: "b2", name: "Express.js", category: "Backend", proficiency: 94 },
    { _id: "b3", name: "NestJS", category: "Backend", proficiency: 82 },
    { _id: "b4", name: "RESTful API", category: "Backend", proficiency: 96 },
    { _id: "b5", name: "Socket.io Realtime", category: "Backend", proficiency: 88 },
    { _id: "b6", name: "JWT Security", category: "Backend", proficiency: 92 },
  ],
  Database: [
    { _id: "d1", name: "MongoDB", category: "Database", proficiency: 92 },
    { _id: "d2", name: "Mongoose ODM", category: "Database", proficiency: 90 },
    { _id: "d3", name: "PostgreSQL", category: "Database", proficiency: 82 },
    { _id: "d4", name: "Redis Caching", category: "Database", proficiency: 80 },
  ],
  "DevOps & Tools": [
    { _id: "o1", name: "Docker", category: "DevOps & Tools", proficiency: 85 },
    { _id: "o2", name: "Git & GitHub", category: "DevOps & Tools", proficiency: 94 },
    { _id: "o3", name: "CI / CD Pipeline", category: "DevOps & Tools", proficiency: 82 },
    { _id: "o4", name: "Vercel / Render", category: "DevOps & Tools", proficiency: 90 },
    { _id: "o5", name: "Cloudinary CDN", category: "DevOps & Tools", proficiency: 88 },
  ],
};

export const Skills = () => {
  const [skillsData, setSkillsData] = useState<Record<string, Skill[]>>(DEFAULT_SKILLS);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");

  useEffect(() => {
    fetchSkills()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSkillsData(data);
        }
      })
      .catch(() => {
        // Keep default skills if network/backend is loading
      });
  }, []);

  const categories = useMemo(() => {
    const keys = Object.keys(skillsData);
    return keys.length > 0 ? ["All", ...keys] : [];
  }, [skillsData]);

  const allSkills = useMemo(() => {
    return Object.values(skillsData).flat();
  }, [skillsData]);

  const displayedSkills = useMemo(() => {
    if (activeCategory === "All") {
      return allSkills;
    }
    return skillsData[activeCategory] || [];
  }, [activeCategory, allSkills, skillsData]);

  return (
    <section id="skills" className="py-24 relative border-t border-border-subtle overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-radial from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <Reveal direction="up" delayMs={50}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-semibold">
                02 // Technical Capabilities & Stack
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Tech Stack & Tooling
            </h2>
          </Reveal>

          {/* View Mode Switcher */}
          <Reveal direction="up" delayMs={80}>
            <div className="flex items-center gap-2 bg-surface-100/90 p-1.5 rounded-2xl border border-border-subtle backdrop-blur-md shadow-sm">
              <button
                onClick={() => setViewMode("3d")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === "3d"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                    : "text-muted hover:text-slate-900 dark:hover:text-white hover:bg-surface-200/50"
                }`}
              >
                <span>🌌</span>
                <span>3D Constellation</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm"
                    : "text-muted hover:text-slate-900 dark:hover:text-white hover:bg-surface-200/50"
                }`}
              >
                <span>🗂️</span>
                <span>Grid Matrix</span>
              </button>
            </div>
          </Reveal>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <Reveal direction="up" delayMs={100}>
            <div className="flex flex-wrap items-center gap-2 mb-8 bg-surface-100/80 p-1.5 rounded-2xl border border-border-subtle backdrop-blur-md w-fit max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                      : "text-muted hover:text-slate-900 dark:hover:text-white hover:bg-surface-200/50"
                  }`}
                >
                  {cat}
                  {cat === "All" ? ` (${allSkills.length})` : ` (${skillsData[cat]?.length || 0})`}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Main Content: 3D Galaxy View vs Grid Matrix View */}
        {viewMode === "3d" ? (
          <Reveal direction="up" delayMs={150}>
            <Suspense
              fallback={
                <div className="w-full h-[520px] sm:h-[620px] rounded-3xl border border-border-subtle bg-slate-950/60 backdrop-blur-xl flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                  <span className="text-xs font-mono text-cyan-400">
                    Initializing 3D Neural Constellation...
                  </span>
                </div>
              }
            >
              <SkillGalaxy3D
                skills={allSkills}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => setActiveCategory(cat)}
              />
            </Suspense>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {displayedSkills.map((skill, index) => (
              <Reveal key={skill._id || skill.name} direction="up" delayMs={(index % 12) * 40}>
                <div className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col justify-between group hover:border-cyan-500/50 h-full shadow-sm hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-muted uppercase tracking-wider group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {skill.category}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-cyan-500/60 group-hover:bg-cyan-400 group-hover:scale-125 transition-all shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    {skill.icon ? (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        loading="lazy"
                        decoding="async"
                        className="w-8 h-8 rounded-xl object-contain bg-surface-100 p-1 border border-border-subtle group-hover:scale-110 group-hover:border-cyan-500/40 transition-all"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-300 font-mono text-xs font-bold group-hover:border-cyan-500/40 group-hover:scale-110 transition-all">
                        {skill.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-200 transition-colors">
                      {skill.name}
                    </h3>
                  </div>

                  {typeof skill.proficiency === "number" ? (
                    <div className="mt-3 pt-2.5 border-t border-border-subtle">
                      <div className="flex justify-between text-[10px] font-mono text-muted mb-1">
                        <span>Proficiency</span>
                        <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-surface-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-muted">
                      <span>Status</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-medium">Active</span>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
