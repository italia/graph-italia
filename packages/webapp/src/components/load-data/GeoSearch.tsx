import { useRef, useState } from "react";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";

const LS_KEY = "here_api_key";
const HERE_GEOCODE_URL = "https://geocode.search.hereapi.com/v1/geocode";

interface HereAddress {
  label: string;
  city?: string;
  countryName?: string;
  postalCode?: string;
  state?: string;
}

interface HereResult {
  id: string;
  title: string;
  position: { lat: number; lng: number };
  address: HereAddress;
  resultType: string;
}

interface GeoSearchProps {
  dataSource: object[];
  latField: string;
  lngField: string;
  onAddPoints: (points: object[]) => void;
}

function getStoredApiKey(): string {
  return (
    (import.meta as any).env?.VITE_HERE_API_KEY ||
    localStorage.getItem(LS_KEY) ||
    ""
  );
}

/**
 * Build a point object that matches the existing dataSource schema.
 * Unknown fields are filled with empty string.
 * If no schema exists yet, use a sensible default.
 */
function buildPoint(
  result: HereResult,
  dataSource: object[],
  latField: string,
  lngField: string,
): Record<string, string | number> {
  if (dataSource.length === 0) {
    return {
      [latField]: result.position.lat,
      [lngField]: result.position.lng,
      name: result.title,
      address: result.address.label,
      city: result.address.city ?? "",
      country: result.address.countryName ?? "",
    };
  }

  const point: Record<string, string | number> = {};
  for (const key of Object.keys(dataSource[0] as object)) {
    if (key === latField) {
      point[key] = result.position.lat;
    } else if (key === lngField) {
      point[key] = result.position.lng;
    } else if (/^name$/i.test(key) || /^title$/i.test(key)) {
      point[key] = result.title;
    } else if (/^(address|addr|label)$/i.test(key)) {
      point[key] = result.address.label;
    } else if (/^city$/i.test(key)) {
      point[key] = result.address.city ?? "";
    } else if (/^(country|countryName|nation)$/i.test(key)) {
      point[key] = result.address.countryName ?? "";
    } else if (/^(postal|postalCode|zip)$/i.test(key)) {
      point[key] = result.address.postalCode ?? "";
    } else {
      point[key] = "";
    }
  }
  return point;
}

export default function GeoSearch({
  dataSource,
  latField,
  lngField,
  onAddPoints,
}: GeoSearchProps) {
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey);
  const [showKeyInput, setShowKeyInput] = useState(!getStoredApiKey());
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HereResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function saveApiKey(key: string) {
    localStorage.setItem(LS_KEY, key);
    setApiKey(key);
    setShowKeyInput(false);
  }

  async function search() {
    const key = apiKey.trim();
    if (!key) {
      setShowKeyInput(true);
      return;
    }
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(new Set());

    try {
      const url = new URL(HERE_GEOCODE_URL);
      url.searchParams.set("q", query.trim());
      url.searchParams.set("apiKey", key);
      url.searchParams.set("limit", "7");
      url.searchParams.set("lang", "en");

      const res = await fetch(url.toString());
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError("Invalid HERE API key.");
          setShowKeyInput(true);
        } else {
          setError(`Geocoding error: ${res.status}`);
        }
        return;
      }
      const json = await res.json();
      setResults(json.items ?? []);
      if ((json.items ?? []).length === 0) {
        setError("No results found.");
      }
    } catch {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function toggleResult(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    const toAdd = results
      .filter((r) => selected.has(r.id))
      .map((r) => buildPoint(r, dataSource, latField, lngField));
    onAddPoints(toAdd);
    setSelected(new Set());
    setResults([]);
    setQuery("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Add points by location search</p>
        <button
          type="button"
          className="btn btn-xs btn-ghost opacity-50"
          onClick={() => setShowKeyInput((v) => !v)}
          title="Configure HERE API key"
        >
          API key
        </button>
      </div>

      {/* API key inline config */}
      {showKeyInput && (
        <ApiKeyForm
          initialValue={apiKey}
          onSave={saveApiKey}
          onCancel={() => setShowKeyInput(false)}
        />
      )}

      {/* Search bar */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="input input-bordered input-sm flex-1"
          placeholder='Search a location, e.g. "Paris" or "Eiffel Tower"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          disabled={loading}
        />
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={search}
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <FaSearch />
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-error py-2 text-sm">{error}</div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-base-content/50">{results.length} results — select to add</p>
          <ul className="space-y-1">
            {results.map((r) => {
              const isSelected = selected.has(r.id);
              return (
                <li key={r.id}>
                  <label
                    className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer border transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-base-200 hover:border-base-300 hover:bg-base-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary mt-0.5 flex-shrink-0"
                      checked={isSelected}
                      onChange={() => toggleResult(r.id)}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{r.title}</p>
                      <p className="text-xs text-base-content/50 truncate">
                        {r.address.label}
                      </p>
                      <p className="text-xs text-base-content/40 font-mono">
                        {r.position.lat.toFixed(5)}, {r.position.lng.toFixed(5)}
                      </p>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              className="btn btn-sm btn-primary gap-2"
              disabled={selected.size === 0}
              onClick={handleAdd}
            >
              <FaPlus className="text-xs" />
              Add {selected.size > 0 ? selected.size : ""} point{selected.size !== 1 ? "s" : ""}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => { setResults([]); setSelected(new Set()); }}
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ApiKeyForm({
  initialValue,
  onSave,
  onCancel,
}: {
  initialValue: string;
  onSave: (key: string) => void;
  onCancel: () => void;
}) {
  const [val, setVal] = useState(initialValue);
  return (
    <div className="flex gap-2 items-center p-3 rounded-lg bg-base-200 border border-base-300">
      <input
        type="password"
        className="input input-bordered input-xs flex-1 font-mono"
        placeholder="HERE API key"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && val.trim() && onSave(val.trim())}
        autoFocus
      />
      <button
        type="button"
        className="btn btn-xs btn-primary"
        disabled={!val.trim()}
        onClick={() => onSave(val.trim())}
      >
        Save
      </button>
      {initialValue && (
        <button type="button" className="btn btn-xs btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );
}
