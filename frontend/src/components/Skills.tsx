import { useState, useEffect } from "react";
import { fetchSkills } from "../services/skill.service.js";
import { Reveal } from "./Reveal.js";
import type { Skill } from "../types/portfolio.js";

export const Skills = () => {
  const [skillsData, setSkillsData] = useState<Record<string, Skill[]>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    fetchSkills().then((data) => {
      setSkillsData(data || {});
    });
  }, []);

  const categories = Object.keys(skillsData).length > 0 ? ["All", ...Object.keys(skillsData)] : [];

  const displayedSkills =
    activeCategory === "All"
      ? Object.values(skillsData).flat()
      : skillsData[activeCategory] || [];

  return (
    <section id="skills" className="py-24 relative border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <Reveal direction="up" delayMs={50}>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
              02 // Technical Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Tech Stack & Tooling
            </h2>
          </Reveal>

          {categories.length > 0 && (
            <Reveal direction="up" delayMs={100}>
              <div className="flex flex-wrap items-center gap-2 bg-surface-100/90 p-1.5 rounded-xl border border-border-subtle backdrop-blur-md shadow-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeCategory === cat
                        ? "bg-slate-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                        : "text-muted hover:text-slate-900 dark:hover:text-white hover:bg-surface-200/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {displayedSkills.length === 0 ? (
          <Reveal direction="up" delayMs={100}>
            <div className="glass-card py-20 px-6 rounded-3xl text-center border border-dashed border-border-subtle flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-100/90 border border-border-subtle flex items-center justify-center mb-4 text-cyan-600 dark:text-cyan-400 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold text-slate-800 dark:text-slate-200">
                No Skills yet
              </h3>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {displayedSkills.map((skill, index) => (
              <Reveal key={skill._id || skill.name} direction="up" delayMs={(index % 12) * 50}>
                <div className="glass-card p-4 sm:p-5 rounded-xl flex flex-col justify-between group hover:border-cyan-500/50 h-full shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-muted uppercase tracking-wider group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {skill.category}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 group-hover:bg-cyan-500 group-hover:scale-125 transition-all" />
                  </div>

                  <div className="flex items-center gap-2.5 my-2">
                    {skill.icon ? (
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-7 h-7 rounded-lg object-contain bg-surface-100 p-1 border border-border-subtle group-hover:scale-110 group-hover:border-cyan-500/40 transition-all"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-300 font-mono text-[10px] font-bold group-hover:border-cyan-500/40 group-hover:scale-110 transition-all">
                        {skill.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-200 transition-colors">
                      {skill.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-muted">
                    <span>Production</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-medium">Active</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
