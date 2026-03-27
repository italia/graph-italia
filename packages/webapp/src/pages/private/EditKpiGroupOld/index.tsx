import { RenderChart } from "dataviz-components";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Layout from "../../../components/layout";
import GenericDialog from "../../../components/layout/GenericDialog";
import Loading from "../../../components/layout/Loading";
import { useConfirmNavigation } from "../../../hooks/use-confirm-navigation";
import { HOME_ROUTE } from "../../../router";
import {
  KPI_FORM_ID,
  KpiForm,
  type KpiFormValues,
} from "./kpi-form";
import useEditKpiGroupStore from "../../../lib/store/kpi_store";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";
import type { ChartConfigType } from "dataviz-components";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";

type KpiGroupConfigType = Pick<
  ChartConfigType,
  | "direction"
  | "h"
  | "labeLine"
  | "legend"
  | "legendPosition"
  | "palette"
  | "tooltip"
  | "tooltipFormatter"
  | "valueFormatter"
  | "totalLabel"
  | "tooltipTrigger"
  | "colors"
  | "background"
>;

const defaultValues: KpiGroupConfigType = {
  direction: "vertical",
  h: 0,
  labeLine: false,
  legend: false,
  legendPosition: "",
  palette: [] as string[],
  tooltip: false,
  tooltipFormatter: "",
  valueFormatter: "",
  totalLabel: "",
  tooltipTrigger: "",
  colors: [],
  background: "",
};

