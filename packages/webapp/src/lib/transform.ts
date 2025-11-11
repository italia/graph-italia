import {
  RawDataset,
  AggregationType,
  RawDataRow,
  AISuggestion,
  ProcessedChartData,
} from "../types";

// --- Helper Functions for Transformations ---
function extractDatePart(
  dataset: RawDataset,
  dateColumn: string,
  part: "YEAR" | "MONTH" | "QUARTER" | "DAY_OF_WEEK",
  outputColumnName: string
): RawDataset {
  return dataset.map((row) => {
    const dateVal = row[dateColumn];
    let extractedPart: string | number = "";
    if (dateVal instanceof Date) {
      const d = dateVal;
      if (part === "YEAR") extractedPart = d.getFullYear();
      else if (part === "MONTH") extractedPart = d.getMonth() + 1; // 1-12
      // Add more parts as needed
    } else if (typeof dateVal === "string") {
      // Basic string parsing, robust date library like date-fns or moment.js recommended
      try {
        const d = new Date(dateVal);
        if (part === "YEAR") extractedPart = d.getFullYear();
        else if (part === "MONTH") extractedPart = d.getMonth() + 1;
      } catch (e) {
        console.warn(`Could not parse date string: ${dateVal}`);
      }
    }
    return { ...row, [outputColumnName]: extractedPart };
  });
}

function groupByAndAggregate(
  dataset: RawDataset,
  groupByColumns: string[],
  aggregations: { column: string; func: AggregationType; outputName: string }[]
): RawDataset {
  if (!groupByColumns.length || !aggregations.length) return dataset;

  const grouped = new Map<string, RawDataRow[]>();

  // Group rows
  dataset.forEach((row) => {
    const key = groupByColumns.map((col) => String(row[col])).join("||"); // Composite key
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(row);
  });

  const result: RawDataset = [];
  grouped.forEach((rowsInGroup) => {
    const aggregatedRow: RawDataRow = {};

    // Add group by columns to the result row
    groupByColumns.forEach((col) => {
      aggregatedRow[col] = rowsInGroup[0][col]; // All rows in group have same value for these
    });

    // Perform aggregations
    aggregations.forEach((agg) => {
      const values = rowsInGroup
        .map((r) => Number(r[agg.column]))
        .filter((n) => !isNaN(n));
      if (
        !values.length &&
        agg.func !== "COUNT" &&
        agg.func !== "COUNT_DISTINCT"
      ) {
        aggregatedRow[agg.outputName] = 0; // Or null/undefined
        return;
      }

      switch (agg.func) {
        case "SUM":
          aggregatedRow[agg.outputName] = values.reduce(
            (sum, val) => sum + val,
            0
          );
          break;
        case "AVERAGE":
          aggregatedRow[agg.outputName] =
            values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case "COUNT":
          aggregatedRow[agg.outputName] = rowsInGroup.length; // Count all rows in group
          break;
        case "MIN":
          aggregatedRow[agg.outputName] = Math.min(...values);
          break;
        case "MAX":
          aggregatedRow[agg.outputName] = Math.max(...values);
          break;
        case "COUNT_DISTINCT":
          aggregatedRow[agg.outputName] = new Set(
            rowsInGroup.map((r) => r[agg.column])
          ).size;
          break;
      }
    });
    result.push(aggregatedRow);
  });
  return result;
}

// --- Main Processor ---

export function applySuggestion(
  dataset: RawDataset,
  suggestion: AISuggestion
): ProcessedChartData | null {
  let workingDataset = [...dataset];
  let currentGroupByColumns: string[] = []; // Keep track of columns used for grouping
  console.log("suggestion", suggestion);
  // Apply transformations
  for (const step of suggestion.transformations) {
    switch (step.type) {
      case "EXTRACT_DATE_PART":
        if (step.dateColumn && step.datePart && step.outputColumnName) {
          workingDataset = extractDatePart(
            workingDataset,
            step.dateColumn,
            step.datePart,
            step.outputColumnName
          );
        }
        break;
      case "GROUP_BY":
        if (step.groupByColumns) {
          currentGroupByColumns = step.groupByColumns; // Store for aggregation step
          // Note: Actual grouping happens with aggregation in this simplified model
          // More complex scenarios might pre-group or sort here.
        }
        break;
      case "AGGREGATE":
        if (
          currentGroupByColumns.length > 0 &&
          step.columnToAggregate &&
          step.aggregationFunction &&
          step.outputColumnName
        ) {
          workingDataset = groupByAndAggregate(
            workingDataset,
            currentGroupByColumns,
            [
              {
                column: step.columnToAggregate,
                func: step.aggregationFunction,
                outputName: step.outputColumnName,
              },
            ]
          );
          // After aggregation, the dataset structure changes.
          // The new currentGroupByColumns for further steps would be the original ones plus the new aggregated column.
          // For simplicity, we assume one main aggregation after grouping.
          // If multiple AGGREGATE steps for the same group, they should be defined together for groupByAndAggregate.
        } else if (
          currentGroupByColumns.length === 0 &&
          step.columnToAggregate &&
          step.aggregationFunction &&
          step.outputColumnName
        ) {
          // Aggregate without explicit group by (e.g., total sum of a column for the whole dataset)
          // This would typically result in a single row or value.
          // For charting, usually we need a category, so this might be less common directly from suggestions.
          console.warn(
            "AGGREGATE without GROUP_BY might not be directly chartable as multi-point series."
          );
        }
        break;
      // Add cases for 'FILTER', 'PIVOT', etc.
      default:
        console.warn(`Unsupported transformation type: ${step.type}`);
    }
  }

  // Format for your charting application
  // Your app expects: [["-","T 1","T 2"], ["SERIE 1",74,75], ["SERIE 2",91,7 ]]
  // or transposed. Let's assume the first format (series as rows).
  const chartMatrix: (string | number)[][] = [];

  if (!workingDataset.length) {
    console.warn("No data after transformations.");
    return null;
  }

  const xCategories = Array.from(
    new Set(
      workingDataset.map((row) => String(row[suggestion.xAxis.sourceColumn]))
    )
  );
  xCategories.sort(); // Optional: sort categories

  const headerRow: (string | number)[] = ["-", ...xCategories];
  chartMatrix.push(headerRow);

  for (const yAxisDef of suggestion.yAxes) {
    const seriesRow: (string | number)[] = [yAxisDef.displayName];
    for (const category of xCategories) {
      const dataPoint = workingDataset.find(
        (row) => String(row[suggestion.xAxis.sourceColumn]) === category
      );
      // The yAxisDef.sourceColumn is the name of the column in the *transformed* dataset
      seriesRow.push(dataPoint ? Number(dataPoint[yAxisDef.sourceColumn]) : 0); // Or handle missing data
    }
    chartMatrix.push(seriesRow);
  }

  return {
    chartMatrix,
    chartType: suggestion.chartType,
    xAxisLabel: suggestion.xAxis.displayName || suggestion.xAxis.sourceColumn,
    yAxisLabels: suggestion.yAxes.map((y) => y.displayName),
  };
}
