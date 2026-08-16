import { useState, useEffect } from "react";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadImage,
} from "../../services/api.js";
import type { Project } from "../../types/portfolio.js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FolderSpecialRoundedIcon from "@mui/icons-material/FolderSpecialRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import GitHubIcon from "@mui/icons-material/GitHub";

export const AdminProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologiesStr, setTechnologiesStr] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [category, setCategory] = useState("Architecture");
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    const data = await fetchProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setTechnologiesStr("");
    setGithubUrl("");
    setLiveUrl("");
    setCategory("Architecture");
    setIsFeatured(false);
    setImageUrl("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setTechnologiesStr(project.technologies.join(", "));
    setGithubUrl(project.githubUrl || "");
    setLiveUrl(project.liveUrl || "");
    setCategory(project.category || "Architecture");
    setIsFeatured(!!project.isFeatured);
    setImageUrl(project.imageUrl || "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const res = await uploadImage(file, "portfolio/projects");
      if (res && (res.url || res.secureUrl)) {
        setImageUrl(res.url || res.secureUrl);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image to Cloudinary");
    } finally {
      setUploadingImage(false);
    }

  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const techArray = technologiesStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<Project> = {
      title,
      description,
      technologies: techArray,
      githubUrl: githubUrl || undefined,
      liveUrl: liveUrl || undefined,
      category,
      isFeatured,
      imageUrl: imageUrl || undefined,
    };

    try {
      if (editingProject) {
        await updateProject(editingProject._id, payload);
      } else {
        await createProject(payload);
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err: any) {
      setError(err.message || "Failed to save project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this project?")) {
      return;
    }
    try {
      await deleteProject(id);
      loadProjects();
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            CMS // Projects Module
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Manage Portfolio Projects
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
          <span>Add New Project</span>
        </button>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-muted">
                <th className="pb-3 font-medium">Project Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Tech Stack</th>
                <th className="pb-3 font-medium">Featured</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length > 0 ? (
                projects.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02]">
                    <td className="py-4 text-white font-medium max-w-xs">
                      <div className="font-sans font-bold text-sm text-white mb-0.5 flex items-center gap-2">
                        <FolderSpecialRoundedIcon sx={{ fontSize: 16, color: "#38bdf8" }} />
                        <span>{p.title}</span>
                      </div>
                      <div className="text-muted text-[11px] truncate max-w-xs">{p.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted hover:text-white flex items-center gap-0.5"
                          >
                            <GitHubIcon sx={{ fontSize: 12 }} />
                            <span className="text-[10px]">Code</span>
                          </a>
                        )}
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:underline flex items-center gap-0.5"
                          >
                            <LaunchRoundedIcon sx={{ fontSize: 12 }} />
                            <span className="text-[10px]">Demo</span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-cyan-300">{p.category || "Architecture"}</td>
                    <td className="py-4 text-muted max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {p.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px]">
                            {t}
                          </span>
                        ))}
                        {p.technologies.length > 3 && (
                          <span className="text-[10px] text-muted">+{p.technologies.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      {p.isFeatured ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/20 inline-flex items-center gap-1">
                          <StarRoundedIcon sx={{ fontSize: 12 }} />
                          <span>FEATURED</span>
                        </span>
                      ) : (
                        <span className="text-muted text-[10px]">STANDARD</span>
                      )}
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <EditRoundedIcon sx={{ fontSize: 14 }} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
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
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No projects found. Click "+ Add New Project" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-white/[0.1] shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <FolderSpecialRoundedIcon sx={{ fontSize: 22, color: "#38bdf8" }} />
                <span>{editingProject ? "Edit Project Details" : "Create New Project"}</span>
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
                <label className="block text-muted mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Autonomous Agent Orchestrator"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-muted mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="High-level architectural summary..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Architecture, Backend, AI"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1">Technologies (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={technologiesStr}
                    onChange={(e) => setTechnologiesStr(e.target.value)}
                    placeholder="Node.js, TypeScript, React, MongoDB"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-muted mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted mb-1">Project Media / Cloudinary Image</label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] cursor-pointer flex items-center gap-2">
                    <CloudUploadRoundedIcon sx={{ fontSize: 16 }} />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {uploadingImage && <span className="text-cyan-400">Uploading to Cloudinary...</span>}
                </div>
                {imageUrl && (
                  <div className="mt-2 text-[11px] text-cyan-300 truncate">
                    Uploaded: {imageUrl}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded bg-surface-100 border-white/[0.1] text-cyan-400 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featuredCheckbox" className="text-white cursor-pointer select-none">
                  Highlight as Featured System on Homepage
                </label>
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
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
