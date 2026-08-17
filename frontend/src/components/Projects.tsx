import { useState, useEffect } from "react";
import { fetchProjects } from "../services/project.service.js";
import { Reveal } from "./Reveal.js";
import type { Project } from "../types/portfolio.js";

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data || []);
    });
  }, []);

  return (
    <section id="projects" className="py-24 relative border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <Reveal direction="up" delayMs={50}>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
              03 // Featured Works
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Selected Projects & Systems
            </h2>
          </Reveal>
          <Reveal direction="up" delayMs={150}>
            <p className="text-muted text-sm max-w-md font-light">
              A curated selection of distributed architectures, high-performance backends, and
              specialized developer utilities.
            </p>
          </Reveal>
        </div>

        {projects.length === 0 ? (
          <Reveal direction="up" delayMs={100}>
            <div className="glass-card py-20 px-6 rounded-3xl text-center border border-dashed border-border-subtle flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-100/90 border border-border-subtle flex items-center justify-center mb-4 text-cyan-600 dark:text-cyan-400 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 13l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-semibold text-slate-800 dark:text-slate-200">
                No Projects yet
              </h3>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-12">
            {projects.map((project, index) => {
              const isEven = index % 2 === 0;

              return (
                <Reveal key={project._id} direction="up" delayMs={100}>
                  <div
                    data-cursor="project"
                    data-cursor-text="VIEW"
                    className="glass-card p-8 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center hover:border-cyan-500/40 transition-all shadow-sm"
                  >
                    <div
                      className={`lg:col-span-5 ${
                        isEven ? "lg:order-1" : "lg:order-2"
                      } w-full h-[240px] sm:h-[280px] rounded-2xl bg-surface-100 dark:bg-gradient-to-br dark:from-surface-50 dark:via-surface-100 dark:to-black p-6 border border-border-subtle relative overflow-hidden flex flex-col justify-between group shadow-sm`}
                    >
                      {project.imageUrl || project.thumbnail ? (
                        <div className="absolute inset-0 z-0">
                          <img
                            src={project.imageUrl || project.thumbnail || ""}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity" />
                      )}

                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-300 font-medium uppercase px-2.5 py-1 rounded-md bg-cyan-500/10 dark:bg-black/60 border border-cyan-500/20 backdrop-blur-md">
                          {project.category || "Architecture"}
                        </span>
                        <span className="text-[11px] font-mono text-muted dark:text-slate-300 backdrop-blur-sm px-2 py-0.5 rounded bg-black/40">
                          SYSTEM 0{index + 1}
                        </span>
                      </div>

                      {(!project.imageUrl && !project.thumbnail) && (
                        <div className="relative z-10 my-auto text-center">
                          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center mx-auto mb-3 text-cyan-600 dark:text-cyan-300 group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </div>
                          <span className="text-xs font-mono text-muted group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            Live Telemetry Ready
                          </span>
                        </div>
                      )}

                      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-muted dark:text-slate-300 border-t border-white/[0.1] pt-2 mt-auto backdrop-blur-sm">
                        <span>STATUS: OPERATIONAL</span>
                        <span className="text-emerald-500 dark:text-emerald-400 font-medium">99.9% Uptime</span>
                      </div>
                    </div>


                    <div
                      className={`lg:col-span-7 ${
                        isEven ? "lg:order-2" : "lg:order-1"
                      } flex flex-col justify-center`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">0{index + 1}</span>
                        <div className="h-[1px] w-8 bg-cyan-400/40" />
                        {project.isFeatured && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-300 font-medium px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                            Featured System
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                        {project.title}
                      </h3>

                      <p className="text-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-mono text-muted bg-surface-100 px-3 py-1 rounded-md border border-border-subtle"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-800 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                          >
                            <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
                            className="group inline-flex items-center gap-1.5 text-xs font-mono font-medium text-cyan-600 dark:text-cyan-300 hover:text-cyan-700 dark:hover:text-cyan-200 transition-colors"
                          >
                            <span>Live Architecture</span>
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
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
