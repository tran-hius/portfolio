import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
      if (isRegisterMode) {
        await register(email, password, name || "Admin");
      } else {
        await login(email, password);
      }
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050507] text-[#f4f4f6] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-white transition-colors"
        >
          <span>← Back to Portfolio</span>
        </Link>
        <span className="text-[11px] font-mono text-cyan-400">
          SYSTEM CONSOLE // AUTH
        </span>
      </div>

      {/* Center Auth Box */}
      <div className="relative z-10 my-auto max-w-md mx-auto w-full">
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/[0.1] shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-cyan-400/80 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4 text-cyan-200 font-mono text-sm font-bold shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              TH
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              {isRegisterMode ? "Create Admin Master Account" : "Portfolio Control Center"}
            </h1>
            <p className="text-xs font-mono text-muted mt-1.5">
              {isRegisterMode
                ? "Initialize the root administrator credentials"
                : "Authenticate to manage live content & telemetry"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-mono text-muted mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tran Hieu"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-100/90 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">
                Admin Email
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
              <label className="block text-xs font-mono text-muted mb-1.5">
                Master Password
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
              className="w-full mt-2 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : isRegisterMode ? "Create Account & Sign In" : "Sign In to Console"}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="text-xs font-mono text-muted hover:text-cyan-300 transition-colors"
            >
              {isRegisterMode
                ? "Already configured? Sign in instead →"
                : "First time setup? Register root admin account →"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 text-center text-[10px] font-mono text-muted-foreground">
        SECURE ADMIN GATEWAY • JWT + REFRESH TOKEN AUTHENTICATION
      </div>
    </div>
  );
};
