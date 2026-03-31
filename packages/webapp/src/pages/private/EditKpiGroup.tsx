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
import DataTable, { type TableColumn } from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { FaCog, FaInfo, FaPlus } from "react-icons/fa";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Layout from "../../components/layout";
import Loading from "../../components/layout/Loading";
import EditStepComponent from "../../components/EditStepComponent";
import GenericDialog from "../../components/layout/GenericDialog";
import registerDarkTheme from "../../components/layout/DataTableDarkTheme";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges";
import { HOME_ROUTE } from "../../router";
import useEditKpiGroupStore from "../../lib/store/kpi_store";
import { useSettingsStore } from "../../lib/store/settings_store";

registerDarkTheme();
import {
  KPI_FORM_ID,
  KpiForm,
  type KpiFormValues,
} from "./kpi-form";

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
// KPI Table
// ────────────────────────────────────────────────────────────────────────────
type KpiRow = KpiFormValues & { _index: number };

interface KpiTableProps {
  data: KpiFormValues[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

function KpiTable({ data, onEdit, onDelete }: KpiTableProps) {
  const { settings } = useSettingsStore();
  const currentTheme = settings?.preferredTheme === "dark" ? "dark" : "default";
  const actionColor = currentTheme === "dark" ? "#fff" : "#111";

  const rows: KpiRow[] = data.map((item, index) => ({ ...item, _index: index }));

  const columns: TableColumn<KpiRow>[] = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      grow: 1,
    },
    {
      name: "Actions",
      width: "90px",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="edit"
            className="btn btn-ghost btn-xs btn-square"
            onClick={(e) => { e.stopPropagation(); onEdit(row._index); }}
          >
            <FaPenToSquare fill={actionColor} size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="delete"
            className="btn btn-ghost btn-xs btn-square"
            onClick={(e) => { e.stopPropagation(); onDelete(row._index); }}
          >
            <FaTrashCan fill={actionColor} size={16} aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      theme={currentTheme}
      onRowClicked={(row) => onEdit(row._index)}
      highlightOnHover
      pointerOnHover
    />
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
    setName,
    setDescription,
    setPublish,
    showEditKpiFormModal,
    closeConfigFormModal,
    updateKpi,
    closeEditKpiFormModal,
    cancelDeleteModal,
    confirmDeleteModal,
    showDeleteKpiModal,
    addKpi,
    deleteModalVisible,
    editKpiGroupFormModalVisible,
    selectedKpi,
    selectedKpiIndex,
    name,
    description,
    publish,
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

  function handleFormSubmit(data: KpiFormValues) {
    if (editKpiGroupFormModalVisible) {
      updateKpi(data);
    } else {
      addKpi(data);
      setAddFormKey((k) => k + 1);
    }
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
          {name ? `: ${name}` : ""}
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
        <div className="flex gap-4">{name || "Edit KPI Group"}</div>
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
              isOpen={false}
              isDisabled={false}
              index={0}
            >
              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        id="kpigroup_visibility"
                        type="checkbox"
                        checked={publish ?? true}
                        onChange={() =>
                          setPublish(!(publish ?? true))
                        }
                        className="toggle toggle-sm toggle-primary cursor-pointer"
                      />
                      <label
                        htmlFor="kpigroup_visibility"
                        className="text-sm text-base-content/70 cursor-pointer"
                      >
                        {t("body.options.setup.form.fields.visibility.label")}
                      </label>
                      <span className="text-sm text-base-content font-bold">
                        {t(
                          `body.options.setup.form.fields.visibility.values.${(publish ?? true) ? "public" : "private"}`,
                        )}
                      </span>
                    </div>
                    <label
                      htmlFor="kpigroup_title"
                      className="mt-4 text-base-content/70"
                    >
                      {t("body.options.setup.form.fields.title.label")}
                    </label>
                    <input
                      id="kpigroup_title"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input input-bordered py-2 px-3 w-full bg-base-100 placeholder:text-base-content/40"
                    />
                    <label
                      htmlFor="kpigroup_description"
                      className="mt-4 text-base-content/70"
                    >
                      {t("body.options.setup.form.fields.description.label")}
                    </label>
                    <textarea
                      id="kpigroup_description"
                      value={description ?? ""}
                      rows={3}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t(
                        "body.options.setup.form.fields.description.placeholder",
                      )}
                      className="input textarea input-bordered input-sm w-full bg-base-100 placeholder:text-base-content/40"
                    />
                  </div>
                </div>
              </div>
            </EditStepComponent>

            <EditStepComponent
              title={t("body.options.configuration.title")}
              Icon={FaCog}
              isOpen={false}
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
          <div className="xl:col-span-4 flex flex-col h-full p-10 bg-base-100 border border-base-300 rounded-lg ]">

            {kpiGroup.dataSource.length > 0 ? (
              <RenderChart {...kpiGroup} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="italic text-base-content/60">
                  {t("body.messages.noKpi")}
                </p>
              </div>
            )}


            {kpiGroup.dataSource.length > 0 && (
              <div className="mb-6">
                <KpiTable
                  data={kpiGroup.dataSource}
                  onEdit={showEditKpiFormModal}
                  onDelete={showDeleteKpiModal}
                />
              </div>
            )}

            <EditStepComponent
              title={t("body.actions.addKpi.label")}
              Icon={FaPlus}
              isOpen={loaded}
              isDisabled={!loaded}
              index={2}
            >


              <div className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <KpiForm
                    key={editKpiGroupFormModalVisible ? `edit-${selectedKpiIndex}` : addFormKey}
                    initialValues={editKpiGroupFormModalVisible ? selectedKpi : undefined}
                    onSubmit={handleFormSubmit}
                  />
                  <div className="mt-4 flex gap-2">
                    {editKpiGroupFormModalVisible && (
                      <button
                        type="button"
                        onClick={closeEditKpiFormModal}
                        className="btn btn-outline"
                      >
                        {t("body.actions.cancelEdit.label")}
                      </button>
                    )}
                    <button type="submit" form={KPI_FORM_ID} className="btn btn-primary">
                      {editKpiGroupFormModalVisible
                        ? t("body.actions.updateKpi.label")
                        : `${t("body.actions.addKpi.label")} +`}
                    </button>
                  </div>
                </div>
              </div>
            </EditStepComponent>


          </div>
        </div>


      </div>

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
