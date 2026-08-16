import { useState, useEffect } from "react";
import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  uploadImage,
} from "../../services/api.js";
import type { Skill } from "../../types/portfolio.js";

export const AdminSkillsPage = () => {
  const [skillsData, setSkillsData] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [proficiency, setProficiency] = useState(90);
  const [icon, setIcon] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categories = ["Frontend", "Backend", "Database", "DevOps", "Tools"];

  const loadSkills = async () => {
    setLoading(true);
    const data = await fetchSkills();
    setSkillsData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setName("");
    setCategory("Frontend");
    setProficiency(90);
    setIcon("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency || 90);
    setIcon(skill.icon || "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleIconFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const res = await uploadImage(file);
      setIcon(res.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload skill icon to Cloudinary");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: Partial<Skill> = {
      name,
      category,
      proficiency: Number(proficiency),
      icon: icon || null,
    };

    try {
      if (editingSkill?._id) {
        await updateSkill(editingSkill._id, payload);
      } else {
        await createSkill(payload);
      }
      setIsModalOpen(false);
      loadSkills();
    } catch (err: any) {
      setError(err.message || "Failed to save skill");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteSkill(id);
      loadSkills();
    } catch (err: any) {
      alert(err.message || "Failed to delete skill");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            CMS // Skills & Icons
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Manage Technical Skills & Media Icons
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <span>+ Add New Skill</span>
        </button>
      </div>

      {/* Categorized Skills Grid */}
      <div className="space-y-8">
        {loading ? (
          <div className="glass-card p-12 text-center text-xs font-mono text-muted rounded-3xl">
            Loading skills matrix...
          </div>
        ) : (
          Object.entries(skillsData).map(([cat, skills]) => (
            <div key={cat} className="glass-card p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <h2 className="text-lg font-display font-bold text-white">{cat}</h2>
                </div>
                <span className="text-xs font-mono text-muted">{skills.length} skills</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {skills.map((s) => (
                  <div
                    key={s._id || s.name}
                    className="p-3.5 rounded-xl bg-surface-100/70 border border-white/[0.06] flex items-center justify-between group hover:border-cyan-400/40"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon / Image thumbnail */}
                      {s.icon ? (
                        <img
                          src={s.icon}
                          alt={s.name}
                          className="w-8 h-8 rounded-lg object-contain bg-white/[0.04] p-1 border border-white/[0.08]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <span className="text-sm font-semibold text-white block">{s.name}</span>
                        <span className="text-[10px] font-mono text-muted">
                          Proficiency: {s.proficiency || 90}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-md hover:bg-white/[0.08] text-muted hover:text-white text-xs"
                        title="Edit Skill"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="p-1.5 rounded-md hover:bg-rose-500/20 text-muted hover:text-rose-300 text-xs"
                        title="Delete Skill"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/[0.1] shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-display font-bold text-white">
                {editingSkill ? "Edit Skill & Icon" : "Add Technical Skill"}
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
                <label className="block text-muted mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Next.js, Redis, Docker"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-muted mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-[#09090e] text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cloudinary Icon / Image Upload */}
              <div>
                <label className="block text-muted mb-1">Skill Icon / Logo Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconFileUpload}
                    className="text-xs text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white/[0.08] file:text-white hover:file:bg-white/[0.15]"
                  />
                  {uploadingImage && <span className="text-cyan-400">Uploading...</span>}
                </div>

                {/* Direct URL input fallback */}
                <div className="mt-2">
                  <input
                    type="url"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Or paste image URL: https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-100/60 border border-white/[0.06] text-white text-[11px] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Preview */}
                {icon && (
                  <div className="mt-3 flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <img
                      src={icon}
                      alt="Icon preview"
                      className="w-8 h-8 rounded-lg object-contain bg-surface-100 p-1"
                    />
                    <span className="text-[10px] text-cyan-300 truncate">{icon}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-muted mb-1">Proficiency Level ({proficiency}%)</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className="w-full accent-cyan-400"
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
                  {editingSkill ? "Update Skill" : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
