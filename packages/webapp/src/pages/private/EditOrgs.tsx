import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaUsers, FaUserPlus, FaShieldHalved, FaBuilding, FaChevronRight, FaChevronDown } from "react-icons/fa6";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Layout from "../../components/layout/index.tsx";
import Loading from "../../components/layout/Loading.tsx";
import GenericDialog from "../../components/layout/GenericDialog.tsx";
import * as api from "../../lib/api.ts";
import type { Organization, OrganizationMember } from "../../lib/api.ts";

export default function EditOrgsPage() {
  const { t } = useTranslation("pages", { keyPrefix: "orgs" });
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Member management state
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"USER" | "ADMIN">("USER");
  const [isAddingMember, setIsAddingMember] = useState(false);


  // Delete/Remove state
  const [pendingDeleteOrgId, setPendingDeleteOrgId] = useState<string | null>(null);
  const [pendingRemoveUserId, setPendingRemoveUserId] = useState<string | null>(null);

  const fetchOrgs = async () => {
    setLoading(true);
    try {
      const data = await api.getOrgs();
      setOrgs(data);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (orgId: string) => {
    setMembersLoading(true);
    try {
      const data = await api.getOrgMembers(orgId);
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrgId) {
      fetchMembers(selectedOrgId);
    } else {
      setMembers([]);
    }
  }, [selectedOrgId]);

  const handleCreateOrg = async () => {
    if (!newOrgName) return;
    setIsCreating(true);
    try {
      await api.createOrg(newOrgName);
      fetchOrgs();
      setShowCreateModal(false);
      setNewOrgName("");
    } catch (error) {
      console.error("Failed to create organization:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteOrg = async () => {
    if (!pendingDeleteOrgId) return;
    try {
      await api.deleteOrg(pendingDeleteOrgId);
      if (selectedOrgId === pendingDeleteOrgId) setSelectedOrgId(null);
      fetchOrgs();
    } catch (error) {
      console.error("Failed to delete organization:", error);
    } finally {
      setPendingDeleteOrgId(null);
    }
  };

  const handleAddMember = async () => {
    if (!selectedOrgId || !newMemberEmail) return;
    setIsAddingMember(true);
    try {
      await api.addOrgMember(selectedOrgId, newMemberEmail, newMemberRole);
      fetchMembers(selectedOrgId);
      setShowAddMemberModal(false);
      setNewMemberEmail("");
    } catch (error) {
      console.error("Failed to add member:", error);
    } finally {
      setIsAddingMember(false);
    }
  };


  const handleRemoveMember = async () => {
    if (!selectedOrgId || !pendingRemoveUserId) return;
    try {
      await api.removeOrgMember(selectedOrgId, pendingRemoveUserId);
      fetchMembers(selectedOrgId);
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setPendingRemoveUserId(null);
    }
  };

  const handleUpdateMemberRole = async (userId: string, role: "USER" | "ADMIN") => {
    if (!selectedOrgId) return;
    try {
      await api.updateOrgMemberRole(selectedOrgId, userId, role);
      fetchMembers(selectedOrgId);
    } catch (error) {
      console.error("Failed to update member role:", error);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{t("title", "Organizations")}</title>
      </Helmet>

      <div className="w-full flex justify-between items-center gap-2 bg-base-300 py-4 px-8 rounded-lg mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaBuilding className="text-primary" />
            {t("title", "Organizations")}
          </h1>
          <p className="text-sm opacity-70">
            {t("description", "Manage your organizations and their members.")}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <FaPlus /> {t("createBtn", "New Organization")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Orgs List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold px-2">{t("listTitle", "Your Organizations")}</h2>
          {loading ? (
            <Loading />
          ) : orgs.length === 0 ? (
            <div className="bg-base-200 rounded-lg p-10 text-center opacity-50">
              {t("noOrgs", "No organizations found.")}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {orgs.map((org) => (
                <div
                  key={org.id}
                  className={`card card-compact border transition-all cursor-pointer ${
                    selectedOrgId === org.id ? "bg-primary text-primary-content border-primary" : "bg-base-100 hover:bg-base-200 border-base-200"
                  }`}
                  onClick={() => setSelectedOrgId(org.id)}
                >
                  <div className="card-body flex-row items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {selectedOrgId === org.id ? <FaChevronDown /> : <FaChevronRight />}
                      <span className="font-bold truncate">{org.name}</span>
                    </div>
                    <button
                      className={`btn btn-ghost btn-xs ${selectedOrgId === org.id ? "text-primary-content" : "text-error"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDeleteOrgId(org.id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Member Management */}
        <div className="lg:col-span-2">
          {selectedOrgId ? (
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title flex items-center gap-2">
                    <FaUsers className="text-primary" />
                    {orgs.find((o) => o.id === selectedOrgId)?.name} - {t("membersTitle", "Members")}
                  </h2>
                  <button className="btn btn-sm btn-outline btn-primary" onClick={() => setShowAddMemberModal(true)}>
                    <FaUserPlus /> {t("addMemberBtn", "Add Member")}
                  </button>
                </div>

                {membersLoading ? (
                  <Loading />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>{t("table.user", "User ID")}</th>
                          <th>{t("table.role", "Role")}</th>
                          <th className="text-right">{t("table.actions", "Actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="text-center py-10 opacity-50">
                              {t("noMembers", "No members found in this organization.")}
                            </td>
                          </tr>
                        ) : (
                          members.map((member) => (
                            <tr key={member.userId} className="hover">
                              <td className="font-mono text-xs">{member.userId}</td>
                              <td>
                                <select
                                  className="select select-ghost select-xs font-bold"
                                  value={member.role}
                                  onChange={(e) => handleUpdateMemberRole(member.userId, e.target.value as any)}
                                >
                                  <option value="USER">USER</option>
                                  <option value="ADMIN">ADMIN</option>
                                </select>
                              </td>
                              <td className="text-right">
                                <button
                                  className="btn btn-ghost btn-xs text-error"
                                  onClick={() => setPendingRemoveUserId(member.userId)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-base-200/50 rounded-2xl border-2 border-dashed border-base-300 min-h-[400px]">
              <FaBuilding size={48} className="opacity-20 mb-4" />
              <p className="opacity-50 font-medium">{t("selectPrompt", "Select an organization to manage its members.")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Org Modal */}
      <GenericDialog
        toggle={showCreateModal}
        title={t("modal.createOrgTitle", "Create New Organization")}
        description={t("modal.createOrgDesc", "Enter a name for your new organization.")}
        labels={{ cancel: t("modal.cancel", "Cancel"), confirm: t("modal.create", "Create") }}
        confirmCb={handleCreateOrg}
        cancelCb={() => setShowCreateModal(false)}
      >
        <div className="form-control w-full py-4">
          <label className="label">
            <span className="label-text font-semibold">{t("form.orgName", "Organization Name")}</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            placeholder="e.g. Acme Corp"
            autoFocus
          />
          {isCreating && <span className="loading loading-spinner mt-2 mx-auto"></span>}
        </div>
      </GenericDialog>

      {/* Add Member Modal */}
      <GenericDialog
        toggle={showAddMemberModal}
        title={t("modal.addMemberTitle", "Add Member")}
        description={t("modal.addMemberDesc", "Invite a user to join this organization.")}
        labels={{ cancel: t("modal.cancel", "Cancel"), confirm: t("modal.add", "Invite") }}
        confirmCb={handleAddMember}
        cancelCb={() => setShowAddMemberModal(false)}
      >
        <div className="space-y-4 py-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">{t("form.email", "Email Address")}</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="user@example.com"
            />

          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">{t("form.role", "Role")}</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value as any)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          {isAddingMember && <span className="loading loading-spinner mx-auto block"></span>}
        </div>
      </GenericDialog>

      {/* Delete Org Confirmation */}
      <GenericDialog
        toggle={!!pendingDeleteOrgId}
        title={t("modal.deleteOrgTitle", "Delete Organization")}
        description={t("modal.deleteOrgDesc", "Are you sure you want to delete this organization? This will remove all project associations.")}
        labels={{ cancel: t("modal.cancel", "Cancel"), confirm: t("modal.delete", "Delete") }}
        confirmCb={handleDeleteOrg}
        cancelCb={() => setPendingDeleteOrgId(null)}
      >
        <div className="py-2">
          <p className="text-sm font-mono opacity-70">ID: {pendingDeleteOrgId}</p>
        </div>
      </GenericDialog>

      {/* Remove Member Confirmation */}
      <GenericDialog
        toggle={!!pendingRemoveUserId}
        title={t("modal.removeMemberTitle", "Remove Member")}
        description={t("modal.removeMemberDesc", "Are you sure you want to remove this user from the organization?")}
        labels={{ cancel: t("modal.cancel", "Cancel"), confirm: t("modal.remove", "Remove") }}
        confirmCb={handleRemoveMember}
        cancelCb={() => setPendingRemoveUserId(null)}
      >
        <div className="py-2">
          <p className="text-sm font-mono opacity-70">User ID: {pendingRemoveUserId}</p>
        </div>
      </GenericDialog>
    </Layout>
  );
}
