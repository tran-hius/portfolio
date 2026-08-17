import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useConfirm } from "../context/ConfirmContext.js";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

export const AdminLayout = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const confirm = useConfirm();

  // Profile Edit State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openLogoutConfirm = async () => {
    setIsDropdownOpen(false);
    const ok = await confirm({
      title: "Xác Nhận Đăng Xuất",
      itemType: "Phiên làm việc",
      itemName: user?.email || "Admin Session",
      message: "Bạn có chắc chắn muốn kết thúc phiên đăng nhập quản trị hiện tại?",
      confirmText: "Đăng Xuất",
      cancelText: "Ở Lại",
      variant: "warning",
      icon: "logout",
    });

    if (!ok) return;

    await logout();
    navigate("/admin/login", { replace: true });
  };

  const openProfileModal = () => {
    setIsDropdownOpen(false);
    setFirstName(user?.firstName || (user?.name ? user.name.split(" ")[0] : ""));
    setLastName(user?.lastName || (user?.name ? user.name.split(" ").slice(1).join(" ") : ""));
    setEmail(user?.email || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setProfileError(null);
    setProfileSuccess(null);
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (newPassword && newPassword !== confirmPassword) {
      setProfileError("New password and confirm password do not match");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setProfileError("New password must be at least 6 characters");
      return;
    }

    if (newPassword && !currentPassword) {
      setProfileError("Current password is required to set a new password");
      return;
    }

    setProfileSaving(true);

    try {
      await updateProfile({
        firstName,
        lastName,
        email,
        password: newPassword || undefined,
        currentPassword: currentPassword || undefined,
      });

      setProfileSuccess("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsProfileModalOpen(false);
        setProfileSuccess(null);
      }, 1200);
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const navItems = [
    { label: "Dashboard Overview", path: "/admin", icon: <DashboardRoundedIcon sx={{ fontSize: 18 }} /> },
    { label: "Projects Management", path: "/admin/projects", icon: <RocketLaunchRoundedIcon sx={{ fontSize: 18 }} /> },
    { label: "Skills & Tech Stack", path: "/admin/skills", icon: <BoltRoundedIcon sx={{ fontSize: 18 }} /> },
    { label: "Work Experiences", path: "/admin/experiences", icon: <WorkOutlineRoundedIcon sx={{ fontSize: 18 }} /> },
    { label: "Education", path: "/admin/education", icon: <SchoolRoundedIcon sx={{ fontSize: 18 }} /> },
    { label: "Certifications", path: "/admin/certificates", icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} /> },
    { label: "Visitor Analytics", path: "/admin/visitors", icon: <TravelExploreRoundedIcon sx={{ fontSize: 18 }} /> },
  ];

  const displayName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Master Admin");
  const displayEmail = user?.email || "admin@tranhieu.dev";
  const userInitials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TH";

  return (
    <div className="min-h-screen w-full bg-[#050507] text-[#f4f4f6] flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#09090e] border-r border-border-subtle flex flex-col justify-between p-4 sm:p-6 shrink-0">
        <div>
          <Link
            to="/admin"
            className="flex items-center gap-3 mb-8 no-underline"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              <AdminPanelSettingsRoundedIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight block">PORTFOLIO CMS</span>
              <span className="text-[10px] font-mono text-cyan-400">Master Control</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/[0.08] text-cyan-300 border border-white/[0.08] shadow-sm font-semibold"
                      : "text-muted hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <span className={isActive ? "text-cyan-400" : "text-muted"}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="pt-4 border-t border-white/[0.06] mt-6">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-muted hover:text-white text-xs font-mono border border-white/[0.06] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Live Website</span>
            <OpenInNewRoundedIcon sx={{ fontSize: 14 }} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area with Dynamic Header */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050507] overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 px-6 sm:px-10 border-b border-border-subtle bg-[#09090e]/80 backdrop-blur-md flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              ADMIN // {navItems.find((n) => n.path === location.pathname)?.label || "CONSOLE"}
            </span>
          </div>

          {/* User Profile Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-surface-100/90 hover:bg-surface-50 border border-white/[0.08] transition-all cursor-pointer group shadow-sm"
              aria-expanded={isDropdownOpen}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white font-mono text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                  {userInitials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#09090e]" />
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <span>{displayName}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                    ADMIN
                  </span>
                </div>
                <div className="text-[10px] font-mono text-muted truncate max-w-[130px]">
                  {displayEmail}
                </div>
              </div>

              <KeyboardArrowDownRoundedIcon
                sx={{ fontSize: 18 }}
                className={`text-muted transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180 text-white" : "group-hover:text-white"
                }`}
              />
            </button>

            {/* Dropdown Floating Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#09090e] border border-white/[0.12] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-white/[0.06] mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-white font-mono text-sm font-bold flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                      {userInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{displayName}</div>
                      <div className="text-[11px] font-mono text-muted truncate">{displayEmail}</div>
                      <div className="mt-1">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                          MASTER ADMINISTRATOR
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={openProfileModal}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <ManageAccountsRoundedIcon sx={{ fontSize: 17, color: "#38bdf8" }} />
                    <span className="font-medium">Edit Profile & Password</span>
                  </button>

                  <Link
                    to="/"
                    target="_blank"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <OpenInNewRoundedIcon sx={{ fontSize: 17, color: "#94a3b8" }} />
                    <span className="font-medium">View Public Portfolio</span>
                  </Link>
                </div>

                <div className="pt-1 mt-1 border-t border-white/[0.06]">
                  <button
                    onClick={openLogoutConfirm}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors cursor-pointer text-left font-medium"
                  >
                    <LogoutRoundedIcon sx={{ fontSize: 17, color: "#f43f5e" }} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Edit Profile & Password Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-white/[0.12] shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  <ManageAccountsRoundedIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-white">
                    Edit Admin Profile
                  </h2>
                  <span className="text-[11px] font-mono text-muted block">
                    Manage Master Credentials & Name
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-muted hover:text-white p-1 rounded-lg hover:bg-white/[0.05] cursor-pointer"
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {profileError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-center gap-2">
                <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: "#f43f5e" }} />
                <span>{profileError}</span>
              </div>
            )}

            {profileSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, color: "#10b981" }} />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted mb-1.5 flex items-center gap-1.5">
                    <PersonOutlineRoundedIcon sx={{ fontSize: 14 }} />
                    <span>First Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Tran"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1.5 flex items-center gap-1.5">
                    <PersonOutlineRoundedIcon sx={{ fontSize: 14 }} />
                    <span>Last Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Hieu"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1.5 flex items-center gap-1.5">
                  <EmailOutlinedIcon sx={{ fontSize: 14 }} />
                  <span>Admin Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tranhieu.dev"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-white/[0.08] space-y-4">
                <div className="flex items-center gap-1.5">
                  <LockOutlinedIcon sx={{ fontSize: 16, color: "#38bdf8" }} />
                  <span className="text-white font-semibold">Change Master Password</span>
                  <span className="text-[10px] text-muted">(Leave blank to keep unchanged)</span>
                </div>

                <div>
                  <label className="block text-muted mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-muted mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {profileSaving ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
