import { useState, useEffect, useMemo } from "react";
import { fetchSkills } from "../services/skill.service.js";
import { Reveal } from "./Reveal.js";
import { getTechBrandColor } from "../utils/brandColors.js";
import type { Skill } from "../types/portfolio.js";

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

  useEffect(() => {
    fetchSkills()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSkillsData(data);
        }
      })
      .catch(() => {
        // Keep default skills if loading/fallback
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
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial from-cyan-500/8 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
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

          {categories.length > 0 && (
            <Reveal direction="up" delayMs={100}>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-surface-100/90 p-1.5 rounded-2xl border border-border-subtle backdrop-blur-md shadow-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-slate-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                        : "text-muted hover:text-slate-900 dark:hover:text-white hover:bg-surface-200/50"
                    }`}
                  >
                    {cat}
                    <span className="opacity-60 text-[10px] ml-1">
                      {cat === "All" ? allSkills.length : skillsData[cat]?.length || 0}
                    </span>
                  </button>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {/* Skills Grid */}
        {displayedSkills.length === 0 ? (
          <Reveal direction="up" delayMs={100}>
            <div className="glass-card py-20 px-6 rounded-3xl text-center border border-dashed border-border-subtle flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-100/90 border border-border-subtle flex items-center justify-center mb-4 text-cyan-600 dark:text-cyan-400 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold text-slate-800 dark:text-slate-200">
                No Skills Found
              </h3>
              <p className="text-xs text-muted mt-1">Check back later or select another category</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {displayedSkills.map((skill, index) => {
              const brandColor = skill.color || getTechBrandColor(skill.name, skill.category);

              return (
                <Reveal key={skill._id || skill.name} direction="up" delayMs={(index % 12) * 35}>
                  <div
                    className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col justify-between group h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.08)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${brandColor}60`;
                      e.currentTarget.style.boxShadow = `0 10px 25px -5px ${brandColor}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.boxShadow = "";
                    }}
                  >
                    {/* Top Row: Category Tag & Iconic Brand Color Dot */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {skill.category}
                      </span>
                      {/* Iconic Brand Dot Indicator */}
                      <span
                        className="w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-125 shadow-sm shrink-0"
                        style={{
                          backgroundColor: brandColor,
                          boxShadow: `0 0 10px ${brandColor}90`,
                        }}
                        title={`${skill.name} Brand Theme (${brandColor})`}
                      />
                    </div>

                    {/* Middle Row: Icon & Tech Name */}
                    <div className="flex items-center gap-3 my-1.5">
                      {skill.icon ? (
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          loading="lazy"
                          decoding="async"
                          className="w-8 h-8 rounded-xl object-contain bg-surface-100 p-1 border border-border-subtle group-hover:scale-110 transition-all duration-300 shrink-0"
                          style={{
                            borderColor: `${brandColor}30`,
                          }}
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold group-hover:scale-110 transition-all duration-300 shrink-0"
                          style={{
                            backgroundColor: `${brandColor}18`,
                            color: brandColor,
                            border: `1px solid ${brandColor}40`,
                          }}
                        >
                          {skill.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors leading-tight">
                        {skill.name}
                      </h3>
                    </div>

                    {/* Bottom Row: Proficiency Bar or Status */}
                    {typeof skill.proficiency === "number" && skill.proficiency > 0 ? (
                      <div className="mt-3 pt-2.5 border-t border-border-subtle">
                        <div className="flex justify-between text-[10px] font-mono text-muted mb-1">
                          <span>Proficiency</span>
                          <span
                            className="font-medium"
                            style={{ color: brandColor }}
                          >
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-surface-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, skill.proficiency)}%`,
                              backgroundColor: brandColor,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-muted">
                        <span>Production</span>
                        <span
                          className="font-medium"
                          style={{ color: brandColor }}
                        >
                          Active
                        </span>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
