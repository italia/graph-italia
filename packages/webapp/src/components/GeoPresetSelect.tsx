import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../router";
import {
  GEO_PRESETS,
  GEO_PRESET_CUSTOM,
  findGeoPresetById,
} from "../lib/geoPresets";

// Territory picker for choropleth maps. Rendered twice: once in the dialog
// that opens when the chart type becomes a map, once inline in the map
// options, so the id is a prop to keep both instances unique.
function GeoPresetSelect({
  value,
  onChange,
  id = "opt-geoPreset",
  className = "",
}: {
  value: string;
  onChange: (presetId: string) => void;
  id?: string;
  className?: string;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.geoPresets",
  });

  const preset = findGeoPresetById(value);

  return (
    <div className={`form-control ${className}`}>
      <label htmlFor={id} className="label">
        <span className="label-text text-base font-medium">{t("label")}</span>
      </label>
      <select
        id={id}
        className="select select-bordered w-full text-base"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {GEO_PRESETS.map((option) => (
          <option key={option.id} value={option.id}>
            {t(`options.${option.id}`)}
          </option>
        ))}
        <option value={GEO_PRESET_CUSTOM}>
          {t(`options.${GEO_PRESET_CUSTOM}`)}
        </option>
      </select>
      <p className="mt-2 text-sm text-base-content/70">
        {preset ? (
          t(`hints.${preset.id}`)
        ) : (
          <>
            {t(`hints.${GEO_PRESET_CUSTOM}`)}{" "}
            <Link className="link link-primary" to={ROUTES.geo}>
              {t("checkGeoLink")}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export default GeoPresetSelect;
