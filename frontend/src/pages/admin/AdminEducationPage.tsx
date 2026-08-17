import { useState, useEffect } from "react";
import {
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../services/api.js";
import type { Education } from "../../types/portfolio.js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import GradeRoundedIcon from "@mui/icons-material/GradeRounded";
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

export const AdminEducationPage = () => {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
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
    setIsCurrent(false);
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
    setStartDate(formatDateForInput(edu.startDate));
    setEndDate(formatDateForInput(edu.endDate));
    setIsCurrent(!!edu.isCurrent);
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
      endDate: isCurrent ? null : endDate || null,
      isCurrent,
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

  const [deletingEdu, setDeletingEdu] = useState<Education | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deletingEdu?._id) return;
    setIsDeleting(true);
    try {
      await deleteEducation(deletingEdu._id);
      setDeletingEdu(null);
      loadData();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete education record");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
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
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
          <span>Add Education</span>
        </button>
      </div>

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
                      <div className="font-sans font-bold text-sm text-white mb-0.5 flex items-center gap-2">
                        <SchoolRoundedIcon sx={{ fontSize: 16, color: "#38bdf8" }} />
                        <span>{edu.degree}</span>
                      </div>
                      <div className="text-muted text-[11px]">{edu.institution}</div>
                    </td>
                    <td className="py-4 text-cyan-300">
                      <div>{edu.fieldOfStudy || "Computer Science"}</div>
                      {edu.grade && (
                        <div className="text-amber-300 text-[10px] inline-flex items-center gap-0.5 mt-0.5">
                          <GradeRoundedIcon sx={{ fontSize: 11 }} />
                          <span>Grade: {edu.grade}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-muted">
                      <div className="inline-flex items-center gap-1.5">
                        <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: "#64748b" }} />
                        <span>{formatDateDisplay(edu.startDate)} — {edu.isCurrent ? "Present" : (edu.endDate ? formatDateDisplay(edu.endDate) : "Present")}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(edu)}
                        className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <EditRoundedIcon sx={{ fontSize: 14 }} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingEdu(edu)}
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
                    No academic records found. Click "+ Add Education" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-white/[0.1] shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <SchoolRoundedIcon sx={{ fontSize: 20, color: "#38bdf8" }} />
                <span>{editingEdu ? "Edit Education Record" : "Add Education Record"}</span>
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
              <div>
                <label className="block text-muted mb-1">Institution / University *</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Hanoi University of Science & Technology"
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
                    placeholder="Bachelor of Engineering"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="Computer Science / Software Eng"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                <div>
                  <label className="block text-muted mb-1">Grade / GPA</label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="3.6 / 4.0"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="currentEduCheckbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded bg-surface-100 border-white/[0.1] text-cyan-400 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="currentEduCheckbox" className="text-white cursor-pointer select-none">
                  Currently studying here (Present)
                </label>
              </div>

              <div>
                <label className="block text-muted mb-1">Notes / Achievements</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Graduated with High Distinction..."
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
                  {editingEdu ? "Update Record" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingEdu)}
        title="Xác Nhận Xóa Học Vấn"
        itemName={deletingEdu ? `${deletingEdu.degree} - ${deletingEdu.institution}` : undefined}
        itemType="Học vấn"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingEdu(null)}
      />
    </div>
  );
};
