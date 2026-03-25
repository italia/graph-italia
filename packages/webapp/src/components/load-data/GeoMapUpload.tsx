import { useState } from "react";

type ParsedRow = Record<string, string | number | null>;

export interface GeoPointsMeta {
  latField: string;
  lngField: string;
}

interface GeoMapUploadProps {
  setData: (d: object[], meta: GeoPointsMeta) => void;
}

function isGeoJson(parsed: any): boolean {
  return (
    parsed?.type === "FeatureCollection" && Array.isArray(parsed?.features)
  );
}

function extractRowsFromGeoJson(parsed: any): ParsedRow[] {
  return parsed.features.map((feature: any) => {
    const props = feature?.properties || {};
    const row: ParsedRow = {};

    // Auto-inject coordinates from Point geometry
    if (feature?.geometry?.type === "Point" && Array.isArray(feature.geometry.coordinates)) {
      const [lng, lat] = feature.geometry.coordinates;
      row["_lng"] = lng ?? null;
      row["_lat"] = lat ?? null;
    }

    for (const key of Object.keys(props)) {
      const val = props[key];
      row[key] = val === undefined ? null : val;
    }
    return row;
  });
}

function extractRowsFromJson(parsed: any): ParsedRow[] | null {
  if (Array.isArray(parsed)) {
    return parsed.map((item) => {
      const row: ParsedRow = {};
      for (const key of Object.keys(item)) {
        const val = item[key];
        if (val === null || val === undefined || typeof val !== "object") {
          row[key] = val ?? null;
        }
      }
      return row;
    });
  }
  return null;
}

function rowsToObjects(rows: ParsedRow[], selectedCols: string[]): object[] {
  return rows.map((row) => {
    const obj: Record<string, string | number | null> = {};
    for (const col of selectedCols) {
      obj[col] = row[col] ?? null;
    }
    return obj;
  });
}

export default function GeoMapUpload({ setData }: GeoMapUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedRow[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedCols, setSelectedCols] = useState<Set<string>>(new Set());
  const [latField, setLatField] = useState<string>("");
  const [lngField, setLngField] = useState<string>("");
  const [isGeo, setIsGeo] = useState(false);

  function reset() {
    setRows(null);
    setColumns([]);
    setSelectedCols(new Set());
    setLatField("");
    setLngField("");
    setIsGeo(false);
    setError(null);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    reset();
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = (ev) => {
      const text = ev.target?.result as string;
      if (!text) {
        setError("The file is empty");
        return;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        setError("Invalid JSON file");
        return;
      }

      let extracted: ParsedRow[] | null = null;
      let geo = false;

      if (isGeoJson(parsed)) {
        extracted = extractRowsFromGeoJson(parsed);
        geo = true;
      } else {
        extracted = extractRowsFromJson(parsed);
      }

      if (!extracted || extracted.length === 0) {
        setError("Could not extract rows. Expected a GeoJSON FeatureCollection or a JSON array of objects.");
        return;
      }

      const cols = Object.keys(extracted[0]);
      const defaultSelected = new Set(cols);

      setRows(extracted);
      setColumns(cols);
      setSelectedCols(defaultSelected);
      setIsGeo(geo);

      // Auto-detect lat/lng fields
      const latCandidates = cols.filter((c) =>
        /^(lat|latitude|_lat)$/i.test(c)
      );
      const lngCandidates = cols.filter((c) =>
        /^(lng|lon|longitude|long|_lng)$/i.test(c)
      );
      if (latCandidates[0]) setLatField(latCandidates[0]);
      if (lngCandidates[0]) setLngField(lngCandidates[0]);
    };
  }

  function toggleCol(col: string) {
    setSelectedCols((prev) => {
      const next = new Set(prev);
      if (next.has(col)) {
        next.delete(col);
      } else {
        next.add(col);
      }
      return next;
    });
  }

  function handleApply() {
    if (!rows) return;

    // Ensure lat/lng columns are selected
    const finalSelected = new Set(selectedCols);
    if (latField) finalSelected.add(latField);
    if (lngField) finalSelected.add(lngField);

    // Reorder: lat and lng first, then the rest
    const ordered: string[] = [];
    if (latField && finalSelected.has(latField)) ordered.push(latField);
    if (lngField && finalSelected.has(lngField)) ordered.push(lngField);
    for (const col of columns) {
      if (finalSelected.has(col) && col !== latField && col !== lngField) {
        ordered.push(col);
      }
    }

    if (ordered.length === 0) {
      setError("Select at least one column");
      return;
    }

    const objects = rowsToObjects(rows, ordered);
    setData(objects, { latField, lngField });
  }

  const numericCols = columns.filter((col) => {
    if (!rows || rows.length === 0) return false;
    return rows.slice(0, 10).every((r) => {
      const v = r[col];
      return v !== null && v !== "" && !isNaN(Number(v));
    });
  });

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label htmlFor="geoUploadFile" className="label">
          <span className="label-text font-medium">Upload JSON or GeoJSON file</span>
        </label>
        <input
          id="geoUploadFile"
          className="file-input file-input-bordered file-input-primary w-full"
          type="file"
          accept=".json,.geojson"
          onChange={handleFile}
        />
      </div>

      {error && (
        <div className="alert alert-error py-2">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {rows && (
        <div className="space-y-4">
          <div className="text-sm text-base-content/60">
            {isGeo ? "GeoJSON detected" : "JSON array detected"} — {rows.length} rows, {columns.length} columns
          </div>

          {/* Lat / Lng mapping */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-medium">Latitude field</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={latField}
                onChange={(e) => setLatField(e.target.value)}
              >
                <option value="">— select —</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-medium">Longitude field</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={lngField}
                onChange={(e) => setLngField(e.target.value)}
              >
                <option value="">— select —</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Property filter */}
          <div>
            <p className="text-xs font-medium text-base-content/60 mb-2">
              Select properties to include
            </p>
            <div className="flex flex-wrap gap-2">
              {columns.map((col) => {
                const isLatLng = col === latField || col === lngField;
                return (
                  <label
                    key={col}
                    className={`flex items-center gap-1 cursor-pointer badge badge-lg gap-2 ${selectedCols.has(col) ? "badge-primary" : "badge-ghost"
                      } ${isLatLng ? "opacity-60" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs"
                      checked={selectedCols.has(col)}
                      disabled={isLatLng}
                      onChange={() => toggleCol(col)}
                    />
                    <span className="text-xs">{col}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="overflow-x-auto rounded border border-base-200">
            <table className="table table-xs">
              <thead>
                <tr>
                  {[
                    ...(latField ? [latField] : []),
                    ...(lngField ? [lngField] : []),
                    ...columns.filter(
                      (c) => selectedCols.has(c) && c !== latField && c !== lngField
                    ),
                  ].map((col) => (
                    <th key={col} className={col === latField || col === lngField ? "text-primary" : ""}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {[
                      ...(latField ? [latField] : []),
                      ...(lngField ? [lngField] : []),
                      ...columns.filter(
                        (c) => selectedCols.has(c) && c !== latField && c !== lngField
                      ),
                    ].map((col) => (
                      <td key={col} className="max-w-[120px] truncate">
                        {String(row[col] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 5 && (
              <p className="text-xs text-base-content/40 px-2 py-1">
                …and {rows.length - 5} more rows
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn btn-sm btn-primary"
            disabled={!latField || !lngField}
            onClick={handleApply}
          >
            Use this data
          </button>
          {(!latField || !lngField) && (
            <p className="text-xs text-warning">Select latitude and longitude fields to continue</p>
          )}
        </div>
      )}
    </div>
  );
}
