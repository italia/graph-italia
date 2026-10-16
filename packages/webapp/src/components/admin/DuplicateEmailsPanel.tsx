import { useCallback, useEffect, useState } from "react";
import { FaCircleCheck, FaCodeMerge, FaTriangleExclamation } from "react-icons/fa6";
import * as api from "../../lib/api";
import type { DuplicateEmailGroup, DuplicateEmailUser } from "../../lib/api";
import GenericDialog from "../layout/GenericDialog";

/**
 * Suggested account to keep in a group: admin first, then verified, then the
 * one with a SPID/CIE identity, then the one owning more projects, then the
 * oldest. Only a default — the admin picks.
 */
function suggestedKeep(users: DuplicateEmailUser[]): string {
  const score = (u: DuplicateEmailUser) => [
    u.role === "ADMIN" ? 1 : 0,
    u.verified ? 1 : 0,
    u.identities > 0 ? 1 : 0,
    u.ownedProjects,
    -new Date(u.createdAt).getTime(),
  ];
  return [...users].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return sb[i] - sa[i];
    return 0;
  })[0].id;
}

/**
 * Admin panel section for accounts whose emails differ only by case. Lookups
 * are case-insensitive, so such accounts are ambiguous: for each group the
 * admin picks the account to keep and merges the others into it (projects,
 * memberships and SPID/CIE identities move, nothing is lost). When the list is
 * empty a database CHECK on lowercase emails can be safely introduced.
 */
export default function DuplicateEmailsPanel({
  onMerged,
  notify,
}: {
  onMerged: () => void;
  notify: (msg: string, ok?: boolean) => void;
}) {
  const [groups, setGroups] = useState<DuplicateEmailGroup[] | null>(null);
  const [keep, setKeep] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<DuplicateEmailGroup | null>(null);
  const [busy, setBusy] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const data = await api.adminGetDuplicateEmails();
      setGroups(data);
      setKeep(Object.fromEntries(data.map((g) => [g.email, suggestedKeep(g.users)])));
    } catch {
      notify("Failed to load duplicate emails", false);
    }
  }, [notify]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleMerge = async () => {
    if (!pending) return;
    const keepId = keep[pending.email];
    const mergeIds = pending.users.filter((u) => u.id !== keepId).map((u) => u.id);
    setBusy(true);
    try {
      const ok = await api.adminMergeUsers(keepId, mergeIds);
      notify(ok ? `Merged ${mergeIds.length + 1} accounts into ${pending.email}` : "Merge failed", ok);
      await fetchGroups();
      onMerged();
    } catch (error) {
      notify(api.getErrorMessage(error, "Merge failed"), false);
    } finally {
      setBusy(false);
      setPending(null);
    }
  };

  if (groups === null) return null;

  if (groups.length === 0) {
    return (
      <div className="alert alert-success text-sm">
        <FaCircleCheck aria-hidden="true" />
        <span>No duplicate emails: every account has a distinct email (case-insensitive).</span>
      </div>
    );
  }

  const keepUser = pending?.users.find((u) => u.id === keep[pending.email]);

  return (
    <section aria-labelledby="duplicate-emails-heading" className="card bg-base-100 shadow-xl border border-warning">
      <div className="card-body">
        <h2 id="duplicate-emails-heading" className="card-title text-lg">
          <FaTriangleExclamation className="text-warning" aria-hidden="true" />
          Duplicate emails ({groups.length})
        </h2>
        <p className="text-sm opacity-70">
          These accounts share the same email with different casing. Choose the account to keep: the others are
          merged into it — their projects, project/org memberships and SPID/CIE identities move to it — and then
          deleted.
        </p>

        {groups.map((group) => (
          <fieldset key={group.email} className="mt-4 border border-base-300 rounded-box p-3">
            <legend className="px-2 font-mono text-sm font-semibold">{group.email}</legend>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th scope="col">Keep</th>
                    <th scope="col">Stored email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">SPID/CIE</th>
                    <th scope="col">Password</th>
                    <th scope="col">Projects (owned / member)</th>
                    <th scope="col">Orgs</th>
                    <th scope="col">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {group.users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <input
                          type="radio"
                          className="radio radio-sm radio-primary"
                          name={`keep-${group.email}`}
                          aria-label={`Keep ${u.email} (${u.id})`}
                          checked={keep[group.email] === u.id}
                          onChange={() => setKeep((prev) => ({ ...prev, [group.email]: u.id }))}
                        />
                      </td>
                      <td>
                        <div className="font-mono text-sm">{u.email}</div>
                        <div className="font-mono text-xs opacity-40">{u.id}</div>
                      </td>
                      <td>
                        <span className={`badge badge-sm ${u.role === "ADMIN" ? "badge-error" : "badge-ghost"}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className={`badge badge-sm ${u.verified ? "badge-success" : "badge-warning"}`}>
                          {u.verified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td>{u.identities}</td>
                      <td>{u.hasPassword ? "Yes" : "No"}</td>
                      <td>
                        {u.ownedProjects} / {u.projectMemberships}
                      </td>
                      <td>{u.orgMemberships}</td>
                      <td className="text-xs opacity-70">{new Date(u.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-2">
              <button type="button" className="btn btn-warning btn-sm" onClick={() => setPending(group)}>
                <FaCodeMerge aria-hidden="true" />
                Merge into selected
              </button>
            </div>
          </fieldset>
        ))}
      </div>

      {pending && keepUser && (
        <GenericDialog
          toggle
          title={`Merge accounts — ${pending.email}`}
          description={`Keep ${keepUser.email} (${keepUser.id}) and merge ${pending.users.length - 1} other account(s) into it.`}
          labels={{ cancel: "Cancel", confirm: "Merge" }}
          confirmCb={handleMerge}
          confirmDisabled={busy}
          cancelCb={() => setPending(null)}
        >
          <div className="alert alert-warning text-xs mt-2">
            <span>
              The other accounts are deleted after their projects, memberships and SPID/CIE identities are moved.
              The kept account becomes verified, ADMIN or gets a password if any merged account had one, and its
              email is stored lowercase. This cannot be undone.
            </span>
          </div>
        </GenericDialog>
      )}
    </section>
  );
}
