import { D } from "@mobily/ts-belt";



export function convertArrayOfObjectsToCSV(
	array: object[][],
	sortedKeys?: string[],
) {
	let result = "";

	const columnDelimiter = ",";
	const lineDelimiter = "\n";
	const keys = sortedKeys || Object.keys(array[0]);

	result = "";
	result += keys.join(columnDelimiter);
	result += lineDelimiter;

	array.forEach((item) => {
		let ctr = 0;
		keys.forEach((key: string) => {
			if (ctr > 0) result += columnDelimiter;

			result += item[key as keyof object];
			// eslint-disable-next-line no-plusplus
			ctr++;
		});
		result += lineDelimiter;
	});

	return result;
}

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
export function downloadCSV(
	array: object[][],
	filename: string,
	sortedKeys?: string[],
) {
	const link = document.createElement("a");
	let csv = convertArrayOfObjectsToCSV(array, sortedKeys);
	if (csv == null) return;

	if (!csv.match(/^data:text\/csv/i)) {
		csv = `data:text/csv;charset=utf-8,${csv}`;
	}

	link.setAttribute("href", encodeURI(csv));
	link.setAttribute("download", filename);
	link.click();
}

export function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export type columnItem = {
	name: string;
	selector: (row: object) => string;
	sortable: boolean;
	reorder: boolean;
};

export function getColumns(data: object[]) :columnItem[] {
	return Object.keys(data[0]).map((key) => ({
		name: key,
		selector: (row: object) => row[key as keyof object] as string,
		sortable: true,
		reorder: true,
	}));
}

export function slugify(text: string) {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w-]+/g, "") // Remove all non-word chars
		.replace(/--+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text
}

export async function preprocess(data: [[]]) {
	if (data.length < 2) return;
	const keys = (data[0] as string[]).map((k) => slugify(k));
	const json = data.slice(1).map((row) => {
		const pairs = keys.map((k, index) => {
			let value: string | number = row[index] || 0;
			if (!isNaN(value)) {
				value = Number(value);
			}
			return [k as string, value as number | string] as [
				string,
				number | string,
			];
		});
		const obj = D.fromPairs(pairs);
		return obj;
	});

	// console.log(json);
	return json as object[];
}

export function filterByCondition(
	data: object[],
	prop: string,
	f: (value: string | number) => boolean,
) {
	const result = data.filter((item: object) => {
		const value = item[prop] as string | number;
		return f(value);
	});
	return result;
}
type T = object;
export type Filter = {
	key: keyof T;
	conditionType: string;
	value: string | number;
};
export function filterDataByCondition(data: [T], condition: Filter) {
	if (isNaN(condition.value as number)) {
		if (condition.conditionType === "equals") {
			return data.filter((item: T) => item[condition.key] === condition.value);
		} else {
			return data;
		}
	}
	switch (condition.conditionType) {
		case "greaterThan":
			return filterByCondition(
				data,
				condition.key,
				(value) => typeof value === "number" && value > Number(condition.value),
			);
		case "lessThan":
			return filterByCondition(
				data,
				condition.key,
				(value) => typeof value === "number" && value < Number(condition.value),
			);
		case "equals":
			return filterByCondition(
				data,
				condition.key,
				(value) => value == condition.value,
			);
		default:
			return data;
	}
}

export function removeCols(data: object[], toRemove: string[]) {
	return data.map((item: object) => {
		toRemove.forEach((col) => {
			delete item[col];
		});
		return item;
	});
}

export function selectCols(data: object[], keys: readonly string[]) {
	return data.map((item: object) => {
		return D.selectKeys(item, keys as readonly never[]);
	});
}

export function cleanupColumn(
	data: object[],
	prop: string,
	f: (value: string | number) => number,
) {
	const result = data.map((item: object) => {
		item[prop] = f(item[prop]);
		return item;
	});
	return result;
}

export function getUniqValues(array, field) {
	const set = new Set(array.map((i) => i[field]));
	const values = [];
	for (const v of set) {
		values.push(v);
	}
	return values;
}

export function getUniqFieldValues(array, field) {
	return Object.keys(
		array.reduce((obj, item) => {
			const tf = item[field];
			if (!obj[tf]) {
				obj[tf] = 1;
			}
			return obj;
		}, {}),
	);
}

export function aggregate(data: object[], groupByField: string) {
	const grouped = data.reduce((group, obj) => {
		const value = obj[groupByField];
		if (!group[value]) {
			group[value] = [];
		}
		group[value].push(obj);
		return group;
	}, []);

	const result = Object.values(grouped).reduce((acc, items) => {
		const aggregatedItem = { [groupByField]: items[0][groupByField] };
		const keys = Object.keys(items[0]).filter((k) => k !== groupByField);

		keys.forEach((field) => {
			if (typeof items[0][field] === "number") {
				aggregatedItem[field] = items.reduce(
					(sum: number, item: object) => sum + item[field],
					0,
				);
			} else {
				aggregatedItem[field] = items[0][field];
			}
		});
		acc.push(aggregatedItem);
		return acc;
	}, []);

	return result;
}

export function cleanupCurrency(value: string | number) {
	const num = (`${value}` satisfies string)
		.replace("€", "")
		.replace(".", "")
		.replace(",", ".")
		.replace(" ", "")
		.trim();

	return Number(num);
}

export function cleanCurrencyFields(data: object[], fields: string[]) {
	let cleaned = data;
	fields.forEach((field) => {
		cleaned = cleanupColumn(cleaned, field, cleanupCurrency)
			.filter((item) => !isNaN(item[field]))
			.filter((item) => item[field] >= 0);
	});
	return cleaned;
}

export function removeArraysFromObjects(data: object[]) {
	return data.map((item) => {
		const newItem: { [key: string]: string | number } = {};
		Object.entries(item).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				newItem[key] = value.join("|");
			} else if (value && typeof value === "string" && value.includes(",")) {
				newItem[key] = `${value.split(",").join("|")}`;
			} else {
				newItem[key] = value;
			}
		});
		return newItem;
	});
}

export function getDistinctValues(data: object[], column: string) {
	const distinctValues = Array.from(new Set(data.map((item) => item[column])));
	return distinctValues;
}
