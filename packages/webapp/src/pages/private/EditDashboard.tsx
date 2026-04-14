import {
  ColorSchemeProvider,
  RenderChart,
  type FieldDataType,
} from "dataviz-components";
import React, { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { FaInfo } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import EditStepComponent from "../../components/EditStepComponent";
import AppLayout from "../../components/layout";
import Dialog from "../../components/layout/Dialog";
import Loading from "../../components/layout/Loading";
import * as api from "../../lib/api";
import useDashboardEditStore, {
  type ChartLookup,
  type TChartRef,
  type TLayoutItem,
} from "../../lib/store/dashboard-edit.store";
import { useSettingsStore } from "../../lib/store/settings_store";
import { HOME_ROUTE, ROUTES } from "../../router";

// ─── Grid constants ───────────────────────────────────────────────────────────
// 12 cols everywhere (bootstrap-style). User picks conceptual spans 1–3.
// lg:  span-1 = 4 units (1/3), span-2 = 8 units (2/3), span-3 = 12 (full)
// md:  span-1 = 6 units (1/2), span-2 = 12 (full),     span-3 = 12 (full)
// sm+: always 12 units (full width)

const TOTAL_COLS = 12;
const ALL_COLS = { lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 };
const BREAKPOINTS = { lg: 1200, md: 768, sm: 480, xs: 320, xxs: 0 };
const ROW_HEIGHT = 380;
const TOOLBAR_HEIGHT = 40;
const MARGIN = 16;

/** Span (1-3) → 12-col grid units per breakpoint */
const SPAN_UNITS: Record<string, number[]> = {
  //          span: 1   2   3
  lg: [4, 8, 12],
  md: [6, 12, 12],
  sm: [12, 12, 12],
  xs: [12, 12, 12],
  xxs: [12, 12, 12],
};

function toGridW(span: number, bp: string): number {
  return (SPAN_UNITS[bp] ?? SPAN_UNITS.sm)[Math.min(span, 3) - 1] ?? TOTAL_COLS;
}

function fromGridW(gridW: number): number {
  // 4 → 1, 8 → 2, 12 → 3
  return Math.max(1, Math.min(3, Math.round(gridW / 4)));
}

/**
 * Generate RGL layouts for all breakpoints from the stored lg layout.
 * lg layout uses stored x/y directly (they're in 12-col units).
 * Other breakpoints re-pack items by their display order (sort by y,x).
 */
function buildLayouts(items: TLayoutItem[]) {
  // lg: restore 12-col units from conceptual span
  const lgRgl = items.map((item) => ({
    i: item.i,
    x: item.x,
    y: item.y,
    w: toGridW(item.w, "lg"),
    h: item.h,
  }));

  function packBp(bp: string) {
    const sorted = [...items].sort((a, b) =>
      a.y !== b.y ? a.y - b.y : a.x - b.x,
    );
    let x = 0,
      y = 0,
      rowMaxH = 1;
    return sorted.map((item) => {
      const w = toGridW(item.w, bp);
      if (x + w > TOTAL_COLS) {
        x = 0;
        y += rowMaxH;
        rowMaxH = item.h;
      } else {
        rowMaxH = Math.max(rowMaxH, item.h);
      }
      const out = { i: item.i, x, y, w, h: item.h };
      x += w;
      return out;
    });
  }

  return {
    lg: lgRgl,
    md: packBp("md"),
    sm: packBp("sm"),
    xs: packBp("xs"),
    xxs: packBp("xxs"),
  };
}

// ─── WidthProvider wraps Responsive (legacy API, same as example 14) ─────────
const ResponsiveGrid = WidthProvider(Responsive);

// ─── ChartSelection ───────────────────────────────────────────────────────────
interface ChartSelectionProps {
  charts: Record<string, TChartRef>;
  onSelect: (chart?: TChartRef) => void;
}

function ChartSelection({
  charts: assignedCharts,
  onSelect,
}: ChartSelectionProps) {
  const { t } = useTranslation("pages", {
    keyPrefix: `charts.editDashboard`,
  });
  const [available, setAvailable] = useState<ChartLookup[]>([]);

  useEffect(() => {
    const usedIds = new Set(Object.values(assignedCharts).map((c) => c.id));
    api
      .getCharts()
      .then((list: ChartLookup[]) =>
        setAvailable(list.filter((c) => !usedIds.has(c.id))),
      )
      .catch(console.error);
  }, [assignedCharts]);

  return (
    <div className="flex flex-col gap-2 min-w-[260px]">
      <label htmlFor="select-chart" className="label-text">
        {t(`components.chartSelection.form.fields.selectChart.label`)}
      </label>
      <select
        id="select-chart"
        className="select select-primary w-full"
        defaultValue=""
        onChange={(e) => {
          const found = available.find((c) => c.id === e.target.value);
          onSelect(found);
        }}
      >
        <option value="" disabled>
          --{" "}
          {t(
            `components.chartSelection.form.fields.selectChart.options.noValue`,
          )}{" "}
          --
        </option>
        {available.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── SlotToolbar ──────────────────────────────────────────────────────────────
function SlotToolbar({
  item,
  onDelete,
  onAddChart,
  onSizeChange,
}: {
  item: TLayoutItem;
  onDelete: () => void;
  onAddChart: () => void;
  onSizeChange: (colSpan: number, rowSpan: number) => void;
}) {
  const { t } = useTranslation("pages", {
    keyPrefix: `charts.editDashboard`,
  });
  return (
    <div
      className="rgl-drag-handle flex items-center gap-1 px-2 bg-base-200 border-b shrink-0 cursor-move select-none"
      style={{ height: TOOLBAR_HEIGHT }}
    >
      <span className="badge badge-error badge-xs font-mono">{item.i}</span>

      <div
        role="group"
        aria-label={t(`components.slotToolbar.width.label`)}
        className="flex items-center gap-1"
      >
        <span className="text-xs opacity-50 ml-1" aria-hidden="true">
          {t(`components.slotToolbar.width.label`)}
        </span>
        {[1, 2, 3].map((span) => (
          <button
            key={span}
            type="button"
            aria-label={t(`components.slotToolbar.width.option`, {
              value: span,
              defaultValue: `Larghezza {{value}}`,
            })}
            aria-pressed={item.w === span}
            className={`btn btn-xs ${item.w === span ? "btn-primary" : "btn-ghost"}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onSizeChange(span, item.h)}
          >
            {span}
          </button>
        ))}
      </div>

      <div
        role="group"
        aria-label={t(`components.slotToolbar.height.label`)}
        className="flex items-center gap-1"
      >
        <span className="text-xs opacity-50 ml-1" aria-hidden="true">
          {t(`components.slotToolbar.height.label`)}
        </span>
        {[1, 2, 3, 4].map((rows) => (
          <button
            key={rows}
            type="button"
            aria-label={t(`components.slotToolbar.height.option`, {
              value: rows,
              defaultValue: `Altezza {{value}}`,
            })}
            aria-pressed={item.h === rows}
            className={`btn btn-xs ${item.h === rows ? "btn-primary" : "btn-ghost"}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onSizeChange(item.w, rows)}
          >
            {rows}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-xs btn-outline ml-1"
        title={t(`components.slotToolbar.actions.change.title`)}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onAddChart}
      >
        {t(`components.slotToolbar.actions.change.label`)}
      </button>
      <button
        type="button"
        className="btn btn-xs btn-error ml-auto"
        title={t(`components.slotToolbar.actions.remove.title`)}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onDelete}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function DashboardEditPage() {
  const { id } = useParams();
  const {
    layout,
    show,
    charts,
    name,
    description,
    isLoading,
    error,
    loaded,
    setBreakpoint,
    setSelectedChart,
    setLayout,
    addItem,
    deleteItem,
    updateItemSize,
    showAddModal,
    closeAddModal,
    load,
    reload,
    save,
    publish,
    setName,
    setDescription,
    setPublish,
  } = useDashboardEditStore();

  const [isSaving, setIsSaving] = useState<boolean>(false);

  async function saveHandler() {
    setIsSaving(true);
    try {
      const ok = await save();
      if (ok) reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }

  React.useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  const { settings } = useSettingsStore();
  const scheme = settings?.preferredTheme ?? "light";

  // Memoize layouts to avoid rebuilding on every render
  const layouts = useMemo(() => buildLayouts(layout), [layout]);
  const navigate = useNavigate();
  const { t } = useTranslation("pages", {
    keyPrefix: `charts.editDashboard`,
  });

  return (
    <AppLayout>
      <Helmet>
        <title>{`${t(`head.title.label`)}`}</title>
        <meta name="description" content={t(`head.meta.description.content`)} />
      </Helmet>
      <div className="w-full flex justify-between items-center gap-2 mb-4 bg-base-300 py-4 px-10 rounded-lg">
        <button
          type="button"
          onClick={() => navigate(HOME_ROUTE)}
          className="btn btn-outline"
        >
          {t(`header.actions.back.label`)}
        </button>
        <h1 className="text-xl font-bold">
          {id ? t(`header.pageTitle.edit`) : t(`header.pageTitle.new`)}
        </h1>
        <div className="flex-shrink-0">
          <button type="button" onClick={reload} className="btn btn-outline">
            Reset
          </button>
          <button
            type="button"
            onClick={saveHandler}
            disabled={isSaving}
            className="btn btn-primary gap-2"
          >
            {isSaving ? (
              <span role="status">
                <span className="loading loading-spinner loading-sm"></span>
                {t(`header.actions.save.isSaving`)}...
              </span>
            ) : (
              <> {t(`header.actions.save.default`)}</>
            )}
          </button>
        </div>
      </div>
      <div className="p-4">
        {isLoading && <Loading />}
        {error && (
          <div role="alert" className="alert alert-error">
            {error.message}
          </div>
        )}
        {loaded && (
          <div className="w-full">
            <div className="w-full grid grid-cols-2 xl:grid-cols-6  gap-4">
              <div className="space-y-1 xl:col-span-2">
                <EditStepComponent
                  title={t(`body.options.setup.title`)}
                  description={t(`body.options.setup.description`)}
                  Icon={FaInfo}
                  isOpen={false}
                  isDisabled={false}
                  index={0}
                >
                  <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-4">
                          <input
                            id="chart_visibility"
                            type="checkbox"
                            checked={publish}
                            onChange={() => {
                              setPublish(!publish);
                            }}
                            className="toggle toggle-sm toggle-primary cursor-pointer"
                          />
                          <label
                            htmlFor="chart_visibility"
                            className="text-sm text-base-content/70 cursor-pointer"
                          >
                            {t(
                              `body.options.setup.form.fields.visibility.label`,
                            )}
                          </label>
                          <span className="text-sm text-base-content font-bold">
                            {t(
                              `body.options.setup.form.fields.visibility.values.${publish ? "public" : "private"}`,
                            )}
                          </span>
                        </div>
                        <label
                          htmlFor="chart_title"
                          className="mt-4 text-base-content/70"
                        >
                          {t(`body.options.setup.form.fields.title.label`)}
                        </label>
                        <input
                          id="chart_title"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          placeholder={name}
                          className="input input-bordered py-2 px-3 w-full bg-base-100 placeholder:text-base-content/40"
                        />
                        <label
                          htmlFor="chart_description"
                          className="mt-4 text-base-content/70"
                        >
                          {t(
                            `body.options.setup.form.fields.description.label`,
                          )}
                        </label>
                        <textarea
                          id="chart_description"
                          value={description}
                          rows={3}
                          onChange={(e) => {
                            setDescription(e.target.value);
                          }}
                          placeholder={t(
                            `body.options.setup.form.fields.description.placeholder`,
                          )}
                          className="input textarea input-bordered input-sm w-full bg-base-100 placeholder:text-base-content/40"
                        />
                      </div>
                    </div>
                  </div>
                </EditStepComponent>
              </div>

              {/* Right column: Preview */}
              <section
                aria-labelledby="dashboard-preview-heading"
                className="xl:col-span-4 flex flex-col h-full p-4 bg-base-100  border border-base-300 rounded-lg"
              >
                <div className="bg-base-100 bl-2 flex flex-col gap-4">
                  <h2
                    id="dashboard-preview-heading"
                    className="text-2xl font-bold"
                  >
                    {t(`header.preview.heading`)}
                    {name ? `: ${name}` : ""}
                  </h2>
                  <div className="text-base-content/80">
                    {description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: description.replace(/\n/g, "<br />"),
                        }}
                      />
                    ) : (
                      <p className="italic text-base-content">{""}</p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">
                    <FaInfo />
                  </span>
                </div>
                <div>
                  <h2 className="card-title text-xl">{t(`slots.title`)}</h2>
                  <p className="text-sm text-base-content/60">
                    {t(`slots.description`)}
                  </p>
                </div>

                <div className="w-full flex align-center justify-between">
                  <button
                    type="button"
                    className="btn btn-primary mb-4"
                    onClick={addItem}
                  >
                    + {t(`slots.actions.addSlot.label`)}
                  </button>

                  <a
                    href={`${ROUTES.viewDashboard(id)}`}
                    target="_blank"
                    className="btn btn-outline"
                  >
                    {t(`slots.actions.viewChart.label`)}
                  </a>
                </div>
              </div>
            </div>
            {/* Max-width container — ResponsiveGrid measures this element's width */}
            <div style={{ margin: "0 auto" }} className="bg-base-300">
              <ResponsiveGrid
                layouts={layouts}
                breakpoints={BREAKPOINTS}
                cols={ALL_COLS}
                rowHeight={ROW_HEIGHT}
                margin={[MARGIN, MARGIN]}
                draggableHandle=".rgl-drag-handle"
                onLayoutChange={(_currentLayout, allLayouts) => {
                  if (!allLayouts.lg) return;
                  // Convert 12-col grid units back to conceptual spans
                  const next = allLayouts.lg.map((item) => ({
                    i: item.i as TLayoutItem["i"],
                    x: item.x,
                    y: item.y,
                    w: fromGridW(item.w),
                    h: Math.max(1, Math.min(4, item.h)),
                  }));
                  setLayout(next);
                }}
                onBreakpointChange={setBreakpoint}
              >
                {layout.map((item) => {
                  const currentChart = charts[item.i] as FieldDataType;
                  // Height of the chart area = total slot height minus toolbar
                  const chartHeight =
                    ROW_HEIGHT * item.h +
                    MARGIN * (item.h - 1) -
                    TOOLBAR_HEIGHT -
                    50;

                  return (
                    <div
                      key={item.i}
                      className="flex flex-col overflow-hidden  rounded-lg bg-base-100  border border-base-200 shadow-sm"
                    >
                      <SlotToolbar
                        item={item}
                        onDelete={() => deleteItem(item.i)}
                        onAddChart={() => showAddModal(item.i)}
                        onSizeChange={(colSpan, rowSpan) =>
                          updateItemSize(item.i, colSpan, rowSpan)
                        }
                      />
                      <div style={{ height: chartHeight, overflow: "hidden" }}>
                        {currentChart ? (
                          <ColorSchemeProvider scheme={scheme}>
                            <RenderChart
                              {...currentChart}
                              rowHeight={chartHeight}
                              hFactor={1}
                            />
                          </ColorSchemeProvider>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => showAddModal(item.i)}
                            >
                              + {t(`bottom.actions.addChart.label`)}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </ResponsiveGrid>
            </div>
          </div>
        )}

        {show && (
          <Dialog toggle={show} title="Select a chart" callback={closeAddModal}>
            <ChartSelection charts={charts} onSelect={setSelectedChart} />
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
}

export default DashboardEditPage;
