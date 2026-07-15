import {
  ColorSchemeProvider,
  RenderChart,
  type FieldDataType,
} from "graph-italia-components";
import React, { useEffect, useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaInfo, FaThLarge } from "react-icons/fa";
import { FaGripVertical, FaTrashCan } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import EditStepComponent from "../../components/EditStepComponent";
import TextSlot from "../../components/TextSlot";
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
      .then((list: Array<ChartLookup & { chart?: string }>) =>
        // "text" charts back dashboard text slots — never selectable here
        setAvailable(list.filter((c) => c.chart !== "text" && !usedIds.has(c.id))),
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

// ─── TextSlotEditor ───────────────────────────────────────────────────────────
// Markdown editor for text slots, with a write/preview toggle. The preview
// reuses the same TextSlot component used by the public dashboard pages.
function TextSlotEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation("pages", {
    keyPrefix: `charts.editDashboard`,
  });
  const [showPreview, setShowPreview] = useState(false);
  return (
    <div className="flex flex-col h-full">
      <div className="tabs tabs-boxed tabs-sm self-end m-2 mb-0">
        <button
          type="button"
          aria-pressed={!showPreview}
          className={`tab ${!showPreview ? "tab-active" : ""}`}
          onClick={() => setShowPreview(false)}
        >
          {t(`components.textSlot.tabs.write`, "Scrivi")}
        </button>
        <button
          type="button"
          aria-pressed={showPreview}
          className={`tab ${showPreview ? "tab-active" : ""}`}
          onClick={() => setShowPreview(true)}
        >
          {t(`components.textSlot.tabs.preview`, "Anteprima")}
        </button>
      </div>
      {showPreview ? (
        <div className="flex-1 overflow-hidden">
          <TextSlot content={value} />
        </div>
      ) : (
        <textarea
          className="textarea textarea-bordered font-mono text-sm flex-1 m-2 resize-none"
          value={value}
          placeholder={t(
            `components.textSlot.placeholder`,
            "Scrivi in Markdown: # Titolo, **grassetto**, - elenchi…",
          )}
          aria-label={t(
            `components.textSlot.ariaLabel`,
            "Contenuto del blocco di testo",
          )}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// ─── SlotToolbar ──────────────────────────────────────────────────────────────
function SlotToolbar({
  item,
  onDelete,
  onAddChart,
  onSizeChange,
  onMove,
}: {
  item: TLayoutItem;
  onDelete: () => void;
  onAddChart?: () => void;
  onSizeChange: (colSpan: number, rowSpan: number) => void;
  onMove: (dx: number, dy: number) => void;
}) {
  const { t } = useTranslation("pages", {
    keyPrefix: `charts.editDashboard`,
  });
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div
      className="rgl-drag-handle flex items-center gap-2 px-2 bg-base-200 border-b border-base-300 shrink-0 cursor-grab active:cursor-grabbing select-none"
      style={{ height: TOOLBAR_HEIGHT }}
      title={t(`components.slotToolbar.dragHint`, "Trascina per spostare lo slot")}
    >
      <FaGripVertical
        className="shrink-0 text-base-content/50"
        aria-hidden="true"
      />

      <label
        className="flex items-center gap-1 text-xs text-base-content/70 cursor-default"
        title={t(`components.slotToolbar.width.label`)}
        onMouseDown={stop}
      >
        {t(`components.slotToolbar.width.short`, "L")}
        <select
          className="select select-bordered select-xs w-12 bg-base-100"
          value={item.w}
          aria-label={t(`components.slotToolbar.width.label`)}
          onChange={(e) => onSizeChange(Number(e.target.value), item.h)}
        >
          {[1, 2, 3].map((span) => (
            <option key={span} value={span}>
              {span}
            </option>
          ))}
        </select>
      </label>

      <label
        className="flex items-center gap-1 text-xs text-base-content/70 cursor-default"
        title={t(`components.slotToolbar.height.label`)}
        onMouseDown={stop}
      >
        {t(`components.slotToolbar.height.short`, "A")}
        <select
          className="select select-bordered select-xs w-12 bg-base-100"
          value={item.h}
          aria-label={t(`components.slotToolbar.height.label`)}
          onChange={(e) => onSizeChange(item.w, Number(e.target.value))}
        >
          {[1, 2, 3, 4].map((rows) => (
            <option key={rows} value={rows}>
              {rows}
            </option>
          ))}
        </select>
      </label>

      <div
        role="group"
        aria-label={t(`components.slotToolbar.move.label`, { defaultValue: "Sposta slot" })}
        className="flex items-center"
      >
        {(
          [
            ["←", -1, 0, "left", "Sposta a sinistra"],
            ["↑", 0, -1, "up", "Sposta in alto"],
            ["↓", 0, 1, "down", "Sposta in basso"],
            ["→", 1, 0, "right", "Sposta a destra"],
          ] as const
        ).map(([arrow, dx, dy, key, fallback]) => (
          <button
            key={key}
            type="button"
            className="btn btn-xs btn-ghost px-1.5"
            aria-label={t(`components.slotToolbar.move.${key}`, { defaultValue: fallback })}
            title={t(`components.slotToolbar.move.${key}`, { defaultValue: fallback })}
            onMouseDown={stop}
            onClick={() => onMove(dx, dy)}
          >
            <span aria-hidden="true">{arrow}</span>
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1">
        {onAddChart && (
          <button
            type="button"
            className="btn btn-xs btn-outline btn-primary"
            title={t(`components.slotToolbar.actions.change.title`)}
            onMouseDown={stop}
            onClick={onAddChart}
          >
            {t(`components.slotToolbar.actions.change.label`)}
          </button>
        )}
        <button
          type="button"
          className="btn btn-xs btn-error btn-square"
          title={t(`components.slotToolbar.actions.remove.title`)}
          aria-label={t(`components.slotToolbar.actions.remove.title`)}
          onMouseDown={stop}
          onClick={onDelete}
        >
          <FaTrashCan aria-hidden="true" />
        </button>
      </div>
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
    addTextItem,
    setTextContent,
    texts,
    deleteItem,
    updateItemSize,
    updateItemPosition,
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
      // Slots without a chart or text block cannot be persisted (a slot row
      // requires a chartId): they stay in the editor but are skipped on save.
      const emptySlots = layout.filter(
        (l) => !charts[l.i] && !texts[l.i],
      ).length;
      const ok = await save();
      if (ok) {
        // Reloading would drop unsaved empty slots from the editor
        if (emptySlots === 0) reload();
        toast.success(t("header.actions.save.success", "Dashboard salvata con successo"));
        if (emptySlots > 0) {
          toast(
            t(
              "header.actions.save.skippedEmpty",
              "Gli slot senza contenuto non vengono salvati",
            ),
            { icon: "⚠️" },
          );
        }
      } else {
        toast.error(t("header.actions.save.error", "Errore durante il salvataggio della dashboard"));
      }
    } catch (error) {
      console.log(error);
      toast.error(t("header.actions.save.error", "Errore durante il salvataggio della dashboard"));
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
      <div className="w-full flex justify-between items-center gap-2 mb-2 py-6 px-4 lg:px-10">
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
        <div className="flex-shrink-0 flex items-center gap-2">
          <button type="button" onClick={reload} className="btn btn-outline">
            {t(`header.actions.reset.label`, "Reimposta")}
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
      <div className="px-4 lg:px-10 pb-10">
        {isLoading && <Loading />}
        {error && (
          <div role="alert" className="alert alert-error">
            {error.message}
          </div>
        )}
        {loaded && (
          <div className="w-full space-y-4">
            <EditStepComponent
              title={t(`body.options.setup.title`)}
              description={t(`body.options.setup.description`)}
              Icon={FaInfo}
              isOpen={false}
              isDisabled={false}
              index={0}
            >
              <div className="pt-1 max-w-3xl">
                <div>
                  <div className="flex flex-col space-y-2">
                        {api.isPublishingEnabled() && (
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
                        )}
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

            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0" aria-hidden="true">
                    <span className="text-primary font-bold">
                      <FaThLarge />
                    </span>
                  </div>
                  <div>
                    <h2 className="card-title text-xl">{t(`slots.title`)}</h2>
                    <p className="text-sm text-base-content/60">
                      {t(`slots.description`)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-base-content/70">
                  {t(
                    `slots.hint`,
                    "Trascina uno slot dalla sua barra superiore per spostarlo, oppure usa i controlli L (larghezza), A (altezza) e le frecce.",
                  )}
                </p>

                <div className="w-full flex align-center justify-between mt-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addItem}
                    >
                      <span aria-hidden="true">+</span> {t(`slots.actions.addSlot.label`)}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-primary"
                      onClick={addTextItem}
                    >
                      <span aria-hidden="true">+</span> {t(`slots.actions.addText.label`, "Aggiungi testo")}
                    </button>
                  </div>

                  {api.isPublishingEnabled() && publish && (
                    <a
                      href={`${ROUTES.viewDashboard(id)}`}
                      target="_blank"
                      className="btn btn-outline"
                    >
                      {t(`slots.actions.viewChart.label`)}
                    </a>
                  )}
                </div>
              </div>
            </div>
            {/* Working area — ResponsiveGrid measures this element's width */}
            <div className="rounded-lg border border-dashed border-base-300 bg-base-200/60 p-2 min-h-[160px]">
              {layout.length === 0 && (
                <div className="flex items-center justify-center h-36 text-base-content/60">
                  {t(
                    `slots.empty`,
                    "Nessuno slot: usa “Aggiungi slot” per un grafico o “Aggiungi testo” per un blocco di testo.",
                  )}
                </div>
              )}
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
                  const textItem = texts[item.i];
                  // Height of the chart area = total slot height minus toolbar
                  const chartHeight =
                    ROW_HEIGHT * item.h +
                    MARGIN * (item.h - 1) -
                    TOOLBAR_HEIGHT -
                    50;

                  return (
                    <div
                      key={item.i}
                      className="flex flex-col overflow-hidden  rounded-lg bg-base-100  border border-base-300 shadow-sm"
                    >
                      <SlotToolbar
                        item={item}
                        onDelete={() => deleteItem(item.i)}
                        onAddChart={
                          textItem ? undefined : () => showAddModal(item.i)
                        }
                        onSizeChange={(colSpan, rowSpan) =>
                          updateItemSize(item.i, colSpan, rowSpan)
                        }
                        onMove={(dx, dy) => updateItemPosition(item.i, dx, dy)}
                      />
                      <div style={{ height: chartHeight, overflow: "hidden" }}>
                        {textItem ? (
                          <TextSlotEditor
                            value={textItem.content}
                            onChange={(v) => setTextContent(item.i, v)}
                          />
                        ) : currentChart ? (
                          <ColorSchemeProvider scheme={scheme}>
                            <RenderChart
                              {...currentChart}
                              rowHeight={chartHeight}
                              hFactor={1}
                            />
                          </ColorSchemeProvider>
                        ) : (
                          <div className="flex items-center justify-center h-full bg-base-200">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => showAddModal(item.i)}
                            >
                              <span aria-hidden="true">+</span> {t(`bottom.actions.addChart.label`)}
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
          <Dialog
            toggle={show}
            title={t(`modals.selectChart.title`, "Scegli un grafico")}
            callback={closeAddModal}
          >
            <ChartSelection
              charts={charts}
              onSelect={(chart) => {
                setSelectedChart(chart);
                closeAddModal();
              }}
            />
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
}

export default DashboardEditPage;
