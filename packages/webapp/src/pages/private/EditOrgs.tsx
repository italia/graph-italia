import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaUsers, FaUserPlus, FaShieldHalved, FaBuilding, FaChevronRight, FaChevronDown, FaFolderTree, FaRightLeft } from "react-icons/fa6";

import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Layout from "../../components/layout/index.tsx";
import Loading from "../../components/layout/Loading.tsx";
import GenericDialog from "../../components/layout/GenericDialog.tsx";
import * as api from "../../lib/api.ts";
import type { Organization, OrganizationMember } from "../../lib/api.ts";
import { useUserStore } from "../../lib/store/user_store.ts";

export default function EditOrgsPage() {
  const { t } = useTranslation("pages", { keyPrefix: "orgs" });
  const { user } = useUserStore();

  const isAdminOf = (orgId: string) =>
    orgs.find((o) => o.id === orgId)?.members?.some(
      (m) => m.userId === user?.userId && m.role === "ADMIN"
    ) ?? false;
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

  // Project management state
  const [projects, setProjects] = useState<api.Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [personalProjects, setPersonalProjects] = useState<api.Project[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProjectIdToTransfer, setSelectedProjectIdToTransfer] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // Delete/Remove state
  const [pendingDeleteOrgId, setPendingDeleteOrgId] = useState<string | null>(null);
  const [pendingRemoveUserId, setPendingRemoveUserId] = useState<string | null>(null);
  const [pendingRevokeProjectId, setPendingRevokeProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"members" | "projects">("members");



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

  const fetchOrgProjects = async (orgId: string) => {
    setProjectsLoading(true);
    try {
      const data = await api.getOrgProjects(orgId);
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch organization projects:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchPersonalProjects = async () => {
    try {
      const data = await api.getPersonalProjects();
      setPersonalProjects(data);
    } catch (error) {
      console.error("Failed to fetch personal projects:", error);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrgId) {
      if (activeTab === "members") fetchMembers(selectedOrgId);
      if (activeTab === "projects") fetchOrgProjects(selectedOrgId);
    } else {
      setMembers([]);
      setProjects([]);
    }
  }, [selectedOrgId, activeTab]);


  const handleCreateOrg = async () => {
    if (!newOrgName) return;
    setIsCreating(true);
    try {
      await api.createOrg(newOrgName);
      fetchOrgs();
      setShowCreateModal(false);
      setNewOrgName("");
      toast.success(t("toasts.orgCreated", "Organizzazione creata con successo"));
    } catch (error) {
      console.error("Failed to create organization:", error);
      toast.error(t("toasts.orgCreateError", "Errore durante la creazione dell'organizzazione"));
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
      toast.success(t("toasts.orgDeleted", "Organizzazione eliminata"));
    } catch (error) {
      console.error("Failed to delete organization:", error);
      toast.error(t("toasts.orgDeleteError", "Errore durante l'eliminazione dell'organizzazione"));
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
      toast.success(t("toasts.memberAdded", "Membro aggiunto con successo"));
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error(t("toasts.memberAddError", "Errore durante l'aggiunta del membro"));
    } finally {
      setIsAddingMember(false);
    }
  };


  const handleRemoveMember = async () => {
    if (!selectedOrgId || !pendingRemoveUserId) return;
    try {
      await api.removeOrgMember(selectedOrgId, pendingRemoveUserId);
      fetchMembers(selectedOrgId);
      toast.success(t("toasts.memberRemoved", "Membro rimosso"));
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error(t("toasts.memberRemoveError", "Errore durante la rimozione del membro"));
    } finally {
      setPendingRemoveUserId(null);
    }
  };

  const handleUpdateMemberRole = async (userId: string, role: "USER" | "ADMIN") => {
    if (!selectedOrgId) return;
    try {
      await api.updateOrgMemberRole(selectedOrgId, userId, role);
      fetchMembers(selectedOrgId);
      toast.success(t("toasts.roleUpdated", "Ruolo aggiornato"));
    } catch (error) {
      console.error("Failed to update member role:", error);
      toast.error(t("toasts.roleUpdateError", "Errore durante l'aggiornamento del ruolo"));
    }
  };

  const handleRevokeProjectFromOrg = async () => {
    if (!selectedOrgId || !pendingRevokeProjectId) return;
    try {
      await api.revokeOrgFromProject(pendingRevokeProjectId, selectedOrgId);
      setProjects((prev) => prev.filter((p) => p.id !== pendingRevokeProjectId));
      toast.success(t("toasts.projectRevoked", "Accesso al progetto revocato"));
    } catch (error) {
      console.error("Failed to revoke project from org:", error);
      toast.error(t("toasts.projectRevokeError", "Errore durante la revoca del progetto"));
    } finally {
      setPendingRevokeProjectId(null);
    }
  };

  const handleTransferProject = async () => {
    if (!selectedOrgId || !selectedProjectIdToTransfer) return;
    setIsTransferring(true);
    try {
      await api.transferProjectToOrg(selectedProjectIdToTransfer, selectedOrgId);
      fetchOrgProjects(selectedOrgId);
      setShowTransferModal(false);
      setSelectedProjectIdToTransfer("");
      toast.success(t("toasts.projectTransferred", "Progetto trasferito con successo"));
    } catch (error) {
      console.error("Failed to transfer project:", error);
      toast.error(t("toasts.projectTransferError", "Errore durante il trasferimento del progetto"));
    } finally {
      setIsTransferring(false);
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
            <FaBuilding className="text-primary" aria-hidden="true" />
            {t("title", "Organizations")}
          </h1>
          <p className="text-sm opacity-70">
            {t("description", "Manage your organizations and their members.")}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <FaPlus aria-hidden="true" /> {t("createBtn", "New Organization")}
        </button>
      </div>

      {/* How orgs relate to projects/charts (Osservatorio feedback) */}
      <div className="mx-6 mb-2 rounded-lg bg-base-200 border border-base-300 p-4 text-sm text-base-content/80">
        {t(
          "help.intro",
          "Le organizzazioni servono a far collaborare un gruppo di persone sugli stessi progetti: tutti i membri vedono e possono modificare grafici, dashboard e sorgenti dati dei progetti associati all'organizzazione. Chi crea l'organizzazione ne è amministratore e può invitare membri via email, cambiarne il ruolo e associare o revocare progetti.",
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Orgs List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold px-2">{t("listTitle", "Your Organizations")}</h2>
          {loading ? (
            <Loading />
          ) : orgs.length === 0 ? (
            <div className="bg-base-200 rounded-lg p-10 text-center text-base-content">
              {t("noOrgs", "No organizations found.")}
            </div>
          ) : (
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {orgs.map((org) => {
                const isSelected = selectedOrgId === org.id;
                return (
                  <li key={org.id}>
                    <div
                      className={`card card-compact border transition-all ${isSelected
                        ? "bg-primary text-primary-content border-primary"
                        : "bg-base-100 hover:bg-base-200 border-base-200"
                        }`}
                    >
                      <div className="card-body flex-row items-center justify-between gap-2">
                        <button
                          type="button"
                          aria-expanded={isSelected}
                          aria-controls={`org-panel-${org.id}`}
                          onClick={() => setSelectedOrgId(org.id)}
                          className="flex items-center gap-3 overflow-hidden flex-grow text-left bg-transparent border-0 p-0 cursor-pointer"
                        >
                          {isSelected ? (
                            <FaChevronDown aria-hidden="true" />
                          ) : (
                            <FaChevronRight aria-hidden="true" />
                          )}
                          <span className="font-bold truncate">{org.name}</span>
                        </button>
                        {isAdminOf(org.id) && (
                          <button
                            type="button"
                            aria-label={t("actions.deleteOrg", {
                              name: org.name,
                              defaultValue: `Elimina organizzazione ${org.name}`,
                            })}
                            className={`btn btn-outline btn-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error ${isSelected ? "text-primary-content" : "text-base-content"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDeleteOrgId(org.id);
                            }}
                          >
                            <FaTrash aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Member & Project Management */}
        <div className="lg:col-span-2">
          {selectedOrgId ? (
            <section
              id={`org-panel-${selectedOrgId}`}
              role="region"
              aria-label={t("panelLabel", {
                name: orgs.find((o) => o.id === selectedOrgId)?.name ?? "",
                defaultValue: `Dettagli organizzazione ${orgs.find((o) => o.id === selectedOrgId)?.name ?? ""}`,
              })}
              className="card bg-base-100 shadow-xl border border-base-200"
            >
              <div className="card-body">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h2 className="card-title flex items-center gap-2">
                    <FaBuilding className="text-primary" aria-hidden="true" />
                    {orgs.find((o) => o.id === selectedOrgId)?.name}
                  </h2>
                  <div className="tabs tabs-boxed">
                    <button
                      className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
                      onClick={() => setActiveTab("members")}
                    >
                      <FaUsers className="mr-2" aria-hidden="true" /> {t("tabs.members", "Members")}
                    </button>
                    <button
                      className={`tab ${activeTab === "projects" ? "tab-active" : ""}`}
                      onClick={() => {
                        setActiveTab("projects");
                        fetchPersonalProjects();
                      }}
                    >
                      <FaFolderTree className="mr-2" aria-hidden="true" /> {t("tabs.projects", "Projects")}
                    </button>
                  </div>
                </div>

                {activeTab === "members" ? (
                  <>
                    <p className="text-sm text-base-content/70 mb-4">
                      {t(
                        "help.members",
                        "I membri con ruolo ADMIN possono invitare o rimuovere membri e gestire l'organizzazione; i membri USER accedono ai progetti associati senza poteri di amministrazione.",
                      )}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">{t("membersTitle", "Members")}</h3>
                      {selectedOrgId && isAdminOf(selectedOrgId) && (
                        <button type="button" className="btn btn-sm btn-outline btn-primary" onClick={() => setShowAddMemberModal(true)}>
                          <FaUserPlus aria-hidden="true" /> {t("addMemberBtn", "Add Member")}
                        </button>
                      )}
                    </div>

                    {membersLoading ? (
                      <Loading />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table w-full">
                          <thead>
                            <tr>
                              <th>{t("table.user", "User")}</th>
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
                                  <td>
                                    <div className="flex flex-col">
                                      <span className="font-semibold">{member.user?.email || member.userId}</span>
                                      {member.user?.email && <span className="text-[10px] opacity-40 font-mono uppercase tracking-tighter">{member.userId}</span>}
                                    </div>
                                  </td>
                                  <td>
                                    {selectedOrgId && isAdminOf(selectedOrgId) ? (
                                      <select
                                        className="select select-ghost select-xs font-bold"
                                        value={member.role}
                                        onChange={(e) => handleUpdateMemberRole(member.userId, e.target.value as "USER" | "ADMIN")}
                                      >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                      </select>
                                    ) : (
                                      <span className="text-xs font-bold opacity-70">{member.role}</span>
                                    )}
                                  </td>
                                  <td className="text-right">
                                    {selectedOrgId && isAdminOf(selectedOrgId) && (
                                      <button
                                        type="button"
                                        aria-label={t("actions.removeMember", {
                                          email: member.user?.email || member.userId,
                                          defaultValue: `Rimuovi membro ${member.user?.email || member.userId}`,
                                        })}
                                        className="btn btn-outline btn-xs"
                                        onClick={() => setPendingRemoveUserId(member.userId)}
                                      >
                                        <FaTrash aria-hidden="true" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm text-base-content/70 mb-4">
                      {t(
                        "help.projects",
                        "“Trasferisci Progetto” associa un tuo progetto personale a questa organizzazione: tutti i membri potranno vederlo e modificarlo. Non è una cessione di proprietà — resti proprietario e puoi revocare l'associazione in qualsiasi momento (icona ⇄ accanto al progetto); con la revoca il progetto torna personale.",
                      )}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">{t("projectsTitle", "Organization Projects")}</h3>
                      <button type="button" className="btn btn-sm btn-outline btn-primary" onClick={() => { fetchPersonalProjects(); setShowTransferModal(true); }}>
                        <FaRightLeft aria-hidden="true" /> {t("transferProjectBtn", "Transfer Project")}
                      </button>
                    </div>

                    {projectsLoading ? (
                      <Loading />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table w-full">
                          <thead>
                            <tr>
                              <th>{t("table.projectName", "Project Name")}</th>
                              <th>{t("table.projectId", "ID")}</th>
                              <th>{t("table.owner", "Owner")}</th>
                              <th className="text-right">{t("table.actions", "Actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="text-center py-10 opacity-50">
                                  {t("noProjects", "No projects associated with this organization.")}
                                </td>
                              </tr>
                            ) : (
                              projects.map((project) => (
                                <tr key={project.id} className="hover">
                                  <td className="font-semibold">{project.name}</td>
                                  <td className="font-mono text-xs opacity-50">{project.id}</td>
                                  <td>
                                    <div className="flex flex-col">
                                      <span className="text-xs">{project.owner?.email || t("unknownOwner", "Unknown")}</span>
                                    </div>
                                  </td>
                                  <td className="text-right">
                                    {project.ownerId === user?.userId && (
                                      <button
                                        type="button"
                                        className="btn btn-outline btn-xs"
                                        title={t("actions.revokeProject", "Revoke org access")}
                                        onClick={() => setPendingRevokeProjectId(project.id)}
                                      >
                                        <FaRightLeft aria-hidden="true" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>

                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-base-200/50 rounded-2xl border-2 border-dashed border-base-300 min-h-[400px]">
              <FaBuilding size={48} className="opacity-20 mb-4" aria-hidden="true" />
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

      {/* Transfer Project Modal */}
      <GenericDialog
        toggle={showTransferModal}
        title={t("modal.transferProjectTitle", "Transfer Personal Project")}
        description={t("modal.transferProjectDesc", "Select one of your personal projects to transfer to this organization.")}
        labels={{ cancel: t("modal.cancel", "Cancel"), confirm: t("modal.transfer", "Transfer") }}
        confirmCb={handleTransferProject}
        cancelCb={() => setShowTransferModal(false)}
      >
        <div className="space-y-4 py-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">{t("form.project", "Project")}</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedProjectIdToTransfer}
              onChange={(e) => setSelectedProjectIdToTransfer(e.target.value)}
            >
              <option value="" disabled>{t("form.selectProject", "Select a project")}</option>
              {personalProjects.length === 0 ? (
                <option disabled>{t("form.noPersonalProjects", "No personal projects found")}</option>
              ) : (
                personalProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))
              )}
            </select>
          </div>
          {isTransferring && <span className="loading loading-spinner mx-auto block"></span>}
        </div>
      </GenericDialog>

      {/* Revoke Project Confirmation */}
      <GenericDialog
        toggle={!!pendingRevokeProjectId}
        title={t("modal.revokeProjectTitle", "Revoke Org Access")}
        description={t("modal.revokeProjectDesc", "This will remove the project from this organization and return it to personal ownership. Are you sure?")}
        labels={{ cancel: t("modal.cancel", "Cancel"), confirm: t("modal.revoke", "Revoke") }}
        confirmCb={handleRevokeProjectFromOrg}
        cancelCb={() => setPendingRevokeProjectId(null)}
      >
        <div className="py-2">
          <p className="text-sm opacity-70">
            {t("modal.revokeProjectName", "Project")}: <span className="font-semibold">{projects.find((p) => p.id === pendingRevokeProjectId)?.name}</span>
          </p>
        </div>
      </GenericDialog>

    </Layout>
  );
}
