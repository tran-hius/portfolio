import { Hero3D } from "./Hero3D.js";

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background ambient radial glows */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Editorial Typography & Intro */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-muted tracking-wide">
              AVAILABLE FOR SELECTIVE PROJECTS & ROLES
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white leading-[1.05] mb-6">
            Architecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
              High-Velocity
            </span>{" "}
            <br />
            Digital Systems.
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed mb-8 font-light">
            I am <strong className="text-white font-medium">Tran Hieu</strong>, a
            Full-Stack Software Engineer building resilient distributed backends,
            realtime telemetry pipelines, and cinematic web interfaces with clean
            type-safe architectures.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <a
              href="#projects"
              className="px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-cyan-300 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] flex items-center gap-2"
            >
              <span>Explore Projects</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>

            <a
              href="#contact"
              className="px-6 py-3.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-white font-medium text-sm border border-border-subtle hover:border-white/20 transition-all flex items-center gap-2"
            >
              <span>Get in Touch</span>
            </a>
          </div>

          {/* Social & Verification Badges */}
          <div className="flex items-center gap-6 pt-6 border-t border-white/[0.06] w-full max-w-lg">
            <a
              href="https://github.com/tran-hius"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-mono text-muted hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>github.com/tran-hius</span>
            </a>

            <div className="h-3 w-[1px] bg-white/[0.1]" />

            <div className="flex items-center gap-2 text-xs font-mono text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Full-Stack & Distributed Systems</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive WebGL/Canvas Structure */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <Hero3D />
        </div>
      </div>
    </section>
  );
};
