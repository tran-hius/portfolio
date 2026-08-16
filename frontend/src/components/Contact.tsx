import { Reveal } from "./Reveal.js";

export const Contact = () => {
  return (
    <section id="contact" className="py-28 relative border-t border-border-subtle overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10 text-center">
        <Reveal direction="up" delayMs={50}>
          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-4 font-semibold">
            05 // Collaboration & Hiring
          </span>


          <h2 className="text-4xl sm:text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Have an idea <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-600 dark:from-white dark:via-cyan-100 dark:to-cyan-400">
              worth building?
            </span>
          </h2>
        </Reveal>

        <Reveal direction="up" delayMs={150}>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed">
            I am always open to discussing technical architecture, distributed backend systems,
            high-impact software roles, or innovative new ventures.
          </p>
        </Reveal>

        <Reveal direction="up" delayMs={250}>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <a
              href="mailto:contact@tranhieu.dev"
              className="px-8 py-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black font-semibold text-sm hover:bg-cyan-600 dark:hover:bg-cyan-300 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-2.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>contact@tranhieu.dev</span>
            </a>

            <a
              href="https://github.com/tran-hius"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-800 dark:text-white font-medium text-sm border border-border-subtle transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center gap-2 shadow-sm"
            >
              <span>GitHub Profile</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
