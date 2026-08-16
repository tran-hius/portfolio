import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/admin", { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050507] text-[#f4f4f6] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden select-none">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-white transition-colors"
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 16 }} />
          <span>Back to Portfolio</span>
        </Link>
        <span className="text-[11px] font-mono text-cyan-400">
          SYSTEM CONSOLE // AUTH
        </span>
      </div>

      <div className="relative z-10 my-auto max-w-md mx-auto w-full">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/[0.1] shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-cyan-400/80 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <AdminPanelSettingsRoundedIcon sx={{ fontSize: 24 }} />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              Portfolio Control Center
            </h1>
            <p className="text-xs font-mono text-muted mt-1.5">
              Authenticate to manage live content & telemetry
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-center gap-2">
              <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: "#f43f5e" }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5 flex items-center gap-1.5">
                <EmailOutlinedIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tranhieu.dev"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100/90 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-1.5 flex items-center gap-1.5">
                <LockOutlinedIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                <span>Master Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-100/90 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LoginRoundedIcon sx={{ fontSize: 18 }} />
              <span>{loading ? "Authenticating..." : "Sign In to Console"}</span>
            </button>
          </form>
        </div>
      </div>

      <div className="relative z-10 text-center text-[10px] font-mono text-muted-foreground">
        SECURE ADMIN GATEWAY • JWT + REFRESH TOKEN ROTATION
      </div>
    </div>
  );
};
