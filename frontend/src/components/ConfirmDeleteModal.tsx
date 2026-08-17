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
  title = "Confirm Deletion",
  itemName,
  itemType = "item",
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/[0.12] shadow-2xl my-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing Danger Ambient Gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08] relative">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.2)]">
              <DeleteForeverRoundedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">
                {title}
              </h3>
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">
                Permanent Action
              </span>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-muted hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 mb-6 relative">
          {itemName && (
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
                Target {itemType}:
              </span>
              <p className="text-sm font-semibold text-white truncate font-mono">
                "{itemName}"
              </p>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-rose-500/[0.05] border border-rose-500/20 flex items-start gap-3">
            <WarningAmberRoundedIcon
              sx={{ fontSize: 20, color: "#f43f5e" }}
              className="shrink-0 mt-0.5"
            />
            <p className="text-xs text-rose-200/90 leading-relaxed font-sans">
              {description ||
                `Are you sure you want to permanently delete this ${itemType.toLowerCase()}? This action cannot be undone and will immediately remove the data from your database and live website.`}
            </p>
          </div>
        </div>

        {/* Modal Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08] relative">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs font-mono border border-white/[0.08] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-xs font-mono shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <DeleteForeverRoundedIcon sx={{ fontSize: 16 }} />
            <span>{isDeleting ? "Deleting..." : "Yes, Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
