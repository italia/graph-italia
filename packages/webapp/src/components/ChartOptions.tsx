import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { defaultConfig, getFields, palettes } from "../lib/constants";
import {
  DEFAULT_GEO_PRESET_ID,
  GEO_PRESET_CUSTOM,
  findGeoPresetById,
  resolveGeoPresetId,
} from "../lib/geoPresets";
import { getAvailablePalettes, getMapPalettes } from "../lib/utils";
import GeoMatchStatus from "./GeoMatchStatus";
import GeoPresetDialog from "./GeoPresetDialog";
import GeoPresetSelect from "./GeoPresetSelect";
import ShowPalette from "./ShowPalette";

// Fields a territory preset fills in on the user's behalf.
const GEO_PRESET_FIELDS = ["geoJsonUrl", "nameProperty"];

function ChartOptions({
  config,
  setConfig,
  chart,
  numSeries,
}: {
  config: any;
  setConfig: (c: any) => void;
  chart: string;
  numSeries: number;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.chartOptions",
  });

  function translateLabel(field: { name: string; label: string }): string {
    return t(`fields.${field.name}.label`, { defaultValue: field.label });
  }

  function translateSection(name: string): string {
    return t(`sections.${name}`, { defaultValue: name });
  }

  function translateOption(fieldName: string, option: string): string {
    if (option === "") return option;
    return t(`fieldOptions.${fieldName}.${option}`, { defaultValue: option });
  }

  // Optional per-field explanation (i18n `fields.<name>.hint`) rendered as a
  // small "?" with a tooltip next to the label
  function fieldHintBadge(field: { name: string }) {
    const hint = t(`fields.${field.name}.hint`, { defaultValue: "" });
    if (!hint) return null;
    return (
      <span
        tabIndex={0}
        aria-label={hint}
        className="tooltip tooltip-top align-middle ml-1.5 cursor-help before:max-w-64 before:whitespace-normal before:text-left"
        data-tip={hint}
      >
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-base-300 text-base-content/70 text-base font-bold"
        >
          ?
        </span>
      </span>
    );
  }
  const availabelPalettes =
    chart === "map" ? getMapPalettes() : getAvailablePalettes(numSeries);
  const defaultPalette = availabelPalettes[0];
  const fields = getFields(availabelPalettes, defaultPalette);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      ...defaultConfig,
      palette: defaultPalette,
      ...config,
    },
  });

  const formValues = watch();
  const watchPalette = formValues.palette || config?.palette || defaultPalette;
  const watchDirection = formValues.direction || null;
  const watchToltip = formValues.tooltip ?? true;
  const watchLegend = formValues.legend ?? true;
  const watchShowPieLabels = formValues.showPieLabels ?? true;
  const watchVisualMap = formValues.visualMap ?? true;

  // The dropdown choice is derived from the saved URL rather than persisted as
  // its own config key, so no change to the shared ChartConfigType is needed.
  const [geoPresetId, setGeoPresetId] = useState(() =>
    resolveGeoPresetId(config?.geoJsonUrl),
  );
  const [isGeoDialogOpen, setIsGeoDialogOpen] = useState(false);

  function applyGeoPreset(presetId: string) {
    setGeoPresetId(presetId);
    const preset = findGeoPresetById(presetId);
    setValue("geoJsonUrl", preset?.geoJsonUrl ?? "", { shouldValidate: true });
    setValue("nameProperty", preset?.nameProperty ?? "", {
      shouldValidate: true,
    });
  }

  // A map with no territory yet (a brand new one, or a chart just switched to
  // "map") gets the default preset applied straight away and the picker dialog
  // opened on top. An already configured map is left alone: no dialog on every
  // edit, the inline dropdown is enough to change it.
  useEffect(() => {
    if (chart !== "map") return;
    const currentUrl = watch("geoJsonUrl");
    if (!currentUrl) {
      applyGeoPreset(DEFAULT_GEO_PRESET_ID);
      setIsGeoDialogOpen(true);
      return;
    }
    setGeoPresetId(resolveGeoPresetId(currentUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);

  useEffect(() => {
    const { h, w, palette, ...rest } = formValues;
    if (palette) {
      const colors = palette === "theme" ? [] : palettes[palette];
      const newConfig = {
        h: Number(h),
        w: Number(w),
        ...rest,
        colors,
        palette,
      };
      setConfig(newConfig);
    }
  }, [JSON.stringify(formValues)]);

  if (!chart) {
    return (
      <div className="alert alert-info my-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>{t(`errors.selectChart`)}</span>
      </div>
    );
  }

  let filteredFields = fields.filter((field) =>
    field.chartType.includes(chart),
  );
  if (!watchToltip) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "tooltip",
    );
  }
  if (!watchLegend) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "legend",
    );
  }
  if (!watchShowPieLabels) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "showPieLabels",
    );
  }
  if (!watchVisualMap) {
    filteredFields = filteredFields.filter(
      (field) => field.dependsOn !== "visualMap",
    );
  }

  const groups: { label: string; fields: typeof filteredFields }[] = [];
  for (const field of filteredFields) {
    if (field.type === "label") {
      groups.push({ label: field.name, fields: [] });
    } else if (groups.length > 0) {
      groups[groups.length - 1].fields.push(field);
    }
  }

  function renderField(field: (typeof filteredFields)[number]) {
    if (["text", "email", "number", "color"].includes(field.type)) {
      const layoutValue = field.layout ? Number(field.layout) : 1;
      const gridSpan = layoutValue === 2 ? "sm:col-span-2" : "";

      let label = translateLabel(field);
      if (
        (field.name === "xLabel" || field.name === "yLabel") &&
        watchDirection === "horizontal"
      ) {
        label =
          field.name === "xLabel"
            ? label.replace("X", "Y")
            : label.replace("Y", "X");
      }
      // Filled in by the territory preset: kept visible so the user can see
      // what was picked, but not editable until they switch to "custom".
      const isGeoPresetLocked =
        chart === "map" &&
        geoPresetId !== GEO_PRESET_CUSTOM &&
        GEO_PRESET_FIELDS.includes(field.name);

      return (
        <div key={field.name} className={`form-control ${gridSpan}`}>
          <label htmlFor={`opt-${field.name}`} className="label">
            <span className="label-text text-base font-medium">
              {label}
              {fieldHintBadge(field)}
            </span>
          </label>
          <input
            id={`opt-${field.name}`}
            className={`input input-bordered w-full text-base ${
              isGeoPresetLocked ? "bg-base-200 text-base-content/70" : ""
            }`}
            type={field.type}
            {...field.otherProps}
            {...register(field.name, { required: field.required })}
            readOnly={isGeoPresetLocked}
          />
          {errors[field.name] && (
            <label className="label">
              <span className="label-text-alt text-error">
                {t(`form.error.required`)}
              </span>
            </label>
          )}
        </div>
      );
    }

    if (["checkbox"].includes(field.type)) {
      const layoutValue = field.layout ? Number(field.layout) : 1;
      const gridSpan = layoutValue === 2 ? "sm:col-span-2" : "";

      return (
        <div key={field.name} className={`form-control ${gridSpan}`}>
          <label htmlFor={`opt-${field.name}`} className="label">
            <span className="label-text text-base font-medium">
              {translateLabel(field)}
              {fieldHintBadge(field)}
            </span>
          </label>
          <div className="h-12 flex items-center">
            <input
              id={`opt-${field.name}`}
              className="checkbox checkbox-primary"
              type="checkbox"
              {...field.otherProps}
              {...register(field.name, { required: field.required })}
            />
          </div>
          {errors[field.name] && (
            <label className="label">
              <span className="label-text-alt text-error">
                {t(`form.error.required`)}
              </span>
            </label>
          )}
        </div>
      );
    }

    if (["select"].includes(field.type)) {
      const layoutValue = field.layout ? Number(field.layout) : 1;
      const gridSpan = layoutValue === 2 ? "sm:col-span-2" : "";

      return (
        <div key={field.name} className={`form-control ${gridSpan}`}>
          <label htmlFor={`opt-${field.name}`} className="label">
            <span className="label-text text-base font-medium">
              {translateLabel(field)}
              {fieldHintBadge(field)}
            </span>
          </label>
          <select
            id={`opt-${field.name}`}
            className="select select-bordered w-full text-base"
            {...field.otherProps}
            {...register(field.name, { required: field.required })}
          >
            {(field.options ?? []).map((option: string) => (
              <option key={option} value={option}>
                {translateOption(field.name, option)}
              </option>
            ))}
          </select>
          {errors[field.name] && (
            <label className="label">
              <span className="label-text-alt text-error">
                {t(`form.error.required`)}
              </span>
            </label>
          )}
          {field.name === "palette" &&
            watchPalette &&
            watchPalette !== "theme" && (
              <div className="mt-2">
                <ShowPalette palette={palettes[watchPalette]} />
              </div>
            )}
        </div>
      );
    }

    return null;
  }

  function renderGroup(group: (typeof groups)[number]) {
    return (
      <fieldset
        key={group.label}
        className="border-none p-0 m-0 mt-4 first:mt-0"
      >
        <legend className="w-full pb-2">
          <div className="flex items-center gap-2">
            <span className="badge badge-neutral badge-lg text-base">
              {translateSection(group.label)}
            </span>
            <div className="flex-1 h-px bg-base-200"></div>
          </div>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {group.label === "Map Chart" && (
            <>
              <GeoPresetSelect
                value={geoPresetId}
                onChange={applyGeoPreset}
                className="sm:col-span-2"
              />
              <GeoMatchStatus
                geoJsonUrl={formValues.geoJsonUrl}
                nameProperty={formValues.nameProperty}
              />
            </>
          )}
          {group.fields.map(renderField)}
        </div>
      </fieldset>
    );
  }

  // Tooltip/grid/axes tuning is rarely needed on a first pass: fold those
  // sections behind a native (keyboard-accessible) disclosure.
  const ADVANCED_SECTIONS = new Set(["Tooltip", "Grid", "Axes"]);
  const basicGroups = groups.filter((g) => !ADVANCED_SECTIONS.has(g.label));
  const advancedGroups = groups.filter((g) => ADVANCED_SECTIONS.has(g.label));

  return (
    <div className="space-y-4">
      {basicGroups.map(renderGroup)}

      {advancedGroups.length > 0 && (
        <details className="collapse collapse-arrow border border-base-300 bg-base-100">
          <summary className="collapse-title min-h-0 py-3 text-base font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-primary">
            {t("advanced.title", "Configurazioni avanzate")}
          </summary>
          <div className="collapse-content space-y-4">
            {advancedGroups.map(renderGroup)}
          </div>
        </details>
      )}

      {chart === "map" && (
        <GeoPresetDialog
          open={isGeoDialogOpen}
          presetId={geoPresetId}
          onConfirm={(presetId) => {
            applyGeoPreset(presetId);
            setIsGeoDialogOpen(false);
          }}
          onCancel={() => setIsGeoDialogOpen(false)}
        />
      )}
    </div>
  );
}

export default ChartOptions;
