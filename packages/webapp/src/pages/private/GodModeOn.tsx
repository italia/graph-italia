import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaCircleCheck, FaCrown, FaEnvelope, FaKey, FaShield, FaTrash } from "react-icons/fa6";
import DataTable, { type TableColumn } from "react-data-table-component";
import Layout from "../../components/layout/index.tsx";
import GenericDialog from "../../components/layout/GenericDialog.tsx";
import registerDarkTheme from "../../components/layout/DataTableDarkTheme.ts";
import { useSettingsStore } from "../../lib/store/settings_store.ts";
import * as api from "../../lib/api.ts";
import type { AdminUser } from "../../lib/api.ts";

registerDarkTheme();

type ActionType = "delete" | "activate" | "resend" | "reset";

interface PendingAction {
  type: ActionType;
  user: AdminUser;
}

const ACTION_LABELS: Record<ActionType, string> = {
  delete: "Delete",
  activate: "Activate",
  resend: "Resend activation",
  reset: "Reset password",
};

const ACTION_DESCRIPTIONS: Record<ActionType, (email: string) => string> = {
  delete: (email) => `Permanently delete ${email}. This cannot be undone.`,
  activate: (email) => `Force-activate ${email} without email verification.`,
  resend: (email) => `Resend the activation email to ${email}.`,
  reset: (email) => `Send a password reset email to ${email}.`,
};

export default function GodModeOnPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const { settings } = useSettingsStore();
  const theme = settings?.preferredTheme === "dark" ? "dark" : "default";

  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await api.adminGetUsers());
    } catch {
      showToast("Failed to load users", false);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setBusy(true);
    try {
      const { type, user } = pendingAction;
      let ok = false;
      if (type === "delete") {
        ok = await api.adminDeleteUser(user.id);
        if (ok) setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else if (type === "activate") {
        ok = await api.adminActivateUser(user.id);
        if (ok) setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, verified: true } : u)));
      } else if (type === "resend") {
        ok = await api.adminResendActivation(user.id);
      } else if (type === "reset") {
        ok = await api.adminResetPassword(user.id);
      }
      showToast(ok ? `${ACTION_LABELS[type]} done` : "Operation failed", ok);
    } catch {
      showToast("Operation failed", false);
    } finally {
      setBusy(false);
      setPendingAction(null);
    }
  };

  const columns: TableColumn<AdminUser>[] = [
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-mono text-sm">{row.email}</div>
          <div className="font-mono text-xs opacity-40">{row.id}</div>
        </div>
      ),
      grow: 2,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      maxWidth: "120px",
      cell: (row) => (
        <span className={`badge badge-sm ${row.role === "ADMIN" ? "badge-error" : "badge-ghost"}`}>
          {row.role}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => (row.verified ? "Verified" : "Unverified"),
      sortable: true,
      maxWidth: "130px",
      cell: (row) => (
        <span className={`badge badge-sm ${row.verified ? "badge-success" : "badge-warning"}`}>
          {row.verified ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      name: "Projects",
      selector: (row) => row.ownedProjects.length + row.projectMember.length,
      sortable: true,
      cell: (row) => {
        const seen = new Map<string, { id: string; name: string; isOwner: boolean }>();
        for (const p of row.ownedProjects) seen.set(p.id, { ...p, isOwner: true });
        for (const { project: p } of row.projectMember) {
          if (!seen.has(p.id)) seen.set(p.id, { ...p, isOwner: false });
        }
        for (const { org } of row.memberships) {
          for (const { project: p } of org.projects) {
            if (!seen.has(p.id)) seen.set(p.id, { ...p, isOwner: false });
          }
        }
        const all = Array.from(seen.values());
        return all.length === 0 ? (
          <span className="text-xs opacity-40">—</span>
        ) : (
          <div className="flex flex-wrap gap-1 py-1">
            {all.map((p) => (
              <span key={p.id} className="badge badge-outline badge-xs flex items-center gap-1" title={p.isOwner ? "Owner" : "Member"}>
                {p.isOwner && <FaCrown className="text-warning" size={9} />}
                {p.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      name: "Orgs",
      selector: (row) => row.memberships.map((m) => m.org.name).join(", "),
      sortable: true,
      cell: (row) =>
        row.memberships.length === 0 ? (
          <span className="text-xs opacity-40">—</span>
        ) : (
          <div className="flex flex-wrap gap-1 py-1">
            {row.memberships.map((m) => (
              <span key={m.org.name} className="badge badge-outline badge-xs">
                {m.org.name}
              </span>
            ))}
          </div>
        ),
    },
    {
      name: "Created",
      selector: (row) => row.createdAt,
      sortable: true,
      maxWidth: "180px",
      cell: (row) => (
        <span className="text-xs opacity-60">{new Date(row.createdAt).toLocaleString()}</span>
      ),
    },
    {
      name: "Actions",
      right: true,
      cell: (row) => (
        <div className="flex justify-end gap-1">
          {!row.verified && (
            <>
              <button
                type="button"
                className="btn btn-outline btn-xs btn-square"
                title="Activate account"
                onClick={() => setPendingAction({ type: "activate", user: row })}
              >
                <FaCircleCheck />
              </button>
              <button
                type="button"
                className="btn btn-outline btn-xs btn-square"
                title="Resend activation email"
                onClick={() => setPendingAction({ type: "resend", user: row })}
              >
                <FaEnvelope />
              </button>
            </>
          )}
          <button
            type="button"
            className="btn btn-outline btn-xs btn-square"
            title="Send password reset email"
            onClick={() => setPendingAction({ type: "reset", user: row })}
          >
            <FaKey />
          </button>
          <button
            type="button"
            className="btn btn-outline btn-xs btn-square"
            title="Delete user"
            onClick={() => setPendingAction({ type: "delete", user: row })}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>God Mode</title>
      </Helmet>

      <div className="w-full flex justify-between items-center gap-2 py-6 px-4 lg:px-10 mb-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaShield className="text-error" />
            God Mode
          </h1>
          <p className="text-sm opacity-70">Admin user management — handle with care.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-error badge-outline">Admin only</span>
          <span className="badge badge-ghost">{users.length} users</span>
        </div>
      </div>

      <div className="p-6">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-0">
            <DataTable
              columns={columns}
              data={users}
              theme={theme}
              progressPending={loading}
              pagination
              paginationPerPage={50}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              highlightOnHover
              noDataComponent={<div className="py-10 opacity-50">No users found.</div>}
            />
          </div>
        </div>
      </div>

      {pendingAction && (
        <GenericDialog
          toggle
          title={`${ACTION_LABELS[pendingAction.type]} — ${pendingAction.user.email}`}
          description={ACTION_DESCRIPTIONS[pendingAction.type](pendingAction.user.email)}
          labels={{ cancel: "Cancel", confirm: ACTION_LABELS[pendingAction.type] }}
          confirmCb={handleConfirm}
          confirmDisabled={busy}
          cancelCb={() => setPendingAction(null)}
        >
          {pendingAction.type === "delete" && (
            <div className="alert alert-error text-xs mt-2">
              <span>All charts, dashboards, and data for this user will be lost.</span>
            </div>
          )}
        </GenericDialog>
      )}

      {toast && (
        <div className="toast toast-end">
          <div className={`alert ${toast.ok ? "alert-success" : "alert-error"} text-sm`}>
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </Layout>
  );
}
