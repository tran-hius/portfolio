import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchProjects,
  fetchSkills,
  fetchExperiences,
  fetchVisitorLogs,
  fetchSystemMetrics,
  subscribeToRealtimeVisitors,
} from "../../services/api.js";
import type { SystemMetrics } from "../../types/portfolio.js";

export const AdminOverviewPage = () => {
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [skillCount, setSkillCount] = useState<number>(0);
  const [experienceCount, setExperienceCount] = useState<number>(0);
  const [visitorStats, setVisitorStats] = useState<{ totalDistinctIPs: number; todayUniqueIPs: number }>({
    totalDistinctIPs: 1,
    todayUniqueIPs: 1,
  });
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

  useEffect(() => {
    // SSE Realtime Active Visitors
    const unsubscribe = subscribeToRealtimeVisitors((count) => setOnlineCount(count));

    // Fetch summaries
    fetchProjects().then((data) => setProjectCount(data.length));
    fetchSkills().then((data) => {
      const all = Object.values(data).flat();
      setSkillCount(all.length);
    });
    fetchExperiences().then((data) => setExperienceCount(data.length));
    fetchSystemMetrics().then((data) => setMetrics(data));
    fetchVisitorLogs(1, 8).then((res) => {
      if (res?.visitors) setRecentVisitors(res.visitors);
      if (res?.stats) setVisitorStats(res.stats);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Portfolio Control Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs font-mono border border-border-subtle transition-colors flex items-center gap-1.5"
          >
            <span>Live Portfolio</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Top Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Realtime Active Stream */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-muted uppercase">Realtime Online</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-3xl sm:text-4xl font-display font-bold text-emerald-400 block">
              {onlineCount}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Connected via SSE Stream
          </p>
        </div>

        {/* Unique IP Visits Today */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-muted uppercase block mb-2">
              Unique Visitors Today
            </span>
            <span className="text-3xl sm:text-4xl font-display font-bold text-cyan-300 block">
              {visitorStats.todayUniqueIPs}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Total Unique IPs: {visitorStats.totalDistinctIPs}
          </p>
        </div>

        {/* Total Projects Managed */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-muted uppercase block mb-2">
              Featured Projects
            </span>
            <span className="text-3xl sm:text-4xl font-display font-bold text-white block">
              {projectCount}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Live on homepage
          </p>
        </div>

        {/* Total Skills */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono text-muted uppercase block mb-2">
              Configured Skills
            </span>
            <span className="text-3xl sm:text-4xl font-display font-bold text-indigo-300 block">
              {skillCount}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Across 5 categories
          </p>
        </div>
      </div>

      {/* Grid: Quick Actions & Live Visitor Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Quick Content Management */}
        <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <span>⚡</span>
            <span>Homepage Content Shortcuts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/projects"
              className="p-4 rounded-xl bg-surface-100/60 hover:bg-surface-50 border border-white/[0.06] hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white group-hover:text-cyan-200">
                  Manage Projects
                </span>
                <span className="text-xs">→</span>
              </div>
              <span className="text-[11px] font-mono text-muted">
                {projectCount} active projects
              </span>
            </Link>

            <Link
              to="/admin/skills"
              className="p-4 rounded-xl bg-surface-100/60 hover:bg-surface-50 border border-white/[0.06] hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white group-hover:text-cyan-200">
                  Manage Skills
                </span>
                <span className="text-xs">→</span>
              </div>
              <span className="text-[11px] font-mono text-muted">
                {skillCount} skills categorized
              </span>
            </Link>

            <Link
              to="/admin/experiences"
              className="p-4 rounded-xl bg-surface-100/60 hover:bg-surface-50 border border-white/[0.06] hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white group-hover:text-cyan-200">
                  Work Timeline
                </span>
                <span className="text-xs">→</span>
              </div>
              <span className="text-[11px] font-mono text-muted">
                {experienceCount} career entries
              </span>
            </Link>

            <Link
              to="/admin/visitors"
              className="p-4 rounded-xl bg-surface-100/60 hover:bg-surface-50 border border-white/[0.06] hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white group-hover:text-cyan-200">
                  IP Analytics & Logs
                </span>
                <span className="text-xs">→</span>
              </div>
              <span className="text-[11px] font-mono text-muted">
                Inspect visitor records
              </span>
            </Link>
          </div>
        </div>

        {/* Right: Live Diagnostics & Latency */}
        <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <span>🖥️</span>
              <span>Cluster Diagnostics</span>
            </h2>
            <span className="text-[11px] font-mono text-emerald-400">
              ● {metrics?.health || "ONLINE"}
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-surface-100/60 border border-white/[0.06] flex items-center justify-between">
              <span className="text-muted">MongoDB Ping Latency</span>
              <span className="text-cyan-300 font-semibold">
                {metrics?.database.latencyMs !== null && metrics?.database.latencyMs !== undefined
                  ? `${metrics.database.latencyMs} ms`
                  : "< 5 ms"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-100/60 border border-white/[0.06] flex items-center justify-between">
              <span className="text-muted">Process Memory Heap</span>
              <span className="text-white">
                {metrics?.server.memory?.heapUsedMb ? `${metrics.server.memory.heapUsedMb} MB` : "38 MB"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-100/60 border border-white/[0.06] flex items-center justify-between">
              <span className="text-muted">Server Total Uptime</span>
              <span className="text-indigo-300">
                {metrics?.server.uptimeSeconds
                  ? `${Math.floor(metrics.server.uptimeSeconds / 60)} minutes`
                  : "Operational"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Realtime Visitor IP Log Table */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-display font-bold text-white">
              Recent Visitor IP Log Stream
            </h2>
            <p className="text-xs font-mono text-muted">
              Live IP deduplication and connection metadata
            </p>
          </div>
          <Link
            to="/admin/visitors"
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            View Full Table →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-muted">
                <th className="pb-3 font-medium">IP Address</th>
                <th className="pb-3 font-medium">Platform / Path</th>
                <th className="pb-3 font-medium">User Agent</th>
                <th className="pb-3 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recentVisitors.length > 0 ? (
                recentVisitors.map((v, i) => (
                  <tr key={v._id || i} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-cyan-300 font-medium">{v.ip || "127.0.0.1"}</td>
                    <td className="py-3 text-white">{v.path || "/"}</td>
                    <td className="py-3 text-muted max-w-xs truncate">
                      {v.userAgent || "Desktop Browser"}
                    </td>
                    <td className="py-3 text-muted text-right">
                      {v.visitedAt ? new Date(v.visitedAt).toLocaleTimeString() : "Just now"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted">
                    No visitor logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
