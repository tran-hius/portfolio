import { useState, useEffect, useRef } from "react";
import {
  fetchVisitorLogs,
  subscribeAdminVisitorTelemetry,
} from "../../services/api.js";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WifiTetheringRoundedIcon from "@mui/icons-material/WifiTetheringRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import DesktopWindowsRoundedIcon from "@mui/icons-material/DesktopWindowsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export const AdminVisitorsPage = () => {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [stats, setStats] = useState<{ totalDistinctIPs: number; todayUniqueIPs: number }>({
    totalDistinctIPs: 1,
    todayUniqueIPs: 1,
  });
  const [newLogId, setNewLogId] = useState<string | null>(null);
  const newLogTimer = useRef<number | null>(null);

  const loadData = async (targetPage: number) => {
    setLoading(true);
    const data = await fetchVisitorLogs(targetPage, 15);
    if (data?.visitors) setVisitors(data.visitors);
    if (data?.pagination) {
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages || 1);
    }
    if (data?.stats) setStats(data.stats);
    setLoading(false);
  };

  useEffect(() => {
    loadData(page);

    const unsubscribe = subscribeAdminVisitorTelemetry({
      onOnlineCount: (count) => {
        setOnlineCount(count);
      },
      onNewLog: (newLog) => {
        const id = newLog._id || newLog.id || String(Date.now());
        setNewLogId(id);
        if (newLogTimer.current) clearTimeout(newLogTimer.current);
        newLogTimer.current = window.setTimeout(() => {
          setNewLogId(null);
        }, 3000);

        setVisitors((prev) => {
          const filtered = prev.filter((v) => (v._id || v.id) !== (newLog._id || newLog.id));
          return [newLog, ...filtered].slice(0, 15);
        });
      },
      onStatsUpdate: (updatedStats) => {
        setStats((prev) => ({
          totalDistinctIPs: updatedStats.totalUniqueVisitors ?? updatedStats.totalDistinctIPs ?? prev.totalDistinctIPs,
          todayUniqueIPs: updatedStats.uniqueVisitorsToday ?? updatedStats.todayUniqueIPs ?? prev.todayUniqueIPs,
        }));
        if (typeof updatedStats.activeVisitors === "number") {
          setOnlineCount(updatedStats.activeVisitors);
        }
      },
    });

    return () => {
      unsubscribe();
      if (newLogTimer.current) clearTimeout(newLogTimer.current);
    };
  }, [page]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              CMS // Realtime Observability
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Socket Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Visitor IP Intelligence & Telemetry
          </h1>
        </div>

        <button
          onClick={() => loadData(page)}
          className="px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs font-mono border border-border-subtle transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshRoundedIcon sx={{ fontSize: 16 }} className={loading ? "animate-spin" : ""} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-muted uppercase">Connected Live Now</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <WifiTetheringRoundedIcon sx={{ fontSize: 18 }} />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-display font-bold text-emerald-400 block">
              {onlineCount}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Active Socket & Realtime Connections
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-muted uppercase">Unique Visitors Today</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <PeopleAltRoundedIcon sx={{ fontSize: 18 }} />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-display font-bold text-cyan-300 block">
              {stats.todayUniqueIPs}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Deduplicated daily IP count
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-muted uppercase">Total Distinct IPs</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <TravelExploreRoundedIcon sx={{ fontSize: 18 }} />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-display font-bold text-indigo-300 block">
              {stats.totalDistinctIPs}
            </span>
          </div>
          <p className="text-xs font-mono text-muted mt-4 border-t border-white/[0.06] pt-3">
            Indexed in MongoDB
          </p>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-muted">
                <th className="pb-3 font-medium">IP Address</th>
                <th className="pb-3 font-medium">Request Path</th>
                <th className="pb-3 font-medium">User Agent Platform</th>
                <th className="pb-3 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">
                    Fetching IP telemetry records...
                  </td>
                </tr>
              ) : visitors.length > 0 ? (
                visitors.map((v, i) => {
                  const isNew = newLogId && (v._id || v.id) === newLogId;
                  return (
                    <tr
                      key={v._id || i}
                      className={`transition-colors duration-500 ${
                        isNew
                          ? "bg-emerald-500/15 border-l-4 border-emerald-400"
                          : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <td className="py-4 text-cyan-300 font-medium">
                        <div className="flex items-center gap-1.5">
                          <LanguageRoundedIcon sx={{ fontSize: 14, color: isNew ? "#34d399" : "#38bdf8" }} />
                          <span>{v.ip}</span>
                          {isNew && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 text-white">{v.path || "/"}</td>
                      <td className="py-4 text-muted max-w-sm truncate">
                        <div className="flex items-center gap-1.5">
                          <DesktopWindowsRoundedIcon sx={{ fontSize: 14, color: "#64748b" }} />
                          <span>{v.userAgent || "Unknown Browser"}</span>
                        </div>
                      </td>
                      <td className="py-4 text-muted text-right">
                        <div className="inline-flex items-center gap-1">
                          <AccessTimeRoundedIcon sx={{ fontSize: 12, color: "#64748b" }} />
                          <span>{v.visitedAt ? new Date(v.visitedAt).toLocaleString() : "Recent"}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">
                    No visitor logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.06] text-xs font-mono text-muted mt-4">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 text-white disabled:opacity-30 border border-white/[0.06] inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowBackIosNewRoundedIcon sx={{ fontSize: 10 }} />
                <span>Previous</span>
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 text-white disabled:opacity-30 border border-white/[0.06] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ArrowForwardIosRoundedIcon sx={{ fontSize: 10 }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
