// Re-applies, server side, the data-shaping recipe the webapp editor saves in
// chart config.dataTransform: column selection (category + series) and the
// optional group-by aggregation. Remote-linked charts get their data
// re-downloaded periodically (see routes/charts.ts): without replaying the
// recipe, the raw CSV would overwrite whatever the user built in the editor.
//
// The semantics deliberately mirror the webapp's SeriesSelector
// (packages/webapp/src/components/load-data/SeriesSelector.tsx): numeric
// detection, insertion-ordered group-by, 2-decimal rounding, numeric cleanup
// of every value column.

export type Matrix = (string | number)[][];

export type DataTransform = {
	version: 1;
	/** Category (label) column name, trimmed */
	category: string;
	/** Selected series column names, trimmed (post-aggregation names) */
	series: string[];
	aggregation?: {
		fn: "count" | "sum" | "mean";
		/** Column name used for the row count (localized in the editor) */
		countLabel?: string;
	};
};

export function isDataTransform(value: unknown): value is DataTransform {
	if (typeof value !== "object" || value === null) return false;
	const t = value as Record<string, unknown>;
	return (
		t.version === 1 &&
		typeof t.category === "string" &&
		Array.isArray(t.series) &&
		t.series.every((s) => typeof s === "string")
	);
}

function canBeNumber(v: string | number): boolean {
	if (typeof v === "number") return !Number.isNaN(v);
	const trimmed = String(v).trim();
	if (trimmed === "") return false;
	return !Number.isNaN(Number(trimmed));
}

function isNumericColumn(matrix: Matrix, colIndex: number): boolean {
	for (let i = 1; i < matrix.length; i++) {
		const cell = matrix[i]?.[colIndex];
		if (cell !== null && cell !== undefined && cell !== "" && !canBeNumber(cell)) {
			return false;
		}
	}
	return true;
}

function cleanupValue(v: string | number | null | undefined): number {
	if (!v) return 0;
	const value = parseFloat(String(v));
	return Number.isNaN(value) ? 0 : value;
}

function trimmedHeader(matrix: Matrix): string[] {
	return (matrix[0] ?? []).map((c) => String(c).trim());
}

/**
 * Replay the editor recipe on freshly downloaded raw data.
 * Returns null when the recipe no longer fits the data (e.g. the source
 * dropped or renamed a column): callers must then KEEP the existing data
 * instead of overwriting it.
 */
export function applyDataTransform(
	raw: Matrix,
	transform: DataTransform,
): Matrix | null {
	if (!Array.isArray(raw) || raw.length < 2) return null;

	let matrix = raw;

	if (transform.aggregation) {
		const header = trimmedHeader(raw);
		const catIdx = header.indexOf(transform.category);
		if (catIdx === -1) return null;

		const fn = transform.aggregation.fn;
		const valueIdxs =
			fn === "count"
				? []
				: header
						.map((_, i) => i)
						.filter((i) => i !== catIdx && isNumericColumn(raw, i));
		if (fn !== "count" && valueIdxs.length === 0) return null;

		// Insertion-ordered group-by on the category column
		const groups = new Map<string, { count: number; sums: number[] }>();
		for (let r = 1; r < raw.length; r++) {
			const key = String(raw[r]?.[catIdx] ?? "").trim();
			let group = groups.get(key);
			if (!group) {
				group = { count: 0, sums: valueIdxs.map(() => 0) };
				groups.set(key, group);
			}
			group.count++;
			valueIdxs.forEach((colIdx, i) => {
				group.sums[i] += cleanupValue(raw[r]?.[colIdx]);
			});
		}

		const aggregated: Matrix =
			fn === "count"
				? [[transform.category, transform.aggregation.countLabel ?? "conteggio"]]
				: [[transform.category, ...valueIdxs.map((i) => header[i])]];
		for (const [key, group] of groups) {
			if (fn === "count") {
				aggregated.push([key, group.count]);
			} else {
				aggregated.push([
					key,
					...group.sums.map(
						(sum) =>
							// Round to 2 decimals (also cuts float addition noise on sums)
							Math.round((fn === "mean" ? sum / group.count : sum) * 100) / 100,
					),
				]);
			}
		}
		matrix = aggregated;
	}

	// Column selection: [category, ...series] keeping the matrix column order
	// for the series, like the editor does.
	const header = trimmedHeader(matrix);
	const catIdx = header.indexOf(transform.category);
	if (catIdx === -1) return null;
	const seriesIdxs: number[] = [];
	for (let i = 0; i < header.length; i++) {
		if (i !== catIdx && transform.series.includes(header[i])) {
			seriesIdxs.push(i);
		}
	}
	if (seriesIdxs.length !== transform.series.length) return null;

	const indexes = [catIdx, ...seriesIdxs];
	return matrix.map((row, r) =>
		indexes.map((i, j) => {
			const cell = row?.[i];
			if (r === 0) return String(cell).trim();
			return j === 0 ? (cell ?? "") : cleanupValue(cell);
		}),
	);
}
