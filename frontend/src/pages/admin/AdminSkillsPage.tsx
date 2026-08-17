import { useState, useEffect } from "react";
import {
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  uploadImage,
} from "../../services/api.js";
import { getTechBrandColor } from "../../utils/brandColors.js";
import type { Skill } from "../../types/portfolio.js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import { ConfirmDeleteModal } from "../../components/ConfirmDeleteModal.js";

const PRESET_COLORS = [
  { label: "React Blue", hex: "#61DAFB" },
  { label: "TS Blue", hex: "#3178C6" },
  { label: "JS Yellow", hex: "#F7DF1E" },
  { label: "Next.js", hex: "#0070F3" },
  { label: "Tailwind Cyan", hex: "#06B6D4" },
  { label: "Node Green", hex: "#5FA04E" },
  { label: "NestJS Red", hex: "#E0234E" },
  { label: "Python Blue", hex: "#3776AB" },
  { label: "MongoDB Green", hex: "#47A248" },
  { label: "Postgres Blue", hex: "#4169E1" },
  { label: "Redis Red", hex: "#DC382D" },
  { label: "Docker Blue", hex: "#2496ED" },
  { label: "Git Orange", hex: "#F05032" },
  { label: "AWS Orange", hex: "#FF9900" },
  { label: "Redux Purple", hex: "#764ABC" },
  { label: "Three.js Sky", hex: "#049EF4" },
];

export const AdminSkillsPage = () => {
  const [skillsData, setSkillsData] = useState<Record<string, Skill[]>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [proficiency, setProficiency] = useState(90);
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categories = ["Frontend", "Backend", "Database", "DevOps & Tools", "Tools"];

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
    setColor("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency || 90);
    setIcon(skill.icon || "");
    setColor(skill.color || "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleIconFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const res = await uploadImage(file, "portfolio/skills");
      if (res && (res.url || res.secureUrl)) {
        setIcon(res.url || res.secureUrl);
      }
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
      color: color || null,
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

  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deletingSkill?._id) return;
    setIsDeleting(true);
    try {
      await deleteSkill(deletingSkill._id);
      setDeletingSkill(null);
      loadSkills();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete skill");
    } finally {
      setIsDeleting(false);
    }
  };

  const effectiveColor = color || (name ? getTechBrandColor(name, category) : "#38bdf8");

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              Tech Stack Catalog
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Skills & Technologies
          </h1>
          <p className="text-sm text-muted mt-1">
            Manage your technical skill matrix, custom brand dot colors, and icons.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-colors shadow-lg cursor-pointer"
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
          <span>Add New Skill</span>
        </button>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="py-20 text-center text-muted font-mono text-xs">
            Loading skills...
          </div>
        ) : Object.keys(skillsData).length === 0 ? (
          <div className="glass-card py-16 text-center border-dashed rounded-3xl">
            <p className="text-muted text-sm mb-4">No skills registered yet.</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08]"
            >
              Add First Skill
            </button>
          </div>
        ) : (
          Object.entries(skillsData).map(([cat, skills]) => (
            <div key={cat} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <h2 className="text-lg font-display font-bold text-white">{cat}</h2>
                </div>
                <span className="text-xs font-mono text-muted">{skills.length} skills</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {skills.map((s) => {
                  const brandColor = s.color || getTechBrandColor(s.name, s.category);
                  return (
                    <div
                      key={s._id || s.name}
                      className="p-3.5 rounded-xl bg-surface-100/70 border border-white/[0.06] flex items-center justify-between group hover:border-cyan-400/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {s.icon ? (
                          <img
                            src={s.icon}
                            alt={s.name}
                            className="w-8 h-8 rounded-lg object-contain bg-white/[0.04] p-1 border border-white/[0.08]"
                            style={{ borderColor: `${brandColor}40` }}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono"
                            style={{
                              backgroundColor: `${brandColor}20`,
                              color: brandColor,
                              border: `1px solid ${brandColor}40`,
                            }}
                          >
                            {s.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-white block truncate max-w-[120px]">
                              {s.name}
                            </span>
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{
                                backgroundColor: brandColor,
                                boxShadow: `0 0 6px ${brandColor}`,
                              }}
                              title={`Color: ${brandColor}`}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-muted">
                            Proficiency: {s.proficiency || 90}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-md hover:bg-white/[0.08] text-muted hover:text-white text-xs cursor-pointer"
                          title="Edit Skill"
                        >
                          <EditRoundedIcon sx={{ fontSize: 16 }} />
                        </button>
                        <button
                          onClick={() => setDeletingSkill(s)}
                          className="p-1.5 rounded-md hover:bg-rose-500/20 text-muted hover:text-rose-300 text-xs cursor-pointer"
                          title="Delete Skill"
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-white/[0.1] shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <CodeRoundedIcon sx={{ fontSize: 20, color: effectiveColor }} />
                <span>{editingSkill ? "Edit Skill" : "Add Technical Skill"}</span>
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

              {/* Custom Tech Brand Dot Color */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-muted flex items-center gap-1.5">
                    <PaletteRoundedIcon sx={{ fontSize: 14, color: effectiveColor }} />
                    <span>Tech Brand Dot Color</span>
                  </label>
                  <span className="text-[10px] text-muted">
                    {color ? "Custom color" : "Auto-detected from name"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={effectiveColor}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-surface-100 border border-white/[0.1] cursor-pointer p-0.5 shrink-0"
                    title="Choose custom color"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder={`Auto: ${effectiveColor}`}
                    className="flex-1 px-3 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  />
                  {color && (
                    <button
                      type="button"
                      onClick={() => setColor("")}
                      className="px-2.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-muted hover:text-white text-[10px]"
                      title="Reset to auto brand color"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Quick Preset Colors Palette */}
                <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-muted mr-1">Presets:</span>
                  {PRESET_COLORS.map((p) => (
                    <button
                      type="button"
                      key={p.hex}
                      onClick={() => setColor(p.hex)}
                      title={p.label}
                      className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-125 focus:outline-none"
                      style={{
                        backgroundColor: p.hex,
                        boxShadow: effectiveColor === p.hex ? `0 0 8px ${p.hex}` : undefined,
                        transform: effectiveColor === p.hex ? "scale(1.2)" : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1">Skill Icon / Logo Image</label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] cursor-pointer flex items-center gap-2">
                    <CloudUploadRoundedIcon sx={{ fontSize: 16 }} />
                    <span>Upload Icon</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconFileUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadingImage && <span className="text-cyan-400">Uploading...</span>}
                </div>

                <div className="mt-2">
                  <input
                    type="url"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Or paste image URL: https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-100/60 border border-white/[0.06] text-white text-[11px] focus:outline-none focus:border-cyan-400"
                  />
                </div>

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
                  className="w-full accent-cyan-400 cursor-pointer"
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
                  {editingSkill ? "Update Skill" : "Save Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingSkill)}
        title="Xác Nhận Xóa Kỹ Năng"
        itemName={deletingSkill?.name}
        itemType="Kỹ năng"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingSkill(null)}
      />
    </div>
  );
};
