import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaCopy, FaCheck, FaKey, FaBan, FaRotateLeft } from "react-icons/fa6";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Layout from "../../components/layout/index.tsx";
import Loading from "../../components/layout/Loading.tsx";
import GenericDialog from "../../components/layout/GenericDialog.tsx";
import * as api from "../../lib/api.ts";
import type { ApiKey } from "../../lib/api.ts";

export default function EditApiKeysPage() {
  const { t } = useTranslation("pages", { keyPrefix: "apikeys" });

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [role, setRole] = useState<"READONLY" | "READWRITE">("READONLY");
  const [expire, setExpire] = useState(10080); // 1 week in minutes
  const [projects, setProjects] = useState<api.Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Reveal state — shown after successful creation
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Delete state
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // ── Data fetching ────────────────────────────────────────────────────────────

  const fetchKeys = async () => {
    setLoading(true);
    try {
      setKeys(await api.getApiKeys());
    } catch (e) {
      console.error("Failed to fetch API keys:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
      if (data.length > 0) setSelectedProjectId(data[0].id);
    } catch (e) {
      console.error("Failed to fetch projects:", e);
    }
  };

  useEffect(() => {
    fetchKeys();
    fetchProjects();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const created = await api.createApiKey({ role, expire, projectId: selectedProjectId });
      if (created?.rawKey) {
        setShowCreateModal(false);
        setRevealedKey(created.rawKey);
        await fetchKeys();
      }
    } catch (e) {
      console.error("Failed to create API key:", e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await api.deleteApiKey(pendingDeleteId);
      setKeys((prev) => prev.filter((k) => k.id !== pendingDeleteId));
    } catch (e) {
      console.error("Failed to delete API key:", e);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      const updated = await api.revokeApiKey(id);
      if (updated) setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, ...updated } : k)));
    } catch (e) {
      console.error("Failed to revoke API key:", e);
    }
  };

  const handleReinstate = async (id: string) => {
    try {
      const updated = await api.reinstateApiKey(id);
      if (updated) setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, ...updated } : k)));
    } catch (e) {
      console.error("Failed to reinstate API key:", e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getKeyStatus = (key: ApiKey): { label: string; className: string } => {
    if (key.revokedAt) return { label: t("status.revoked", "Revoked"), className: "badge-error" };
    const exp = new Date(new Date(key.createdAt).getTime() + key.expire * 60000);
    if (exp < new Date()) return { label: t("status.expired", "Expired"), className: "badge-warning" };
    return { label: t("status.active", "Active"), className: "badge-success" };
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Layout>
      <Helmet>
        <title>{t("title", "API Keys")}</title>
      </Helmet>

      {/* Header */}
      <div className="w-full flex justify-between items-center gap-2 bg-base-300 py-4 px-8 rounded-lg mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaKey className="text-primary" />
            {t("title", "API Keys")}
          </h1>
          <p className="text-sm opacity-70">
            {t("description", "Manage your API keys for programmatic access.")}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> {t("createBtn", "Create New Key")}
        </button>
      </div>

      {/* Keys table */}
      <div className="p-6">
        {loading ? (
          <Loading />
        ) : (
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>{t("table.prefix", "Prefix")}</th>
                      <th>{t("table.status", "Status")}</th>
                      <th>{t("table.role", "Role")}</th>
                      <th>{t("table.project", "Project")}</th>
                      <th>{t("table.orgs", "Organizations")}</th>
                      <th>{t("table.owner", "Owner")}</th>
                      <th>{t("table.created", "Created At")}</th>
                      <th>{t("table.expires", "Expires")}</th>
                      <th className="text-right">{t("table.actions", "Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-10 opacity-50">
                          {t("noKeys", "No API keys found.")}
                        </td>
                      </tr>
                    ) : (
                      keys.map((key) => {
                        const exp = new Date(new Date(key.createdAt).getTime() + key.expire * 60000);
                        const orgsList = key.project?.orgs?.map((o) => o.org.name).join(", ") || t("form.personal", "Personal");
                        const status = getKeyStatus(key);
                        return (
                          <tr key={key.id} className={`hover ${key.revokedAt ? "opacity-60" : ""}`}>
                            <td>
                              <code className="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                                dv_{key.prefix}…
                              </code>
                            </td>
                            <td>
                              <span className={`badge badge-sm ${status.className}`}>
                                {status.label}
                              </span>
                            </td>
                            <td>
                              <span className={`badge badge-sm ${key.role === "READWRITE" ? "badge-secondary" : "badge-ghost"}`}>
                                {key.role}
                              </span>
                            </td>
                            <td className="font-semibold text-sm">{key.project?.name || "---"}</td>
                            <td className="text-sm opacity-80">{orgsList}</td>
                            <td className="text-xs opacity-70">{key.project?.owner?.email || "---"}</td>
                            <td className="text-xs">{new Date(key.createdAt).toLocaleString()}</td>
                            <td className={`text-xs ${exp < new Date() && !key.revokedAt ? "text-warning font-bold" : ""}`}>
                              {exp.toLocaleString()}
                            </td>
                            <td className="text-right">
                              <div className="flex justify-end gap-1">
                                {key.revokedAt ? (
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm text-success"
                                    title={t("actions.reinstate", "Reinstate")}
                                    onClick={() => handleReinstate(key.id)}
                                  >
                                    <FaRotateLeft />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-sm text-warning"
                                    title={t("actions.revoke", "Revoke")}
                                    onClick={() => handleRevoke(key.id)}
                                  >
                                    <FaBan />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-sm text-error"
                                  title={t("actions.delete", "Delete")}
                                  onClick={() => setPendingDeleteId(key.id)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Create modal ── */}
      <GenericDialog
        toggle={showCreateModal}
        title={t("modal.createTitle", "Create API Key")}
        description={t("modal.createDesc", "Configure your new API key.")}
        labels={{
          cancel: t("modal.cancel", "Cancel"),
          confirm: t("modal.create", "Create Key"),
        }}
        confirmCb={handleCreate}
        confirmDisabled={isCreating || !selectedProjectId}
        cancelCb={() => setShowCreateModal(false)}
      >
        <div className="space-y-4 py-2">
          <div className="form-control w-full">
            <label htmlFor="key-role" className="label">
              <span className="label-text font-semibold">{t("form.role", "Role")}</span>
            </label>
            <select
              id="key-role"
              className="select select-bordered w-full"
              value={role}
              onChange={(e) => setRole(e.target.value as "READONLY" | "READWRITE")}
            >
              <option value="READONLY">READONLY — view only</option>
              <option value="READWRITE">READWRITE — full access</option>
            </select>
          </div>

          <div className="form-control w-full">
            <label htmlFor="key-project" className="label">
              <span className="label-text font-semibold">{t("form.project", "Project")}</span>
            </label>
            <select
              id="key-project"
              className="select select-bordered w-full"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="" disabled>{t("form.selectProject", "Select a project")}</option>
              {projects.map((p) => {
                const org = p.orgs && p.orgs.length > 0 ? p.orgs[0].org.name : t("form.personal", "Personal");
                return (
                  <option key={p.id} value={p.id}>
                    {p.name} ({org})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-control w-full">
            <label htmlFor="key-expire" className="label">
              <span className="label-text font-semibold">{t("form.expire", "Expiration (minutes)")}</span>
            </label>
            <input
              id="key-expire"
              type="number"
              className="input input-bordered w-full"
              value={expire}
              onChange={(e) => setExpire(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min={1}
            />
            <p className="text-xs opacity-60 mt-1 px-1">
              {expire >= 1440 ? `${Math.round(expire / 1440)} day(s)` : expire >= 60 ? `${Math.round(expire / 60)} hour(s)` : `${expire} minute(s)`}
            </p>
          </div>

          {isCreating && (
            <div className="flex justify-center py-2">
              <span className="loading loading-spinner" />
            </div>
          )}
        </div>
      </GenericDialog>

      {/* ── Reveal modal — shown once after creation ── */}
      <GenericDialog
        toggle={!!revealedKey}
        title={t("modal.successTitle", "Key Created Successfully")}
        description={t("modal.successDesc", "Copy this key now — it will never be shown again.")}
        labels={{ cancel: t("modal.done", "Done") }}
        cancelCb={() => { setRevealedKey(null); setCopied(false); }}
      >
        <div className="space-y-4 py-2">
          <div className="bg-base-200 rounded-lg border border-primary/30 p-4 flex items-start gap-3">
            <code className="text-sm font-bold break-all flex-1 select-all">{revealedKey}</code>
            <button
              type="button"
              className={`btn btn-circle btn-sm shrink-0 ${copied ? "btn-success" : "btn-ghost"}`}
              title={copied ? "Copied!" : "Copy to clipboard"}
              onClick={() => copyToClipboard(revealedKey ?? "")}
            >
              {copied ? <FaCheck /> : <FaCopy />}
            </button>
          </div>
          <div className="alert alert-warning text-xs">
            <span>{t("modal.warning", "Once you close this window, the key will never be visible again.")}</span>
          </div>
        </div>
      </GenericDialog>

      {/* ── Delete confirmation ── */}
      <GenericDialog
        toggle={!!pendingDeleteId}
        title={t("modal.deleteTitle", "Delete API Key")}
        description={t("modal.deleteDesc", "This action cannot be undone.")}
        labels={{ cancel: t("modal.cancel", "Cancel"), confirm: t("modal.delete", "Delete") }}
        confirmCb={handleDelete}
        cancelCb={() => setPendingDeleteId(null)}
      >
        <div className="py-2">
          <p className="text-sm opacity-70">
            ID: <span className="font-mono">{pendingDeleteId}</span>
          </p>
        </div>
      </GenericDialog>
    </Layout>
  );
}
