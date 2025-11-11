import OpenAI from "openai";
const APIKEY = process.env.OPENAI_API_KEY;
const client = new OpenAI({ apiKey: APIKEY });

export function getPrompt(dataSchema: string) {
  return `
You are an AI data analysis assistant. Your goal is to help a user visualize data from a provided CSV or JSON file using a web application.
The application expects data in a specific matrix format for charting:
- The first row (or column, if transposed) contains series names or category headers.
- The first column (or row, if transposed) contains category names or series headers.
- Categories (X-axis) are an array of strings.
- Series (Y-axis) are arrays of numbers, where the first element is a string (series name).

Example of accepted data:
[
  ["-","Category 1","Category 2"],
  ["SERIE A", 10, 20],
  ["SERIE B", 15, 25]
]
Or transposed:
[
  ["-", "SERIE A", "SERIE B"],
  ["Category 1", 10, 15],
  ["Category 2", 20, 25]
]

The application can generate multi-series bar, line, graph (network/scatter), and geo charts. Pie/donut charts are available for single Y-series.

Given the following data (provide column names, data types, and a few sample rows):
---
${dataSchema}
---

Analyze the data and provide suggestions to the user. For each suggestion:
1.  Describe the insight the user might gain in plain language.
2.  Specify the transformations needed (e.g., group by column X, sum column Y, pivot).
3.  Clearly state which column should be the X-axis (category).
4.  Clearly state which column(s) should be the Y-axis (series).
5.  Suggest an appropriate chart type (bar, line, graph, geo, pie, donut).
6.  If transformations are needed, show what the data would look like *after* transformation, formatted for the application.

Prioritize suggestions that involve grouping and aggregation for common open data scenarios. Identify potential categorical columns for grouping and numerical columns for aggregation.
Consider up to 3-5 diverse and meaningful suggestions.
If a column seems like a geographical identifier (e.g., 'Country', 'City', 'Region'), suggest a 'geo' chart if appropriate numerical data exists.

Output your suggestions in a structured JSON format.
Your entire output MUST be a single, valid JSON array. Each element in this array should be an object adhering to the "AISuggestion" interface defined below with the other response subtypes needed.

// Types for Transformation Steps
type AggregationType = 'SUM' | 'AVERAGE' | 'COUNT' | 'MIN' | 'MAX' | 'COUNT_DISTINCT';

interface TransformationStep {
  type: 'GROUP_BY' | 'AGGREGATE' | 'FILTER' | 'EXTRACT_DATE_PART' | 'PIVOT' /* etc. */;
  // Common properties
  inputColumns?: string[];
  outputColumnName?: string;

  // Specific to GROUP_BY
  groupByColumns?: string[];

  // Specific to AGGREGATE
  aggregationFunction?: AggregationType;
  columnToAggregate?: string; // The column on which the aggregation is performed

  // Specific to EXTRACT_DATE_PART
  dateColumn?: string;
  datePart?: 'YEAR' | 'MONTH' | 'QUARTER' | 'DAY_OF_WEEK';
}

interface AISuggestion {
  id: string; // Unique ID for the suggestion
  description: string; // Human-readable text, e.g., "Show Total Sales by Region as a Bar Chart"
  transformations: TransformationStep[]; // Array of transformation steps
  chartType: 'bar' | 'line' | 'graph' | 'geo' | 'pie' | 'donut'; // Suggested chart type
  xAxis: {
    sourceColumn: string; // Original column name or derived column name after transformation
    displayName?: string;  // Optional: how to display it on the chart
  };
  yAxes: {
    sourceColumn: string; // Original column name or derived column name
    aggregationFunction?: AggregationType; // If applicable, e.g., SUM, AVG
    displayName: string;   // How to display this series on the chart
  }[];
}
`;
}

function isNumeric(s: string) {
  return /^[+-]?\d+(\.\d+)?$/.test(s);
}

export function getDataSchema(inputData: (string | number)[][]) {
  const columnsNames: string[] = inputData?.[0].map((i) => "" + i);
  const numOfSampleValues = 3;
  const rowCount = inputData.length || 1;
  const columns = columnsNames.map((name: string, column: number) => {
    const type = isNumeric("" + inputData[1][column]) ? "number" : "string";
    const sample = [];
    for (let row = 1; row < numOfSampleValues; row++) {
      sample.push(inputData[row][column]);
    }
    return {
      name,
      type,
      sample,
    };
  });

  return {
    columns,
    rowCount,
  };
}

export async function getSuggestions(inputData: (string | number)[][]) {
  const dataSchema = getDataSchema(inputData);
  const prompt = getPrompt(JSON.stringify(dataSchema, null, 2));
  try {
    const response = await client.responses.create({
      model: "gpt-4o",
      input: prompt,
    });
    const text = response.output_text
      .replace(/\n/g, "")
      .replace("```json", "")
      .replace("```", "");
    const result = JSON.parse(text);
    // console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Error on OpenAi");
    console.log(error);
    throw error;
  }
}
