import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useStoreState from "../lib/store/storeState";

// Boundary files are megabytes and GeoMapChart already fetches the same URL for
// the preview, so keep parsed names around instead of downloading twice.
const namesCache = new Map<string, string[]>();

async function loadTerritoryNames(
  geoJsonUrl: string,
  nameProperty: string,
): Promise<string[]> {
  const cacheKey = `${geoJsonUrl}|${nameProperty}`;
  const cached = namesCache.get(cacheKey);
  if (cached) return cached;

  const response = await fetch(geoJsonUrl);
  const raw = await response.json();
  const names: string[] = (raw?.features ?? [])
    .map((feature: any) => feature?.properties?.[nameProperty])
    .filter((name: unknown): name is string => typeof name === "string");

  namesCache.set(cacheKey, names);
  return names;
}

// Same comparison ECharts does is exact, but a value that only differs by case
// or padding is a typo the user can fix, not a genuinely missing territory:
// worth telling those two cases apart.
function normalize(value: string) {
  return value.trim().toLowerCase();
}

type MatchReport = {
  total: number;
  matched: number;
  nearMisses: string[];
  unmatched: string[];
};

function buildReport(rowNames: string[], territoryNames: string[]): MatchReport {
  const exact = new Set(territoryNames);
  const normalized = new Map(territoryNames.map((n) => [normalize(n), n]));

  const nearMisses: string[] = [];
  const unmatched: string[] = [];
  let matched = 0;

  for (const name of rowNames) {
    if (exact.has(name)) {
      matched += 1;
    } else if (normalized.has(normalize(name))) {
      nearMisses.push(name);
    } else {
      unmatched.push(name);
    }
  }

  return { total: rowNames.length, matched, nearMisses, unmatched };
}

// Tells the user how many of their rows actually landed on a territory. Without
// this a mismatched dataset renders as a fully drawn map with NaN everywhere,
// which reads as a broken chart rather than as wrong data.
function GeoMatchStatus({
  geoJsonUrl,
  nameProperty,
}: {
  geoJsonUrl?: string;
  nameProperty?: string;
}) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.geoPresets.match",
  });
  const data = useStoreState((state) => state.data);

  const [territoryNames, setTerritoryNames] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!geoJsonUrl || !nameProperty) {
      setTerritoryNames(null);
      return;
    }
    let cancelled = false;
    setFailed(false);
    setTerritoryNames(null);
    loadTerritoryNames(geoJsonUrl, nameProperty)
      .then((names) => {
        if (!cancelled) setTerritoryNames(names);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [geoJsonUrl, nameProperty]);

  // First row is the header, first column is the territory name: this mirrors
  // getMapValues in graph-italia-components.
  const rowNames = (data ?? [])
    .slice(1)
    .map((row) => row?.[0])
    .filter((name): name is string => typeof name === "string");

  const explanation = (
    <p className="text-sm text-base-content/70">{t("howItWorks")}</p>
  );

  if (!geoJsonUrl || !nameProperty) return explanation;

  if (failed) {
    return (
      <div className="sm:col-span-2 space-y-2">
        {explanation}
        <div className="alert alert-warning text-sm" role="status">
          {t("loadError")}
        </div>
      </div>
    );
  }

  if (!rowNames.length || !territoryNames) return explanation;

  const report = buildReport(rowNames, territoryNames);
  const problems = [...report.nearMisses, ...report.unmatched];
  const alertClass =
    report.matched === 0
      ? "alert-error"
      : problems.length > 0
        ? "alert-warning"
        : "alert-success";

  return (
    <div className="sm:col-span-2 space-y-2">
      {explanation}
      <div className={`alert ${alertClass} text-sm block`} role="status">
        <p className="font-medium">
          {t("summary", {
            matched: report.matched,
            total: report.total,
            territories: territoryNames.length,
          })}
        </p>

        {report.nearMisses.length > 0 && (
          <p className="mt-2">
            {t("nearMisses")}{" "}
            <span className="font-mono">{report.nearMisses.join(", ")}</span>
          </p>
        )}

        {report.unmatched.length > 0 && (
          <p className="mt-2">
            {t("unmatched")}{" "}
            <span className="font-mono">
              {report.unmatched.slice(0, 8).join(", ")}
              {report.unmatched.length > 8
                ? t("andMore", { count: report.unmatched.length - 8 })
                : ""}
            </span>
          </p>
        )}

        {report.matched === 0 && (
          <p className="mt-2">
            {t("expectedExample")}{" "}
            <span className="font-mono">
              {territoryNames.slice(0, 4).join(", ")}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default GeoMatchStatus;