export type KpiGroupConfigFormValues = typeof defaultValues;

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
  const { register, control, reset, getValues, watch, setValue } = useForm({
    defaultValues: {
      ...defaultValues,
      ...props.config,
    },
  });

  const legendValue = watch("legend");
  const tooltipValue = watch("tooltip");

  useEffect(() => {
    if (!legendValue) {
      setValue("legendPosition", "");
    }
  }, [legendValue, setValue]);

  useEffect(() => {
    if (!tooltipValue) {
      setValue("tooltipFormatter", "");
      setValue("tooltipTrigger", "");
    }
  }, [tooltipValue, setValue]);

  useImperativeHandle(ref, () => ({
    getFormData: () => getValues(),
    resetForm: () => reset(),
  }));

  return (
    <div className="w-full">
      <div className="">
        <div className="p-6 space-y-6">
          {/* Direction - register */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.direction.label")}
              </span>
            </label>
            <select
              {...register("direction")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="vertical">
                {t("form.fields.direction.values.vertical")}
              </option>
              <option value="horizontal">
                {t("form.fields.direction.values.horizontal")}
              </option>
            </select>
          </div>

          {/* Height - register con valueAsNumber */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.height.label")}
              </span>
            </label>
            <input
              {...register("h", { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LabelLine - register */}
          <div className="flex items-center">
            <input
              {...register("labeLine")}
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              <span className="label-text font-medium">
                {" "}
                {t("form.fields.labelLine.label")}
              </span>
            </label>
          </div>

          {/* Legend - register */}
          <div className="flex items-center">
            <input
              {...register("legend")}
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              <span className="label-text font-medium">
                {" "}
                {t("form.fields.legend.label")}
              </span>
            </label>
          </div>

          {/* Legend Position - register - visible only when legend is true */}
          {legendValue && (
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  {" "}
                  {t("form.fields.legendPosition.label")}
                </span>
              </label>
              <select
                {...register("legendPosition")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {t("form.fields.legendPosition.values.noValue")}
                </option>
                <option value="top">
                  {t("form.fields.legendPosition.values.top")}
                </option>
                <option value="bottom">
                  {t("form.fields.legendPosition.values.bottom")}
                </option>
                <option value="left">
                  {t("form.fields.legendPosition.values.left")}
                </option>
                <option value="right">
                  {t("form.fields.legendPosition.values.right")}
                </option>
              </select>
            </div>
          )}

          {/* Palette - Controller per trasformazione array */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.palette.label")}
              </span>
            </label>
            <Controller
              name="palette"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                  placeholder="es: red, blue, green"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </div>

          {/* Tooltip - register */}
          <div className="flex items-center">
            <input
              {...register("tooltip")}
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.tooltip.label")}
              </span>
            </label>
          </div>

          {/* Tooltip Formatter - register - visible only when tooltip is true */}
          {tooltipValue && (
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  {t("form.fields.tooltipFormatter.label")}
                </span>
              </label>
              <input
                {...register("tooltipFormatter")}
                type="text"
                placeholder="es: {b}: {c}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Tooltip Trigger - register - visible only when tooltip is true */}
          {tooltipValue && (
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  {t("form.fields.tooltipTrigger.label")}
                </span>
              </label>
              <select
                {...register("tooltipTrigger")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {t("form.fields.tooltipTrigger.values.noValue")}
                </option>
                <option value="item">
                  {t("form.fields.tooltipTrigger.values.item")}
                </option>
                <option value="axis">
                  {t("form.fields.tooltipTrigger.values.axis")}
                </option>
              </select>
            </div>
          )}

          {/* Value Formatter - register */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.valueFormatter.label")}
              </span>
            </label>
            <input
              {...register("valueFormatter")}
              type="text"
              placeholder="es: {c}%"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total Label - register */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.totalLabel.label")}
              </span>
            </label>
            <input
              {...register("totalLabel")}
              type="text"
              placeholder="es: Totale"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Colors - Controller per trasformazione array */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.colors.label")}
              </span>
            </label>
            <Controller
              name="colors"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  value={field.value.join(",")}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                  placeholder="es: #ff0000, #00ff00, #0000ff"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </div>

          {/* Background - Controller per sincronizzare text e color input */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                {t("form.fields.background.label")}
              </span>
            </label>
            <Controller
              name="background"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="color"
                    value={field.value || "#FFFFFF"}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

KpiConfigForm.displayName = "KpiConfigForm";

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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
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

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-xs btn-primary btn-outline m-1"
      >
        {title}
      </button>

      {isOpen && (
        <ul className="menu absolute top-full left-0 mt-1 bg-base-300 rounded-box z-10 w-32 p-2 shadow-lg border">
          <li>
            <span className="text-sm" onClick={handleEdit}>
              <BsPencilFill />
              {t("actions.edit.label")}
            </span>
          </li>
          <li>
            <span className="text-sm" onClick={handleDelete}>
              <BsFillTrashFill />
              {t("actions.delete.label")}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}

function EditKpiGroup() {
  const { t } = useTranslation("pages", {
    keyPrefix: "charts.editKpiGroup",
  });
  const { id } = useParams();
  const kpiConfigFormRef = useRef<KpiConfigFormHandle>(null);
  const {
    load,
    reload,
    save,
    showAddKpiFormModal,
    showEditKpiFormModal,
    addKpi,
    updateKpi,
    closeKpiGroupFormModal,
    showConfigFormModal,
    closeConfigFormModal,
    closeEditKpiFormModal,
    cancelDeleteModal,
    confirmDeleteModal,
    showDeleteKpiModal,
    deleteModalVisible,
    configModalVisible,
    addKpiFormModalVisible,
    editKpiGroupFormModalVisible,
    selectedKpi,
    vm,
    kpiGroup,
    isLoading,
    loaded,
    error,
    pendingChanges,
  } = useEditKpiGroupStore();

  const {
    showModal: showConfirmNavigationModal,
    confirm: confirmNavigationModal,
    cancel: cancelNavigationModal,
  } = useConfirmNavigation(pendingChanges);

  function changeConfigHandler() {
    showConfigFormModal();
  }

  function addKpiHandler() {
    showAddKpiFormModal();
  }

  function editKpiHandler(index: number) {
    showEditKpiFormModal(index);
  }

  function deleteKpiHandler(index: number) {
    showDeleteKpiModal(index);
  }

  function saveKpiHandler(data: KpiFormValues) {
    addKpi(data);
  }

  function updateKpiHandler(data: KpiFormValues) {
    updateKpi(data);
  }

  async function saveHandler() {
    const response = await save();
    if (response) {
      reload();
    }
  }

  function resetHandler() {
    reload();
  }

  useEffect(() => {
    if (id) {
      load(id);
    }
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <Link to={HOME_ROUTE} className="text-blue-500 hover:underline">
            {/* &lt; Torna alla lista */}
            &lt; {t("header.actions.back.label")}
          </Link>
          <div className="ml-auto flex space-x-2">
            <button onClick={resetHandler} className="btn btn-danger">
              &lt; {t("header.actions.reset.default")}
            </button>
            <button onClick={saveHandler} className="btn btn-primary">
              &lt; {t("header.actions.save.default")}
            </button>
          </div>
        </div>
        {isLoading && <Loading />}
        {error && (
          <div role="alert" className="alert alert-error">
            {error.message}
          </div>
        )}
        {loaded && (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">{vm.name}</h1>
                <h4 className="text-xl">{vm.description}</h4>
              </div>
              <div>
                <button
                  className="btn btn-secondary mr-4"
                  onClick={changeConfigHandler}
                >
                  {t("body.actions.changeConfiguration.label")}
                </button>
                <button className="btn btn-primary" onClick={addKpiHandler}>
                  {t("body.actions.addKpi.label")} +
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center">
              {kpiGroup.dataSource.map(
                (
                  ds: {
                    title: string;
                  },
                  index: number,
                ) => (
                  <div key={`${ds.title}-${index}`} className="flex my-4 gap-4">
                    <KpiDropdown
                      title={ds.title}
                      onEdit={() => editKpiHandler(index)}
                      onDelete={() => deleteKpiHandler(index)}
                    />
                  </div>
                ),
              )}
            </div>
            <div className="relative border min-h-[60vh]">
              {kpiGroup.dataSource.length === 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                  {/* Nessun KPI presente. Aggiungi un nuovo KPI. */}
                  {t("body.messages.noKpi")}
                </div>
              )}
              {kpiGroup.dataSource.length > 0 && (
                <div className="p-4 space-y-4">
                  <div className="p-4 border rounded-md shadow-sm">
                    <RenderChart {...kpiGroup}></RenderChart>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {addKpiFormModalVisible && (
          <GenericDialog
            toggle={addKpiFormModalVisible}
            title={t("modals.addKpiForm.title")}
            confirmCb={() => {
              document
                .getElementById(KPI_FORM_ID)
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true }),
                );
            }}
            cancelCb={() => {
              closeKpiGroupFormModal();
            }}
          >
            <KpiForm onSubmit={saveKpiHandler} />
          </GenericDialog>
        )}
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
            cancelCb={() => {
              closeEditKpiFormModal();
            }}
          >
            <KpiForm onSubmit={updateKpiHandler} initialValues={selectedKpi} />
          </GenericDialog>
        )}
        {configModalVisible && (
          <GenericDialog
            toggle={configModalVisible}
            title={t("modals.config.title")}
            confirmCb={() => {
              const formData = kpiConfigFormRef.current?.getFormData();
              console.log("Configurazione KPI Group:", formData);
              closeConfigFormModal(formData);
            }}
            cancelCb={() => {
              closeConfigFormModal();
            }}
          >
            <KpiConfigForm ref={kpiConfigFormRef} config={kpiGroup.config} />
          </GenericDialog>
        )}
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
        {showConfirmNavigationModal && (
          <GenericDialog
            toggle={showConfirmNavigationModal}
            title={t("modals.showConfirmNavigation.title")}
            confirmCb={confirmNavigationModal}
            cancelCb={cancelNavigationModal}
          >
            {/* <p>Sei sicuro di voler uscire senza salvare le modifiche?</p> */}
            <p>{t("modals.showConfirmNavigation.message")}</p>
          </GenericDialog>
        )}
      </div>
    </Layout>
  );
}

export default EditKpiGroup;
