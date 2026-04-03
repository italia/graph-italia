import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaCopy, FaCheck, FaKey } from "react-icons/fa6";
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
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyData, setNewKeyData] = useState<ApiKey | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form state
  const [role, setRole] = useState<"READONLY" | "READWRITE">("READONLY");
  const [expire, setExpire] = useState(10080); // 1 week in minutes
  const [projects, setProjects] = useState<api.Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");


  const fetchKeys = async () => {
    setLoading(true);
    try {
      const data = await api.getApiKeys();
      setKeys(data);
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };


  useEffect(() => {
    fetchKeys();
    fetchProjects();
  }, []);


  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const key = await api.createApiKey({ role, expire, projectId: selectedProjectId });
      if (key) {
        setNewKeyData(key);
        fetchKeys();
      }

    } catch (error) {
      console.error("Failed to create API key:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await api.deleteApiKey(pendingDeleteId);
      fetchKeys();
    } catch (error) {
      console.error("Failed to delete API key:", error);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <Helmet>
        <title>{t("title", "API Keys")}</title>
      </Helmet>

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
          className="btn btn-primary"
          onClick={() => {
            setNewKeyData(null);
            setShowCreateModal(true);
          }}
        >
          <FaPlus /> {t("createBtn", "Create New Key")}
        </button>
      </div>

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
                      <th className="text-xs">{t("table.id", "ID")}</th>
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
                        <td colSpan={8} className="text-center py-10 opacity-50">
                          {t("noKeys", "No API keys found.")}
                        </td>
                      </tr>
                    ) : (
                      keys.map((key) => {
                        const expirationDate = new Date(new Date(key.createdAt).getTime() + key.expire * 60000);
                        const isExpired = expirationDate < new Date();
                        const orgsList = key.project?.orgs?.map(o => o.org.name).join(", ") || t("form.personal", "Personal");

                        return (
                          <tr key={key.id} className="hover">
                            <td className="font-mono text-[10px] opacity-70 w-20 truncate" title={key.id}>{key.id}</td>
                            <td>
                              <div className={`badge badge-sm ${key.role === "READWRITE" ? "badge-secondary" : "badge-ghost"}`}>
                                {key.role}
                              </div>
                            </td>
                            <td className="font-semibold text-sm">{key.project?.name || "---"}</td>
                            <td className="text-sm opacity-80">{orgsList}</td>
                            <td className="text-xs opacity-70">{key.project?.owner?.email || "---"}</td>
                            <td className="text-xs">{new Date(key.createdAt).toLocaleString()}</td>
                            <td className={`text-xs ${isExpired ? "text-error font-bold" : ""}`}>
                              {expirationDate.toLocaleString()}
                              {isExpired && <span className="ml-1 opacity-70">(Expired)</span>}
                            </td>
                            <td className="text-right">
                              <button
                                className="btn btn-ghost btn-sm text-error"
                                onClick={() => setPendingDeleteId(key.id)}
                              >
                                <FaTrash />
                              </button>
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

      {/* Create Modal */}
      <GenericDialog
        toggle={showCreateModal}
        title={newKeyData ? t("modal.successTitle", "Key Created Successfully") : t("modal.createTitle", "Create API Key")}
        description={newKeyData ? t("modal.successDesc", "Copy this key now. You won't be able to see it again!") : t("modal.createDesc", "Configure your new API key.")}
        labels={{
          cancel: newKeyData ? t("modal.close", "Close") : t("modal.cancel", "Cancel"),
          confirm: newKeyData ? "" : t("modal.create", "Create Key")
        }}
        confirmCb={newKeyData ? undefined : handleCreate}
        cancelCb={() => {
          setShowCreateModal(false);
          setNewKeyData(null);
        }}

      >
        {newKeyData ? (
          <div className="space-y-4">
            <div className="bg-base-200 p-4 rounded-lg flex items-center justify-between gap-4 border border-primary/30">
              <code className="text-sm font-bold break-all">{newKeyData.key}</code>
              <button
                className={`btn btn-circle btn-sm ${copied ? "btn-success" : "btn-ghost"}`}
                onClick={() => copyToClipboard(newKeyData.key || "")}
              >
                {copied ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <div className="alert alert-warning text-xs">
              <span>{t("modal.warning", "Once you close this window, the key will be hidden forever for security reasons.")}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">{t("form.role", "Role")}</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="READONLY">READONLY (View only)</option>
                <option value="READWRITE">READWRITE (Full access)</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">{t("form.project", "Project")}</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
              >
                <option value="" disabled>{t("form.selectProject", "Select a project")}</option>
                {projects.map(p => {
                  const orgName = p.orgs && p.orgs.length > 0 ? p.orgs[0].org.name : t("form.personal", "Personal");
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} ({orgName})
                    </option>
                  );
                })}

              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">{t("form.expire", "Expiration (minutes)")}</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={expire}
                onChange={(e) => setExpire(parseInt(e.target.value))}
                min={1}
              />
              <label className="label">
                <span className="label-text-alt opacity-60">
                  {expire > 1440 ? `${Math.round(expire / 1440)} days` : expire > 60 ? `${Math.round(expire / 60)} hours` : "Duration in minutes"}
                </span>
              </label>
            </div>
            {isCreating && (
              <div className="flex justify-center py-2">
                <span className="loading loading-spinner"></span>
              </div>
            )}
          </div>
        )}
      </GenericDialog>

      {/* Delete Confirmation */}
      <GenericDialog
        toggle={!!pendingDeleteId}
        title={t("modal.deleteTitle", "Delete API Key")}
        description={t("modal.deleteDesc", "Are you sure you want to delete this API key? This action cannot be undone.")}
        labels={{ cancel: t("modal.cancel", "Cancel"), confirm: t("modal.delete", "Delete") }}
        confirmCb={handleDelete}
        cancelCb={() => setPendingDeleteId(null)}
      >
        <div className="py-2">
          <p className="text-sm opacity-70">ID: <span className="font-mono">{pendingDeleteId}</span></p>
        </div>
      </GenericDialog>
    </Layout>
  );
}
