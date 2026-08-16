import { useState, useEffect } from "react";
import { fetchSkills } from "../services/api.js";
import { Reveal } from "./Reveal.js";
import type { Skill } from "../types/portfolio.js";

export const Skills = () => {
  const [skillsData, setSkillsData] = useState<Record<string, Skill[]>>({});
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    fetchSkills().then((data) => {
      setSkillsData(data);
    });
  }, []);

  const categories = ["All", ...Object.keys(skillsData)];

  const displayedSkills =
    activeCategory === "All"
      ? Object.values(skillsData).flat()
      : skillsData[activeCategory] || [];

  return (
    <section id="skills" className="py-24 relative border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <Reveal direction="up" delayMs={50}>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
              02 // Technical Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Tech Stack & Tooling
            </h2>
          </Reveal>

          {/* Category Filter Pills */}
          <Reveal direction="up" delayMs={100}>
            <div className="flex flex-wrap items-center gap-2 bg-surface-100/80 p-1.5 rounded-xl border border-white/[0.08] backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-muted hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayedSkills.map((skill, index) => (
            <Reveal key={skill._id || skill.name} direction="up" delayMs={(index % 12) * 50}>
              <div className="glass-card p-4 sm:p-5 rounded-xl flex flex-col justify-between group hover:border-cyan-400/40 h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider group-hover:text-cyan-300 transition-colors">
                    {skill.category}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 group-hover:bg-cyan-400 group-hover:scale-125 transition-all" />
                </div>

                <div className="flex items-center gap-2.5 my-2">
                  {skill.icon ? (
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-7 h-7 rounded-lg object-contain bg-white/[0.04] p-1 border border-white/[0.06] group-hover:scale-110 group-hover:border-cyan-400/40 transition-all"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 font-mono text-[10px] font-bold group-hover:border-cyan-400/40 group-hover:scale-110 transition-all">
                      {skill.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
                    {skill.name}
                  </h3>
                </div>

                {/* Interactive subtle indicator */}
                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>Production</span>
                  <span className="text-cyan-400/80">Active</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
