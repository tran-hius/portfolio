import { HeroVisual } from "./HeroVisual.js";

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-28 pb-16 overflow-hidden"
    >
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 dark:bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 dark:bg-indigo-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100/90 border border-border-subtle backdrop-blur-md mb-6 animate-[fadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono text-muted tracking-wide">
              AVAILABLE FOR SELECTIVE PROJECTS & ROLES
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6 animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]">
            Architecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-600 dark:from-white dark:via-cyan-100 dark:to-cyan-400">
              High-Velocity
            </span>{" "}
            <br />
            Digital Systems.
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed mb-8 font-light animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.35s_both]">
            I am <strong className="text-slate-900 dark:text-white font-semibold">Tran Hieu</strong>, a
            Full-Stack Software Engineer building resilient distributed backends,
            realtime telemetry pipelines, and cinematic web interfaces with clean
            type-safe architectures.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10 animate-[fadeInUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.5s_both]">
            <a
              href="#projects"
              className="group px-6 py-3.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black font-semibold text-sm hover:bg-cyan-600 dark:hover:bg-cyan-300 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Explore Projects</span>
              <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>

            <a
              href="#contact"
              className="px-6 py-3.5 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-800 dark:text-white font-medium text-sm border border-border-subtle transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Get in Touch</span>
            </a>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-border-subtle w-full max-w-lg animate-[fadeIn_0.8s_cubic-bezier(0.16,1,0.3,1)_0.65s_both]">
            <a
              href="https://github.com/tran-hius"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 text-xs font-mono text-muted hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>github.com/tran-hius</span>
            </a>

            <div className="h-3 w-[1px] bg-border-subtle" />

            <div className="flex items-center gap-2 text-xs font-mono text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>Full-Stack & Distributed Systems</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 w-full flex items-center justify-center relative animate-[fadeIn_1.2s_cubic-bezier(0.16,1,0.3,1)_0.4s_both]">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
};
