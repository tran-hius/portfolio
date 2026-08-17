import { useEffect } from "react";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  itemType?: string;
  description?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmDeleteModal = ({
  isOpen,
  title = "Xác Nhận Xóa Dữ Liệu",
  itemName,
  itemType = "mục này",
  description,
  isDeleting = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || isDeleting) return;
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050507]/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onCancel}
    >
      <div
        className="relative max-w-md w-full bg-[#0c0c13] border border-rose-500/25 shadow-[0_0_60px_rgba(244,63,94,0.18)] rounded-3xl p-6 sm:p-7 overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top ambient glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-5 relative">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)] shrink-0">
              <DeleteForeverRoundedIcon sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
                {title}
              </h3>
              <span className="text-[10px] font-mono text-rose-400/90 uppercase tracking-widest block font-semibold">
                Permanent Delete // Không thể hoàn tác
              </span>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-muted hover:text-white p-1.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            aria-label="Đóng"
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Item Preview Box */}
        <div className="space-y-3.5 mb-6 relative">
          {itemName && (
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                Đối tượng xóa ({itemType}):
              </span>
              <p className="text-xs sm:text-sm font-semibold text-rose-200 truncate font-mono">
                "{itemName}"
              </p>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-rose-500/[0.06] border border-rose-500/20 flex items-start gap-2.5">
            <WarningAmberRoundedIcon
              sx={{ fontSize: 18, color: "#f43f5e" }}
              className="shrink-0 mt-0.5"
            />
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {description ||
                `Bạn có chắc chắn muốn xóa vĩnh viễn ${itemType.toLowerCase()}? Thao tác này sẽ gỡ bỏ dữ liệu khỏi hệ thống MongoDB và website ngay lập tức.`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08] relative">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs font-mono border border-white/[0.08] transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-xs font-mono shadow-[0_0_25px_rgba(244,63,94,0.35)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <DeleteForeverRoundedIcon sx={{ fontSize: 16 }} />
            <span>{isDeleting ? "Đang Xóa..." : "Xác Nhận Xóa"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
