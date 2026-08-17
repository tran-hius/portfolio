import { useState, useEffect } from "react";
import {
  fetchCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../../services/api.js";
import type { Certificate } from "../../types/portfolio.js";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
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

export const AdminCertificatesPage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchCertificates();
    setCertificates(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingCert(null);
    setTitle("");
    setIssuer("");
    setIssueDate("");
    setCredentialId("");
    setCredentialUrl("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setIssueDate(formatDateForInput(cert.issueDate));
    setCredentialId(cert.credentialId || "");
    setCredentialUrl(cert.credentialUrl || "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: Partial<Certificate> = {
      title,
      issuer,
      issueDate,
      credentialId: credentialId || undefined,
      credentialUrl: credentialUrl || undefined,
    };

    try {
      if (editingCert?._id) {
        await updateCertificate(editingCert._id, payload);
      } else {
        await createCertificate(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to save certificate");
    }
  };

  const [deletingCert, setDeletingCert] = useState<Certificate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deletingCert?._id) return;
    setIsDeleting(true);
    try {
      await deleteCertificate(deletingCert._id);
      setDeletingCert(null);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to delete certificate");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            CMS // Professional Credentials
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Manage Verified Certifications
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
        >
          <AddRoundedIcon sx={{ fontSize: 18 }} />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-muted">
                <th className="pb-3 font-medium">Certification Title</th>
                <th className="pb-3 font-medium">Issuing Organization</th>
                <th className="pb-3 font-medium">Issue Date</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted">
                    Loading certifications...
                  </td>
                </tr>
              ) : certificates.length > 0 ? (
                certificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-white/[0.02]">
                    <td className="py-4 text-white font-medium max-w-xs">
                      <div className="font-sans font-bold text-sm text-white mb-0.5 flex items-center gap-2">
                        <WorkspacePremiumRoundedIcon sx={{ fontSize: 16, color: "#38bdf8" }} />
                        <span>{cert.title}</span>
                      </div>
                      {cert.credentialId && (
                        <div className="text-muted text-[11px]">ID: {cert.credentialId}</div>
                      )}
                    </td>
                    <td className="py-4 text-cyan-300">{cert.issuer}</td>
                    <td className="py-4 text-muted">
                      <div className="inline-flex items-center gap-1.5">
                        <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: "#64748b" }} />
                        <span>{formatDateDisplay(cert.issueDate)}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 text-cyan-300 text-xs border border-white/[0.08] inline-flex items-center gap-1"
                        >
                          <span>Verify</span>
                          <LaunchRoundedIcon sx={{ fontSize: 12 }} />
                        </a>
                      )}
                      <button
                        onClick={() => openEditModal(cert)}
                        className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 text-white text-xs border border-white/[0.08] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <EditRoundedIcon sx={{ fontSize: 14 }} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingCert(cert)}
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
                    No certifications found. Click "+ Add Certificate" to create one.
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
                <WorkspacePremiumRoundedIcon sx={{ fontSize: 20, color: "#38bdf8" }} />
                <span>{editingCert ? "Edit Certification" : "Add New Certification"}</span>
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
                <label className="block text-muted mb-1">Certification Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-muted mb-1">Issuing Organization *</label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="Amazon Web Services, Coursera, Google Cloud"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-muted mb-1">Issue Date *</label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400 [color-scheme:dark] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="AWS-88992200"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-muted mb-1">Verification URL</label>
                  <input
                    type="url"
                    value={credentialUrl}
                    onChange={(e) => setCredentialUrl(e.target.value)}
                    placeholder="https://credly.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-100 border border-white/[0.08] text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
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
                  {editingCert ? "Update Certificate" : "Save Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingCert)}
        title="Delete Certificate Record"
        itemName={deletingCert?.title}
        itemType="Certificate"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingCert(null)}
      />
    </div>
  );
};
