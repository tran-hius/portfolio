import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard Overview", path: "/admin", icon: "📊" },
    { label: "Projects Management", path: "/admin/projects", icon: "🚀" },
    { label: "Skills & Tech Stack", path: "/admin/skills", icon: "⚡" },
    { label: "Work Experiences", path: "/admin/experiences", icon: "💼" },
    { label: "Education", path: "/admin/education", icon: "🎓" },
    { label: "Certifications", path: "/admin/certificates", icon: "📜" },
    { label: "Visitor Analytics", path: "/admin/visitors", icon: "🌐" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050507] text-[#f4f4f6] flex flex-col md:flex-row antialiased">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#09090e] border-r border-border-subtle flex flex-col justify-between p-4 sm:p-6 shrink-0">
        <div>
          {/* Logo */}
          <Link
            to="/admin"
            className="flex items-center gap-3 mb-8 no-underline"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
              TH
            </div>
            <div>
              <span className="text-sm font-bold text-white block">PORTFOLIO CMS</span>
              <span className="text-[10px] font-mono text-cyan-400">Admin Workspace</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/[0.08] text-cyan-300 border border-white/[0.08] shadow-sm"
                      : "text-muted hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="pt-6 border-t border-white/[0.06] mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-medium text-white block">
                {user?.name || "Admin"}
              </span>
              <span className="text-[10px] font-mono text-muted truncate max-w-[140px] block">
                {user?.email || "admin@portfolio.dev"}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {user?.role || "ADMIN"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              target="_blank"
              className="w-full text-center py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-muted hover:text-white text-xs font-mono border border-white/[0.06] transition-colors"
            >
              View Live Website ↗
            </Link>
            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono border border-rose-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#050507] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
