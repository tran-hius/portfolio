import { useState, useEffect } from "react";
import {
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../services/api.js";
import type { Education } from "../../types/portfolio.js";

export const AdminEducationPage = () => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  // Form states
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchEducation();
    setEducationList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingEdu(null);
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartDate("");
    setEndDate("");
    setGrade("");
    setDescription("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEdu(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setFieldOfStudy(edu.fieldOfStudy || "");
    setStartDate(String(edu.startDate));
    setEndDate(edu.endDate ? String(edu.endDate) : "");
    setGrade(edu.grade || "");
    setDescription(edu.description || "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: Partial<Education> = {
      institution,
      degree,
      fieldOfStudy: fieldOfStudy || undefined,
      startDate,
      endDate: endDate || null,
      grade: grade || undefined,
      description: description || undefined,
    };

    try {
      if (editingEdu?._id) {
        await updateEducation(editingEdu._id, payload);
      } else {
        await createEducation(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to save education record");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this education entry?")) return;
    try {
      await deleteEducation(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete education record");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            CMS // Education Qualifications
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Manage Academic Background
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <span>+ Add Education</span>
        </button>
      </div>

      {/* Education Table */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-muted">
                <th className="pb-3 font-medium">Institution & Degree</th>
                <th className="pb-3 font-medium">Field of Study</th>
                <th className="pb-3 font-medium">Period</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">
                    Loading academic records...
                  </td>
                </tr>
              ) : educationList.length > 0 ? (
                educationList.map((edu) => (
                  <tr key={edu._id} className="hover:bg-white/[0.02]">
                    <td className="py-4 text-white font-medium max-w-xs">
                      <div className="font-sans font-bold text-sm text-white mb-0.5">{edu.degree}</div>
                      <div className="text-muted text-[11px]">{edu.institution}</div>
                    </td>
                    <td className="py-4 text-cyan-300">{edu.fieldOfStudy || "Computer Science"}</td>
                    <td className="py-4 text-muted">
                      {String(edu.startDate)} — {edu.endDate ? String(edu.endDate) : "Present"}
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(edu)}
                        className="px-3 py-1 rounded-lg bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(edu._id)}
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
                    No academic records found. Click "+ Add Education" to create one.
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
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-white/[0.1] shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-display font-bold text-white">
                {editingEdu ? "Edit Education Record" : "Add Education Record"}
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
              <div>
                <label className="block text-muted mb-1">Institution *</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. University of Science and Technology"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted mb-1">Degree *</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="Bachelor of Science"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted mb-1">Start Year *</label>
                  <input
                    type="text"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="2019"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1">End Year</label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="2023"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1">Description / Honors</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specialized coursework, research thesis..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 font-sans"
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
                  {editingEdu ? "Update Record" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
