import type { PointData } from "dataviz-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ITALY_BOUNDS = {
  minLon: 8.6,
  maxLon: 16.5,
  minLat: 37.5,
  maxLat: 45.1,
};

function getRandomInRange(
  min: number,
  max: number,
  decimals: number = 4,
): number {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

function GenerateRandomData({ setData }: { setData: (data: any) => void }) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.generateRandomPoi",
  });
  const [items, setItems] = useState(10);
  const [minLat, setMinLat] = useState(ITALY_BOUNDS.minLat);
  const [maxLat, setMaxLat] = useState(ITALY_BOUNDS.maxLat);
  const [minLon, setMinLon] = useState(ITALY_BOUNDS.minLon);
  const [maxLon, setMaxLon] = useState(ITALY_BOUNDS.maxLon);

  function generate() {
    const poiData: PointData[] = [];
    for (let i = 0; i < items; i++) {
      poiData.push({
        id: i,
        name: "POI " + i,
        lng: getRandomInRange(ITALY_BOUNDS.minLon, ITALY_BOUNDS.maxLon),
        lat: getRandomInRange(ITALY_BOUNDS.minLat, ITALY_BOUNDS.maxLat),
      });
    }
    setData(poiData);
  }

  const inputClass = "input input-bordered w-full rounded-md";
  const labelClass = "label text-content/70 font-medium";

  return (
    <div className="rounded-2xl border border-base-200 bg-base-300 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("title")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="items" className={labelClass}>
            {t("form.fieldset.numberOfPoi.label")}
          </label>
          <input
            id="items"
            className={inputClass}
            type="number"
            min={3}
            value={items}
            onChange={(e) => setItems(Number.parseInt(e.target.value) || 3)}
          />
        </div>
        <div>
          <label htmlFor="minLat" className={labelClass}>
            {t("form.fieldset.minLatitude.label")}
          </label>
          <input
            id="minLat"
            className={inputClass}
            type="number"
            value={minLat}
            onChange={(e) => setMinLat(Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="maxLat" className={labelClass}>
            {t("form.fieldset.maxLatitude.label")}
          </label>
          <input
            id="maxLat"
            className={inputClass}
            type="number"
            value={maxLat}
            onChange={(e) => setMaxLat(Number.parseInt(e.target.value) || 100)}
          />
        </div>
        <div>
          <label htmlFor="minLon" className={labelClass}>
            {t("form.fieldset.minLongitude.label")}
          </label>
          <input
            id="minLon"
            className={inputClass}
            type="number"
            value={minLon}
            onChange={(e) => setMinLon(Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="maxLon" className={labelClass}>
            {t("form.fieldset.maxLongitude.label")}
          </label>
          <input
            id="maxLon"
            className={inputClass}
            type="number"
            value={maxLon}
            onChange={(e) => setMaxLon(Number.parseInt(e.target.value) || 100)}
          />
        </div>
      </div>
      <div className="mt-6">
        <button type="button" className="btn btn-primary" onClick={generate}>
          {t("form.actions.generate.label")}
        </button>
      </div>
    </div>
  );
}

export default GenerateRandomData;
