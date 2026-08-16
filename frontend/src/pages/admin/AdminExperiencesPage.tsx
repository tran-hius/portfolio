import { useState, useEffect } from "react";
import {
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../../services/api.js";
import type { Experience } from "../../types/portfolio.js";

export const AdminExperiencesPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  // Form states
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
    setStartDate(String(exp.startDate));
    setEndDate(exp.endDate ? String(exp.endDate) : "");
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

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this experience entry?")) return;
    try {
      await deleteExperience(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete experience");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
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
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <span>+ Add Experience</span>
        </button>
      </div>

      {/* Experience Table */}
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
                      <div className="font-sans font-bold text-sm text-white mb-0.5">{exp.position}</div>
                      <div className="text-muted text-[11px]">{exp.company} {exp.location && `• ${exp.location}`}</div>
                    </td>
                    <td className="py-4 text-cyan-300">
                      {String(exp.startDate)} — {exp.isCurrent ? "Present" : String(exp.endDate)}
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
                        className="px-3 py-1 rounded-lg bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs border border-rose-500/20"
                      >
                        Delete
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-white/[0.1] shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-display font-bold text-white">
                {editingExp ? "Edit Experience Entry" : "Add Work Experience"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-white text-sm"
              >
                ✕
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
                    placeholder="e.g. High-Performance Software Labs"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1">Position / Role *</label>
                  <input
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-muted mb-1">Start Date *</label>
                  <input
                    type="text"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. 2023"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={isCurrent}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 disabled:opacity-40"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Vietnam / Remote"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currentCheckbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded bg-surface-100 border-white/[0.1] text-cyan-400 focus:ring-0"
                />
                <label htmlFor="currentCheckbox" className="text-white cursor-pointer select-none">
                  Currently working here (Present)
                </label>
              </div>

              <div>
                <label className="block text-muted mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Responsibilities, architectural achievements, metrics..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-muted mb-1">Technologies Used (Comma-separated)</label>
                <input
                  type="text"
                  value={techStr}
                  onChange={(e) => setTechStr(e.target.value)}
                  placeholder="Node.js, TypeScript, React, MongoDB, Docker"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-colors"
                >
                  {editingExp ? "Update Entry" : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
