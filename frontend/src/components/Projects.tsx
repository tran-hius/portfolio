import { useState, useEffect } from "react";
import { fetchProjects } from "../services/api.js";
import type { Project } from "../types/portfolio.js";

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
    });
  }, []);

  return (
    <section id="projects" className="py-24 relative border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
              03 // Featured Works
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
              Selected Projects & Systems
            </h2>
          </div>
          <p className="text-muted text-sm max-w-md font-light">
            A curated selection of distributed architectures, high-performance backends, and
            specialized developer utilities.
          </p>
        </div>

        {/* Projects List with Asymmetric Layout */}
        <div className="space-y-12">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={project._id}
                className={`glass-card p-8 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center hover:border-cyan-400/40 transition-all`}
              >
                {/* Visual / Abstract Representation */}
                <div
                  className={`lg:col-span-5 ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  } w-full h-[240px] sm:h-[280px] rounded-2xl bg-gradient-to-br from-surface-50 via-surface-100 to-black p-6 border border-white/[0.08] relative overflow-hidden flex flex-col justify-between group`}
                >
                  <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity" />

                  {/* Top Bar inside graphic */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                      {project.category || "Architecture"}
                    </span>
                    <span className="text-[11px] font-mono text-muted">
                      SYSTEM 0{index + 1}
                    </span>
                  </div>

                  {/* Center abstract system motif */}
                  <div className="relative z-10 my-auto text-center">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center mx-auto mb-3 text-cyan-300 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <span className="text-xs font-mono text-muted group-hover:text-white transition-colors">
                      Live Telemetry Ready
                    </span>
                  </div>

                  {/* Bottom bar */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-muted border-t border-white/[0.04] pt-2">
                    <span>STATUS: OPERATIONAL</span>
                    <span className="text-emerald-400">99.9% Uptime</span>
                  </div>
                </div>

                {/* Content Details */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  } flex flex-col justify-center`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-cyan-400">0{index + 1}</span>
                    <div className="h-[1px] w-8 bg-cyan-400/40" />
                    {project.isFeatured && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                        Featured System
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4 tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono text-muted bg-white/[0.03] px-3 py-1 rounded-md border border-white/[0.06]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center gap-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono font-medium text-white hover:text-cyan-300 transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>View Source</span>
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                      >
                        <span>Live Architecture</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
