import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export type ConfirmVariant = "danger" | "warning" | "info" | "primary";

export interface ConfirmOptions {
  title?: string;
  message?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  icon?: "delete" | "warning" | "info" | "logout";
}

export type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

interface ConfirmContextType {
  confirm: ConfirmFn;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = (): ConfirmFn => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context.confirm;
};

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm: ConfirmFn = useCallback((opts = {}) => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  }, []);

  // Keyboard shortcut: ESC to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        handleClose(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const variant: ConfirmVariant = options.variant || "danger";
  const title = options.title || (variant === "danger" ? "Xác Nhận Xóa Dữ Liệu" : "Xác Nhận Thao Tác");
  const cancelText = options.cancelText || "Hủy Bỏ";
  const confirmText =
    options.confirmText ||
    (variant === "danger" ? "Xác Nhận Xóa" : variant === "warning" ? "Đồng Ý" : "Tiếp Tục");
  const message =
    options.message ||
    options.description ||
    (variant === "danger"
      ? `Bạn có chắc chắn muốn thực hiện thao tác xóa ${options.itemType ? options.itemType.toLowerCase() : "mục này"}? Dữ liệu sẽ bị gỡ bỏ vĩnh viễn khỏi hệ thống.`
      : "Bạn có chắc chắn muốn tiếp tục thực hiện hành động này?");

  // Visual Theme Configs
  const themeConfig = {
    danger: {
      glow: "bg-rose-500/20",
      border: "border-rose-500/30",
      boxBg: "bg-rose-500/[0.07]",
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.25)]",
      badgeText: "text-rose-400 font-semibold",
      buttonBg:
        "bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.35)]",
      icon: <DeleteForeverRoundedIcon sx={{ fontSize: 24 }} />,
      btnIcon: <DeleteForeverRoundedIcon sx={{ fontSize: 16 }} />,
      tag: "Permanent Action // Không thể hoàn tác",
    },
    warning: {
      glow: "bg-amber-500/20",
      border: "border-amber-500/30",
      boxBg: "bg-amber-500/[0.07]",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
      badgeText: "text-amber-400 font-semibold",
      buttonBg:
        "bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white shadow-[0_0_25px_rgba(245,158,11,0.35)]",
      icon: options.icon === "logout" ? <LogoutRoundedIcon sx={{ fontSize: 24 }} /> : <WarningAmberRoundedIcon sx={{ fontSize: 24 }} />,
      btnIcon: options.icon === "logout" ? <LogoutRoundedIcon sx={{ fontSize: 16 }} /> : <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />,
      tag: "Attention Required // Cần chú ý",
    },
    info: {
      glow: "bg-cyan-500/20",
      border: "border-cyan-500/30",
      boxBg: "bg-cyan-500/[0.07]",
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]",
      badgeText: "text-cyan-400 font-semibold",
      buttonBg:
        "bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.35)]",
      icon: <InfoOutlinedIcon sx={{ fontSize: 24 }} />,
      btnIcon: <InfoOutlinedIcon sx={{ fontSize: 16 }} />,
      tag: "System Action // Thông báo",
    },
    primary: {
      glow: "bg-cyan-500/20",
      border: "border-cyan-500/30",
      boxBg: "bg-cyan-500/[0.07]",
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]",
      badgeText: "text-cyan-400 font-semibold",
      buttonBg:
        "bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.35)]",
      icon: <InfoOutlinedIcon sx={{ fontSize: 24 }} />,
      btnIcon: <InfoOutlinedIcon sx={{ fontSize: 16 }} />,
      tag: "System Action // Thông báo",
    },
  }[variant];

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Global Universal Confirm Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-[#050507]/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => handleClose(false)}
        >
          <div
            className={`relative max-w-md w-full bg-[#0c0c13] border ${themeConfig.border} shadow-[0_0_60px_rgba(0,0,0,0.8)] rounded-3xl p-6 sm:p-7 overflow-hidden text-left`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Lighting */}
            <div className={`absolute -top-20 -right-20 w-44 h-44 ${themeConfig.glow} rounded-full blur-3xl pointer-events-none`} />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5 relative">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${themeConfig.iconBg}`}
                >
                  {themeConfig.icon}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                    {title}
                  </h3>
                  <span className={`text-[10px] font-mono uppercase tracking-widest block ${themeConfig.badgeText}`}>
                    {themeConfig.tag}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleClose(false)}
                className="text-muted hover:text-white p-1.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Target Item Preview Box */}
            <div className="space-y-3.5 mb-6 relative">
              {options.itemName && (
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                    Đối tượng áp dụng {options.itemType ? `(${options.itemType})` : ""}:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-white truncate font-mono">
                    "{options.itemName}"
                  </p>
                </div>
              )}

              <div className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${themeConfig.boxBg} ${themeConfig.border}`}>
                <div className="shrink-0 mt-0.5">{themeConfig.btnIcon}</div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{message}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08] relative">
              <button
                type="button"
                onClick={() => handleClose(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs font-mono border border-white/[0.08] transition-colors cursor-pointer"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={() => handleClose(true)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${themeConfig.buttonBg}`}
              >
                {themeConfig.btnIcon}
                <span>{confirmText}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
