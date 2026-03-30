import "dataviz-components/dist/style.css";
import type { ChartConfigType } from "dataviz-components";
import { RenderChart } from "dataviz-components";
import { useForm } from "react-hook-form";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { FaCog, FaInfo, FaPlus } from "react-icons/fa";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import EditStepComponent from "../../components/EditStepComponent";
import GenericDialog from "../../components/layout/GenericDialog";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import { HOME_ROUTE } from "../../router";
import useEditKpiGroupStore from "../../lib/store/kpi_store";
import {
  KPI_FORM_ID,
  KpiForm,
  type KpiFormValues,
} from "./EditKpiGroupOld/kpi-form";

// ────────────────────────────────────────────────────────────────────────────
// KPI Group Config Form
// ────────────────────────────────────────────────────────────────────────────
type KpiGroupConfigType = Pick<
  ChartConfigType,
  | "direction"
  | "background"
>;

const configDefaultValues: KpiGroupConfigType = {
  direction: "vertical",
  background: "",
};

export type KpiGroupConfigFormValues = typeof configDefaultValues;

export interface KpiConfigFormHandle {
  getFormData: () => KpiGroupConfigFormValues;
  resetForm: () => void;
}

const KpiConfigForm = forwardRef<
  KpiConfigFormHandle,
  { config: KpiGroupConfigType }
>((props, ref) => {
  const { t } = useTranslation("pages", {
    keyPrefix: "charts.editKpiGroup.components.kpiConfigForm",
  });
  const { register, reset, getValues, } = useForm({
    defaultValues: {
      ...configDefaultValues,
      ...props.config,
    },
  });

  useImperativeHandle(ref, () => ({
    getFormData: () => getValues(),
    resetForm: () => reset(),
  }));

  return (
    <div className="w-full space-y-4">
      <div>
        <label htmlFor="kpi_direction" className="label">
          <span className="label-text font-medium">
            {t("form.fields.direction.label")}
          </span>
        </label>
        <select
          id="kpi_direction"
          {...register("direction")}
          className="input input-bordered w-full"
        >
          <option value="vertical">
            {t("form.fields.direction.values.vertical")}
          </option>
          <option value="horizontal">
            {t("form.fields.direction.values.horizontal")}
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="kpi_background" className="label">
          <span className="label-text font-medium">
            {t("form.fields.background.label")}
          </span>
        </label>
        <select
          id="kpi_background"
          {...register("background")}
          className="input input-bordered w-full"
        >
          <option value="">
            {t("form.fields.background.values.theme")}
          </option>
          <option value="accent">
            {t("form.fields.background.values.accent")}
          </option>
        </select>

      </div>
    </div>
  );
});

KpiConfigForm.displayName = "KpiConfigForm";

// ────────────────────────────────────────────────────────────────────────────
// KPI Dropdown
// ────────────────────────────────────────────────────────────────────────────
interface KpiDropdownProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

