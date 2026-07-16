import { useMachine } from "@xstate/react";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaCog, FaDatabase, FaInfo } from "react-icons/fa";
import { startTransition, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { HOME_ROUTE, ROUTES } from "../../router.tsx";
import Layout from "../../components/layout/index.tsx";
import Loading from "../../components/layout/Loading.tsx";
import ChooseLoader from "../../components/load-data/ChooseLoader.tsx";
import EditStepComponent from "../../components/EditStepComponent.tsx";
import { useUnsavedChanges } from "../../hooks/useUnsavedChanges.tsx";
import TransformDataTable from "../../components/load-data/TransformDataTable.tsx";
import stepMachine from "../../lib/stepMachine.ts";
import * as api from "../../lib/api.ts";
import useDatasourceEditStore from "../../lib/store/datasourceEditStore.ts";
import type { MatrixType } from "../../types";
import DataHelper from "../../components/load-data/DataHelper.tsx";

export default function EditDataSource() {
  const { t } = useTranslation("pages", { keyPrefix: "charts.editChart" });
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [state, send] = useMachine(stepMachine);

  const {
    id,
    data,
    isRemote,
    remoteUrl,
    isTrasposed,
    setData,
    setIsRemote,
    setRemoteUrl,
    setIsTrasposed,
    loadItem,
    resetItem,
  } = useDatasourceEditStore((s) => s);

  const [currentData, setCurrentData] = useState<MatrixType | null>(null);
  const [loading, setLoading] = useState(true);
  const [dsName, setDsName] = useState("");
  const [dsDescription, setDsDescription] = useState("");
  const [dsPublish, setDsPublish] = useState(api.isPublishingEnabled());
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [stepAnnouncement, setStepAnnouncement] = useState("");
  const seriesSelectorRef = useRef<HTMLDivElement>(null);
  const configurationHeadingRef = useRef<HTMLHeadingElement>(null);

  useUnsavedChanges(hasUnsavedChanges, t("unsavedChanges"));

  useEffect(() => {
    if (!loading) setHasUnsavedChanges(false);
  }, [loading]);

  useEffect(() => {
    async function loadExisting() {
      if (paramId) {
        setLoading(true);
        try {
          const ds = await api.getDatasource(paramId);
          if (ds) {
            loadItem({ ...ds, id: paramId });
            setDsName(ds.name ?? "");
            setDsDescription(ds.description ?? "");
            setDsPublish(api.isPublishingEnabled() ? (ds.publish ?? true) : false);
            if (ds.data && Array.isArray(ds.data) && ds.data.length > 0) {
              send({ type: "CONFIG" });
            }
          }
        } catch (err) {
          console.error("Error loading datasource:", err);
        } finally {
          setLoading(false);
        }
      } else {
        resetItem();
        setDsName("");
        setDsDescription("");
        setDsPublish(api.isPublishingEnabled());
        setLoading(false);
      }
    }
    loadExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  const haveData = data && data[0]?.length > 0;
  const isConfigStep = state.matches("config");
  const currentStepIndex = state.matches("config") ? 1 : 0;

  useEffect(() => {
    if (loading) return;
    if (isConfigStep) {
      setStepAnnouncement(t("body.options.configuration.announcement"));
    } else if (currentData && !haveData) {
      setStepAnnouncement(t("body.preview.seriesSelector.announcement"));
    }
  }, [isConfigStep, currentData, haveData, loading, t]);

  function handleUpload(d: MatrixType) {
    setHasUnsavedChanges(true);
    setCurrentData(d);
  }

  function handleSetRemoteData(d: { remoteUrl: string; data: MatrixType }) {
    setHasUnsavedChanges(true);
    setIsRemote(true);
    setRemoteUrl(d.remoteUrl);
    setCurrentData(d.data);
  }

  const getDefaultName = () =>
    `datasource-${dayjs(Date.now()).format("YYYY-MM-DD_HH-mm")}`;

  async function saveData() {
    const finalName = dsName || getDefaultName();
    const payload = {
      name: finalName,
      description: dsDescription,
      publish: api.isPublishingEnabled() ? dsPublish : false,
      data: data ?? [],
      isRemote,
      remoteUrl,
      isTrasposed,
    };

    setIsSaving(true);
    setSaveStatus("");
    try {
      const result = await api.upsertDatasource(payload, paramId || id || "");
      if (result) {
        setHasUnsavedChanges(false);
        toast.success(t("save.success.label"));
        setSaveStatus(t("save.success.label"));
        if (!paramId && result.id) {
          navigate(ROUTES.editDataSource(result.id), { replace: true });
        }
      }
    } catch (err) {
      console.error("Error saving datasource:", err);
      toast.error(t("save.error.label"));
      setSaveStatus(t("save.error.label"));
    } finally {
      setIsSaving(false);
    }
  }

  const rowCount = data ? data.length - 1 : 0;
  const colCount = data?.[0]?.length ?? 0;

  if (loading) {
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
        <title>Data Source{dsName ? `: ${dsName}` : ""}</title>
      </Helmet>

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {saveStatus}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {stepAnnouncement}
      </div>

      {/* Header bar */}
      <div className="w-full flex justify-between items-center gap-2 mb-2 py-6 px-4 lg:px-10">
        <button
          type="button"
          onClick={() => navigate(HOME_ROUTE)}
          className="btn btn-outline"
        >
          {t("header.actions.back.label")}
        </button>
        <h1 className="text-xl font-bold">
          {paramId ? "Edit Data Source" : "New Data Source"}
        </h1>
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={saveData}
            disabled={!hasUnsavedChanges || isSaving}
            className="btn btn-primary gap-2"
          >
            {isSaving ? (
              <span role="status">
                <span className="loading loading-spinner loading-sm" />
                {t("header.actions.save.isSaving")}...
              </span>
            ) : (
              t("header.actions.save.default")
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto">
        <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
          {/* Left column — steps */}
          <div className="space-y-1 xl:col-span-2">

            {/* Step 0: Setup */}
            <EditStepComponent
              title={t("body.options.setup.title")}
              description={t("body.options.setup.description")}
              Icon={FaInfo}
              isOpen={true}
              isDisabled={false}
              index={0}
            >
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <div className="flex flex-col space-y-2">
                    {api.isPublishingEnabled() && (
                      <div className="flex items-center gap-4">
                        <input
                          id="ds_visibility"
                          type="checkbox"
                          role="switch"
                          checked={dsPublish}
                          onChange={() => {
                            setHasUnsavedChanges(true);
                            setDsPublish((v) => !v);
                          }}
                          className="toggle toggle-sm toggle-primary cursor-pointer"
                        />
                        <label htmlFor="ds_visibility" className="text-sm text-base-content/70 cursor-pointer">
                          {t("body.options.setup.form.fields.visibility.label")}
                        </label>
                        <span className="text-sm text-base-content font-bold">
                          {t(
                            `body.options.setup.form.fields.visibility.values.${dsPublish ? "public" : "private"}`,
                          )}
                        </span>
                      </div>
                    )}
                    <label htmlFor="ds_title" className="mt-4 text-base-content/70">
                      {t("body.options.setup.form.fields.title.label")}
                    </label>
                    <input
                      id="ds_title"
                      type="text"
                      value={dsName}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setDsName(e.target.value);
                      }}
                      placeholder={getDefaultName()}
                      className="input input-bordered py-2 px-3 w-full bg-base-100 placeholder:text-base-content/40"
                    />
                    <label htmlFor="ds_description" className="mt-4 text-base-content/70">
                      {t("body.options.setup.form.fields.description.label")}
                    </label>
                    <textarea
                      id="ds_description"
                      value={dsDescription}
                      rows={3}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setDsDescription(e.target.value);
                      }}
                      placeholder={t("body.options.setup.form.fields.description.placeholder")}
                      className="input textarea input-bordered input-sm w-full bg-base-100 placeholder:text-base-content/40"
                    />
                  </div>
                </div>
              </div>
            </EditStepComponent>

            {/* Step 1: Config (datasource-specific options) */}
            <EditStepComponent
              title={t("body.options.configuration.title")}
              description={t("body.options.configuration.description")}
              Icon={FaCog}
              isOpen={currentStepIndex > 0}
              isDisabled={currentStepIndex === 0}
              index={2}
              headingRef={configurationHeadingRef}
            >
              {isConfigStep ? (
                <div className="card bg-base-100 shadow-sm border border-base-300">
                  <div className="card-body space-y-4">
                    {/* isTrasposed toggle */}
                    <div className="flex items-center gap-4">
                      <input
                        id="ds_transposed"
                        type="checkbox"
                        role="switch"
                        checked={isTrasposed}
                        onChange={() => {
                          setHasUnsavedChanges(true);
                          setIsTrasposed(!isTrasposed);
                        }}
                        className="toggle toggle-sm toggle-secondary cursor-pointer"
                      />
                      <label htmlFor="ds_transposed" className="cursor-pointer">
                        <span className="text-sm font-medium">Transposed</span>
                        <p className="text-xs text-base-content/60">
                          Swap rows and columns when consuming this data source
                        </p>
                      </label>
                    </div>
                    {/* Data stats */}
                    {haveData && (
                      <div className="text-sm text-base-content/70">
                        <span className="font-semibold">{rowCount}</span> rows ×{" "}
                        <span className="font-semibold">{colCount}</span> columns
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div role="status" className="text-sm text-base-content/60 px-2">
                  {currentData && !haveData
                    ? t("body.options.configuration.statusAwaitingSeries")
                    : t("body.options.configuration.status")}
                </div>
              )}
            </EditStepComponent>

            {/* Step 2: Data loading */}
            <EditStepComponent
              title={t("body.options.data.title")}
              description={t("body.options.data.description")}
              Icon={FaDatabase}
              isOpen={currentStepIndex === 0}
              isDisabled={false}
              index={1}
            >
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <ChooseLoader
                    handleUpload={handleUpload}
                    remoteUrl={remoteUrl}
                    handleSetRemoteData={handleSetRemoteData}
                  />
                </div>
              </div>
            </EditStepComponent>
          </div>

          {/* Right column — data preview */}
          <section
            aria-labelledby="ds-preview-heading"
            className="xl:col-span-4 flex flex-col h-full p-10 bg-base-100 border border-base-300 rounded-lg"
          >
            <div className="bg-base-100 flex flex-col gap-4 min-h-[500px]">
              <div>
                <h2 id="ds-preview-heading" className="text-2xl font-bold">
                  {t("header.preview.heading")}
                  {dsName ? `: ${dsName}` : ""}
                </h2>
                {dsDescription && (
                  <div
                    className="text-base-content/80"
                    dangerouslySetInnerHTML={{
                      __html: dsDescription.replace(/\n/g, "<br />"),
                    }}
                  />
                )}
              </div>

              {!haveData ? (
                <div>
                  <p className="italic text-base-content" role="status">
                    {t("body.preview.loadDataMessage")}
                  </p>
                  {currentData && (
                    <div
                      ref={seriesSelectorRef}
                      tabIndex={-1}
                      aria-labelledby="series-selector-heading"
                      className="card bg-base-100 shadow-sm border border-base-300"
                    >
                      <div className="card-body">
                        <h3 id="series-selector-heading" className="text-lg font-semibold">
                          {t("body.preview.seriesSelector.title")}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {t("body.preview.seriesSelector.description")}
                        </p>
                        <DataHelper
                          rawData={currentData ?? data}
                          setData={(d) => {
                            setData(d);
                            setHasUnsavedChanges(true);
                            send({ type: "CONFIG" });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div id="ds-data-table" className="overflow-auto flex-1 min-h-0">
                  <TransformDataTable
                    currentData={data}
                    handleTransformData={(d) => {
                      startTransition(() => {
                        setData(d);
                        setHasUnsavedChanges(true);
                        setCurrentData(d);
                      });
                    }}
                    onReset={() => {
                      setData(null);
                      setCurrentData(null);
                      send({ type: "INPUT" });
                    }}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
