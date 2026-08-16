import { Reveal } from "./Reveal.js";

export const About = () => {
  const stats = [
    { value: "3+", label: "Years Engineering", detail: "Specialized in Node.js & React ecosystem" },
    { value: "20+", label: "Production Modules", detail: "APIs, Realtime Streams, Auth & Microservices" },
    { value: "99.9%", label: "System Reliability", detail: "Robust error handling & anti-IDOR layers" },
    { value: "< 15ms", label: "Average API Latency", detail: "Optimized database queries & in-memory caching" },
  ];

  return (
    <section id="about" className="py-24 relative border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <Reveal direction="up" delayMs={50}>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-2 font-semibold">
                01 // Profile & Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Engineering with <br />
                <span className="text-muted font-normal">precision and intent.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-8 space-y-6 text-muted text-base sm:text-lg leading-relaxed font-light">
            <Reveal direction="up" delayMs={150}>
              <p>
                I specialize in designing and engineering scalable web platforms where{" "}
                <strong className="text-slate-900 dark:text-white font-medium">performance</strong>,{" "}
                <strong className="text-slate-900 dark:text-white font-medium">type safety</strong>, and{" "}
                <strong className="text-slate-900 dark:text-white font-medium">system design</strong> converge. My
                approach favors layered architectures with clear boundaries over monolithic clutter.
              </p>
            </Reveal>
            <Reveal direction="up" delayMs={250}>
              <p>
                From architecting low-latency Express backends with MongoDB indexing,
                Server-Sent Events (SSE) telemetry, and strict IDOR/ReDoS protection, to crafting
                immersive dark interfaces with React and Tailwind CSS — I build software that feels
                solid, responsive, and durable.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16">
          {stats.map((stat, i) => (
            <Reveal key={i} direction="up" delayMs={i * 100 + 100}>
              <div className="glass-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-full shadow-sm">
                <div>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight block mb-2">
                    {stat.value}
                  </span>
                  <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 block mb-1">
                    {stat.label}
                  </span>
                </div>
                <p className="text-xs font-mono text-muted mt-4 border-t border-border-subtle pt-4">
                  {stat.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