function KpiDropdown({ title, onEdit, onDelete }: KpiDropdownProps) {
  const { t } = useTranslation("pages", {
    keyPrefix: "charts.editKpiGroup.components.kpiDropdown",
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-xs btn-primary btn-outline m-1"
      >
        {title}
      </button>

      {isOpen && (
        <ul className="menu absolute top-full left-0 mt-1 bg-base-300 rounded-box z-10 w-32 p-2 shadow-lg border">
          <li>
            <button
              type="button"
              className="text-sm"
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
            >
              <BsPencilFill />
              {t("actions.edit.label")}
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-sm"
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
            >
              <BsFillTrashFill />
              {t("actions.delete.label")}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────
function EditKpiGroupPage() {
  const { t } = useTranslation("pages", { keyPrefix: "charts.editKpiGroup" });
  const { id } = useParams();
  const navigate = useNavigate();
  const kpiConfigFormRef = useRef<KpiConfigFormHandle>(null);
  const [addFormKey, setAddFormKey] = useState(0);

  const {
    load,
    reload,
    save,
    showEditKpiFormModal,
    updateKpi,
    closeEditKpiFormModal,
    closeConfigFormModal,
    cancelDeleteModal,
    confirmDeleteModal,
    showDeleteKpiModal,
    addKpi,
    deleteModalVisible,
    editKpiGroupFormModalVisible,
    selectedKpi,
    vm,
    kpiGroup,
    isLoading,
    loaded,
    error,
    pendingChanges,
  } = useEditKpiGroupStore();

  useUnsavedChanges(pendingChanges, t("unsavedChanges"));

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  async function saveHandler() {
    try {
      const ok = await save();
      if (ok) {
        toast.success(t("header.actions.save.success") || "Saved!");
        reload();
      }
    } catch {
      toast.error(t("header.actions.save.error") || "Error saving");
    }
  }

  function handleAddKpi(data: KpiFormValues) {
    addKpi(data);
    setAddFormKey((k) => k + 1);
  }

  function handleApplyConfig() {
    const formData = kpiConfigFormRef.current?.getFormData();
    if (formData) closeConfigFormModal(formData);
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <Loading />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>
          {t("head.title.label")}
          {vm.name ? `: ${vm.name}` : ""}
        </title>
      </Helmet>

      {/* Top bar */}
      <div className="w-full flex justify-between items-center gap-2 mb-4 bg-base-300 py-4 px-10 rounded-lg">
        <button
          type="button"
          onClick={() => navigate(HOME_ROUTE)}
          className="btn btn-outline"
        >
          {t("header.actions.back.label")}
        </button>
        <div className="flex gap-4">{vm.name || "Edit KPI Group"}</div>
        <button
          type="button"
          onClick={saveHandler}
          disabled={!pendingChanges}
          className="btn btn-primary"
        >
          {t("header.actions.save.default")}
        </button>
      </div>

      {error && (
        <div role="alert" className="alert alert-error mb-4">
          {error.message}
        </div>
      )}

      <div className="mx-auto">
        <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
          {/* Left: Info + Config steps */}
          <div className="space-y-1 xl:col-span-2">
            <EditStepComponent
              title={t("body.options.setup.title")}
              Icon={FaInfo}
              isOpen={true}
              isDisabled={false}
              index={0}
            >
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <h1 className="text-2xl font-bold">{vm.name}</h1>
                  {vm.description && (
                    <p className="text-base-content/70">{vm.description}</p>
                  )}
                </div>
              </div>
            </EditStepComponent>

            <EditStepComponent
              title={t("body.options.configuration.title")}
              Icon={FaCog}
              isOpen={loaded}
              isDisabled={!loaded}
              index={1}
            >
              {loaded && (
                <div className="card bg-base-100 shadow-sm border border-base-200">
                  <div className="card-body">
                    <KpiConfigForm
                      ref={kpiConfigFormRef}
                      config={kpiGroup.config}
                    />
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleApplyConfig}
                        className="btn btn-primary btn-sm"
                      >
                        {t("body.actions.changeConfiguration.label")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </EditStepComponent>
          </div>

          {/* Right: Preview */}
          <div className="xl:col-span-4 flex flex-col h-full p-10 bg-base-100 border border-base-300 rounded-lg min-h-[500px]">
            {kpiGroup.dataSource.length > 0 ? (
              <RenderChart {...kpiGroup} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="italic text-base-content/60">
                  {t("body.messages.noKpi")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Full-width: KPI management step */}
        <div className="mt-4">
          <EditStepComponent
            title={t("body.actions.addKpi.label")}
            Icon={FaPlus}
            isOpen={loaded}
            isDisabled={!loaded}
            index={2}
          >
            {kpiGroup.dataSource.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-6 mb-6 border-b border-base-200">
                {kpiGroup.dataSource.map(
                  (ds: { title: string }, index: number) => (
                    <KpiDropdown
                      key={`${ds.title}-${index}`}
                      title={ds.title}
                      onEdit={() => showEditKpiFormModal(index)}
                      onDelete={() => showDeleteKpiModal(index)}
                    />
                  ),
                )}
              </div>
            )}

            {/* Hidden when edit modal is open to avoid form id conflict */}
            {!editKpiGroupFormModalVisible && (
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <KpiForm key={addFormKey} onSubmit={handleAddKpi} />
                  <div className="mt-4">
                    <button
                      type="submit"
                      form={KPI_FORM_ID}
                      className="btn btn-primary"
                    >
                      {t("body.actions.addKpi.label")} +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </EditStepComponent>
        </div>
      </div>

      {/* Edit KPI Modal */}
      {editKpiGroupFormModalVisible && (
        <GenericDialog
          toggle={editKpiGroupFormModalVisible}
          title={t("modals.editKpiForm.title")}
          confirmCb={() => {
            document
              .getElementById(KPI_FORM_ID)
              ?.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true }),
              );
          }}
          cancelCb={closeEditKpiFormModal}
        >
          <KpiForm onSubmit={updateKpi} initialValues={selectedKpi} />
        </GenericDialog>
      )}

      {/* Delete KPI Modal */}
      {deleteModalVisible && (
        <GenericDialog
          toggle={deleteModalVisible}
          title={t("modals.delete.title")}
          confirmCb={confirmDeleteModal}
          cancelCb={cancelDeleteModal}
        >
          <p>
            {t("modals.delete.message")} {selectedKpi?.title}?
          </p>
        </GenericDialog>
      )}
    </Layout>
  );
}

export default EditKpiGroupPage;
