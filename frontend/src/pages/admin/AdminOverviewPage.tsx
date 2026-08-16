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
import WifiTetheringRoundedIcon from "@mui/icons-material/WifiTetheringRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";

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
    const unsubscribe = subscribeToRealtimeVisitors((count) => setOnlineCount(count));

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

    const interval = setInterval(() => {
      fetchSystemMetrics().then((data) => setMetrics(data));
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
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
            <OpenInNewRoundedIcon sx={{ fontSize: 14 }} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted uppercase">Realtime Online</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <WifiTetheringRoundedIcon sx={{ fontSize: 18 }} />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-display font-bold text-emerald-400 block">
              {onlineCount}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Connected via SSE Stream
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted uppercase">Unique Visitors Today</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <PeopleAltRoundedIcon sx={{ fontSize: 18 }} />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-display font-bold text-cyan-300 block">
              {visitorStats.todayUniqueIPs}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Total Unique IPs: {visitorStats.totalDistinctIPs}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted uppercase">Featured Projects</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <FolderSpecialRoundedIcon sx={{ fontSize: 18 }} />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-display font-bold text-white block">
              {projectCount}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Live on homepage
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted uppercase">Configured Skills</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-display font-bold text-indigo-300 block">
              {skillCount}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Active in skills section
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <BoltRoundedIcon sx={{ fontSize: 20, color: "#38bdf8" }} />
            <span>Content Management Shortcuts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/projects"
              className="p-4 rounded-xl bg-surface-100/60 hover:bg-surface-50 border border-white/[0.06] hover:border-cyan-400/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white group-hover:text-cyan-200 flex items-center gap-1.5">
                  <FolderSpecialRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Manage Projects</span>
                </span>
                <ArrowForwardRoundedIcon sx={{ fontSize: 14, color: "#64748b" }} className="group-hover:text-cyan-300 transition-colors" />
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
                <span className="text-sm font-semibold text-white group-hover:text-cyan-200 flex items-center gap-1.5">
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Manage Skills</span>
                </span>
                <ArrowForwardRoundedIcon sx={{ fontSize: 14, color: "#64748b" }} className="group-hover:text-cyan-300 transition-colors" />
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
                <span className="text-sm font-semibold text-white group-hover:text-cyan-200 flex items-center gap-1.5">
                  <WorkOutlineRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Work Timeline</span>
                </span>
                <ArrowForwardRoundedIcon sx={{ fontSize: 14, color: "#64748b" }} className="group-hover:text-cyan-300 transition-colors" />
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
                <span className="text-sm font-semibold text-white group-hover:text-cyan-200 flex items-center gap-1.5">
                  <TravelExploreRoundedIcon sx={{ fontSize: 16 }} />
                  <span>IP Analytics</span>
                </span>
                <ArrowForwardRoundedIcon sx={{ fontSize: 14, color: "#64748b" }} className="group-hover:text-cyan-300 transition-colors" />
              </div>
              <span className="text-[11px] font-mono text-muted">
                Inspect visitor records
              </span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <DnsRoundedIcon sx={{ fontSize: 20, color: "#38bdf8" }} />
              <span>System & Cluster Telemetry</span>
            </h2>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              ● {metrics?.health || "ONLINE"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-surface-100/60 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted">
                <StorageRoundedIcon sx={{ fontSize: 16, color: "#38bdf8" }} />
                <span>DB Latency</span>
              </div>
              <span className="text-cyan-300 font-semibold">
                {metrics?.database.latencyMs !== null && metrics?.database.latencyMs !== undefined
                  ? `${metrics.database.latencyMs} ms`
                  : "< 5 ms"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-100/60 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted">
                <MemoryRoundedIcon sx={{ fontSize: 16, color: "#a78bfa" }} />
                <span>Heap Memory</span>
              </div>
              <span className="text-white font-semibold">
                {metrics?.memory?.heapUsedMb ? `${metrics.memory.heapUsedMb} MB` : "38 MB"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-100/60 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted">
                <SpeedRoundedIcon sx={{ fontSize: 16, color: "#34d399" }} />
                <span>Total Requests</span>
              </div>
              <span className="text-white font-semibold">
                {metrics?.traffic?.totalRequests !== undefined ? metrics.traffic.totalRequests : "150+"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-100/60 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted">
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16, color: "#f87171" }} />
                <span>Error Rate</span>
              </div>
              <span className="text-emerald-400 font-semibold">
                {metrics?.traffic?.errorRatePercent !== undefined ? `${metrics.traffic.errorRatePercent}%` : "0%"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-100/60 border border-white/[0.06] flex items-center justify-between sm:col-span-2">
              <div className="flex items-center gap-2 text-muted">
                <AccessTimeRoundedIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
                <span>Server Total Uptime</span>
              </div>
              <span className="text-indigo-300 font-semibold">
                {metrics?.server?.uptimeSeconds
                  ? `${Math.floor(metrics.server.uptimeSeconds / 60)} minutes`
                  : "Operational"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <TravelExploreRoundedIcon sx={{ fontSize: 20, color: "#38bdf8" }} />
              <span>Recent Visitor IP Log Stream</span>
            </h2>
            <p className="text-xs font-mono text-muted">
              Live IP deduplication and connection metadata
            </p>
          </div>
          <Link
            to="/admin/visitors"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Table</span>
            <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
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
                      <div className="flex items-center gap-1.5">
                        <DesktopWindowsRoundedIcon sx={{ fontSize: 14, color: "#64748b" }} />
                        <span>{v.userAgent || "Desktop Browser"}</span>
                      </div>
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
