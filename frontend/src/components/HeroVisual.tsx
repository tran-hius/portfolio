import React, { useState } from "react";

export const HeroVisual: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "stats">("code");

  const handleCopy = () => {
    const codeSnippet = `const engineer = {
  name: "Tran Hieu",
  role: "Full-Stack Software Engineer",
  focus: ["Distributed Backends", "Realtime Web"],
  stack: ["TypeScript", "Node.js", "React", "MongoDB", "Docker"],
  status: "Available for selective roles"
};`;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none">
      {/* Ambient background soft glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/10 via-sky-500/5 to-indigo-500/10 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

      {/* Main Compact Terminal Glass Card */}
      <div className="relative rounded-2xl border border-white/[0.1] bg-slate-950/85 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-slate-900/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:opacity-100 transition-opacity" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:opacity-100 transition-opacity" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex items-center gap-1 bg-surface-100/60 px-2.5 py-1 rounded-lg border border-white/[0.06]">
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">TS</span>
            <span className="text-[11px] font-mono text-muted">tran-hieu.config.ts</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-[10px] font-mono text-muted hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-white/[0.05]"
              title="Copy snippet"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-4 pt-2.5 gap-4 border-b border-white/[0.04] text-[11px] font-mono">
          <button
            onClick={() => setActiveTab("code")}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === "code"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            // source.ts
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === "stats"
                ? "border-cyan-400 text-cyan-300 font-semibold"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            // telemetry.sys
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 font-mono text-xs leading-relaxed overflow-x-auto">
          {activeTab === "code" ? (
            <div className="space-y-1">
              <div className="flex gap-3 text-muted/60 select-none">
                <span className="w-4 text-right">01</span>
                <span>
                  <span className="text-cyan-400 font-semibold">export const</span>{" "}
                  <span className="text-white">engineer</span> = &#123;
                </span>
              </div>

              <div className="flex gap-3 text-muted/60 select-none">
                <span className="w-4 text-right">02</span>
                <span className="pl-3">
                  <span className="text-indigo-300">name</span>:{" "}
                  <span className="text-emerald-300">"Tran Hieu"</span>,
                </span>
              </div>

              <div className="flex gap-3 text-muted/60 select-none">
                <span className="w-4 text-right">03</span>
                <span className="pl-3">
                  <span className="text-indigo-300">role</span>:{" "}
                  <span className="text-emerald-300">"Full-Stack Software Engineer"</span>,
                </span>
              </div>

              <div className="flex gap-3 text-muted/60 select-none">
                <span className="w-4 text-right">04</span>
                <span className="pl-3">
                  <span className="text-indigo-300">focus</span>: [
                  <span className="text-sky-300">"Distributed Backends"</span>,{" "}
                  <span className="text-sky-300">"Realtime Telemetry"</span>],
                </span>
              </div>

              <div className="flex gap-3 text-muted/60 select-none">
                <span className="w-4 text-right">05</span>
                <span className="pl-3">
                  <span className="text-indigo-300">coreStack</span>: [
                  <span className="text-cyan-300">"TypeScript"</span>,{" "}
                  <span className="text-emerald-300">"Node.js"</span>,{" "}
                  <span className="text-cyan-300">"React"</span>,{" "}
                  <span className="text-amber-300">"MongoDB"</span>],
                </span>
              </div>

              <div className="flex gap-3 text-muted/60 select-none">
                <span className="w-4 text-right">06</span>
                <span className="pl-3">
                  <span className="text-indigo-300">architecture</span>:{" "}
                  <span className="text-emerald-300">"Clean, Layered & Type-Safe"</span>,
                </span>
              </div>

              <div className="flex gap-3 text-muted/60 select-none">
                <span className="w-4 text-right">07</span>
                <span className="pl-3">
                  <span className="text-indigo-300">availability</span>:{" "}
                  <span className="text-emerald-400">"Selective Roles & Projects"</span>,
                </span>
              </div>

              <div className="flex gap-3 text-muted/60 select-none">
                <span className="w-4 text-right">08</span>
                <span>&#125;;</span>
              </div>

              <div className="flex gap-3 text-muted/60 select-none pt-2">
                <span className="w-4 text-right">09</span>
                <span className="text-muted/70 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>// Ready to architect next-gen systems</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-1">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-muted">Latency Target</span>
                <span className="text-emerald-400 font-semibold">&lt; 20ms Edge</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-muted">Security Standard</span>
                <span className="text-cyan-400 font-semibold">Strict CORS & Rate Limited</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-muted">Type Safety</span>
                <span className="text-sky-300 font-semibold">100% Strict TypeScript</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-muted">Code Quality</span>
                <span className="text-amber-300 font-semibold">Layered Architecture</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] bg-slate-900/40 text-[10px] font-mono text-muted">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>NODE_ENV: production</span>
          </div>
          <span className="text-cyan-400 font-semibold">UTF-8 • LF • TypeScript</span>
        </div>
      </div>

      {/* Floating Status Badges for high-tech aesthetic */}
      <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md text-[10px] font-mono text-cyan-300 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>v2.4.0 • Online</span>
      </div>

      <div className="absolute -bottom-3 -left-3 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md text-[10px] font-mono text-emerald-300 shadow-lg">
        <span>⚡ 99.9% Clean Code</span>
      </div>
    </div>
  );
};
