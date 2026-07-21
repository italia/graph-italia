// Ready-made GeoJSON boundaries for Italian administrative levels, so users
// building a choropleth don't have to hunt down a URL and then inspect the
// file to discover which property holds the territory name.
//
// Source: openpolis/geojson-italy (https://github.com/openpolis/geojson-italy).
// Labels and hints are not stored here: they live in i18n under
// `components.geoPresets`, keyed by preset id.

export type GeoPreset = {
  id: string;
  geoJsonUrl: string;
  // Feature property holding the territory name, matched against the first
  // column of the chart data (see getMapValues in graph-italia-components).
  nameProperty: string;
  featureCount: number;
};

export const GEO_PRESET_CUSTOM = "custom";

export const DEFAULT_GEO_PRESET_ID = "regions";

export const GEO_PRESETS: GeoPreset[] = [
  {
    id: "regions",
    geoJsonUrl:
      "https://www.datocms-assets.com/38008/1766165019-it_regions.geojson",
    nameProperty: "reg_name",
    featureCount: 20,
  },
  {
    id: "provinces",
    geoJsonUrl:
      "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_provinces.geojson",
    nameProperty: "prov_name",
    featureCount: 107,
  },
];

export function findGeoPresetByUrl(url?: string): GeoPreset | undefined {
  if (!url) return undefined;
  return GEO_PRESETS.find((preset) => preset.geoJsonUrl === url);
}

export function findGeoPresetById(id?: string): GeoPreset | undefined {
  if (!id) return undefined;
  return GEO_PRESETS.find((preset) => preset.id === id);
}

// Which dropdown entry a chart config corresponds to. A brand new map has no
// URL yet and starts on the default preset; an existing map keeps whatever it
// was saved with, falling back to "custom" for hand-written URLs.
export function resolveGeoPresetId(url?: string): string {
  if (!url) return DEFAULT_GEO_PRESET_ID;
  return findGeoPresetByUrl(url)?.id ?? GEO_PRESET_CUSTOM;
}
