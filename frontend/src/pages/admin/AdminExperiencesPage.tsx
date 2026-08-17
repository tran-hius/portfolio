import { useState, useEffect } from "react";
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../services/api.js";
import type { Experience } from "../../types/portfolio.js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal.js";

const formatDateForInput = (val?: string | Date | null): string => {
  if (!val) return "";
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (/^\d{4}-\d{2}$/.test(str)) return `${str}-01`;
  return "";
};

const formatDateDisplay = (val?: string | Date | null): string => {
  if (!val) return "";
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return String(val);
};

export const AdminExperiencesPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [techStr, setTechStr] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchExperiences();
    setExperiences(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    setCompany("");
    setPosition("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setDescription("");
    setTechStr("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setCompany(exp.company);
    setPosition(exp.position);
    setLocation(exp.location || "");
    setStartDate(formatDateForInput(exp.startDate));
    setEndDate(formatDateForInput(exp.endDate));
    setIsCurrent(!!exp.isCurrent);
    setDescription(exp.description || "");
    setTechStr(exp.technologies ? exp.technologies.join(", ") : "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const techArray = techStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<Experience> = {
      company,
      position,
      location: location || undefined,
      startDate,
      endDate: isCurrent ? null : endDate || null,
      isCurrent,
      description,
      technologies: techArray,
    };

    try {
      if (editingExp?._id) {
        await updateExperience(editingExp._id, payload);
      } else {
        await createExperience(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to save experience entry");
    }
  };

  const [deletingExp, setDeletingExp] = useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deletingExp?._id) return;
    setIsDeleting(true);
    try {
      await deleteExperience(deletingExp._id);
      setDeletingExp(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete experience");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            CMS // Career Timeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Manage Work Experiences
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-muted">
                <th className="pb-3 font-medium">Role & Company</th>
                <th className="pb-3 font-medium">Period</th>
                <th className="pb-3 font-medium">Technologies</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">
                    Loading career timeline...
                  </td>
                </tr>
              ) : experiences.length > 0 ? (
                experiences.map((exp) => (
                  <tr key={exp._id} className="hover:bg-white/[0.02]">
                    <td className="py-4 text-white font-medium max-w-xs">
                      <div className="font-sans font-bold text-sm text-white mb-0.5 flex items-center gap-2">
                        <WorkOutlineRoundedIcon sx={{ fontSize: 16, color: "#38bdf8" }} />
                        <span>{exp.position}</span>
                      </div>
                      <div className="text-muted text-[11px] flex items-center gap-1.5 mt-0.5">
                        <span>{exp.company}</span>
                        {exp.location && (
                          <span className="inline-flex items-center gap-0.5 text-[10px]">
                            <LocationOnRoundedIcon sx={{ fontSize: 11, color: "#64748b" }} />
                            <span>{exp.location}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-cyan-300">
                      <div className="inline-flex items-center gap-1.5">
                        <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: "#38bdf8" }} />
                        <span>{formatDateDisplay(exp.startDate)} — {exp.isCurrent ? "Present" : formatDateDisplay(exp.endDate)}</span>
                      </div>
                    </td>
                    <td className="py-4 text-muted max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {exp.technologies?.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <EditRoundedIcon sx={{ fontSize: 14 }} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingExp(exp)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs border border-rose-500/20 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">
                    No experience entries found. Click "+ Add Experience" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-white/[0.1] shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <WorkOutlineRoundedIcon sx={{ fontSize: 20, color: "#38bdf8" }} />
                <span>{editingExp ? "Edit Experience Entry" : "Add Work Experience"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-white p-1 rounded-lg hover:bg-white/[0.05] cursor-pointer"
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, FPT Software"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1">Role / Position *</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-muted mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Hanoi, Vietnam"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 [color-scheme:dark] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1">End Date</label>
                  <input
                    type="date"
                    disabled={isCurrent}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 disabled:opacity-40 [color-scheme:dark] cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="currentRoleCheckbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded bg-surface-100 border-white/[0.1] text-cyan-400 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="currentRoleCheckbox" className="text-white cursor-pointer select-none">
                  Currently working here (Present)
                </label>
              </div>

              <div>
                <label className="block text-muted mb-1">Technologies (Comma-separated)</label>
                <input
                  type="text"
                  value={techStr}
                  onChange={(e) => setTechStr(e.target.value)}
                  placeholder="Node.js, TypeScript, Kafka, Docker"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-muted mb-1">Description / Key Achievements</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architected distributed microservices handling..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-colors cursor-pointer"
                >
                  {editingExp ? "Update Entry" : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingExp)}
        title="Delete Experience Entry"
        itemName={deletingExp ? `${deletingExp.position} at ${deletingExp.company}` : undefined}
        itemType="Experience"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingExp(null)}
      />
    </div>
  );
};
