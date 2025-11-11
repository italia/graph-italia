export type MatrixType = (string | number)[][];

export type SerieType = {
  name: string;
  data: number[];
  type: string;
};

export type FieldDataType = {
  config: ChartConfigType;
  dataSource?: object[];
  chart: string;
  data: MatrixType | null;
  name?: string;
  id?: string;
  description?: string;
  publish?: boolean;
  remoteUrl?: string;
  isRemote?: boolean;
  preview?: string;
};

export type Step = {
  name: string;
  id: string;
  index: number;
};

type THFactor = 1 | 2 | 3 | 4;

export type ChartPropsType = {
  id?: string;
  data: FieldDataType;
  isMobile?: boolean;
  setEchartInstance: (i: any) => void;
  isFullH: false;
  hFactor?: THFactor;
};

export type ChartConfigType = {
  colors: [] | string[];
  direction: string;
  h: number;
  labeLine: boolean;
  legend: boolean;
  legendPosition: string;
  palette: string[];
  tooltip: boolean;
  tooltipFormatter: string;
  valueFormatter: string;
  totalLabel: string;
  tooltipTrigger: string;
  xLabel?: string;
  yLabel?: string;
  responsive?: boolean;
  zoom?: string;
  geoJsonUrl?: string;
  stack?: boolean;
  gridLeft?: string | number;
  gridRight?: string | number;
  gridTop?: string | number;
  gridBottom?: string | number;
  gridHeight?: string | number;
  gridWidth?: string | number;
  visualMap?: boolean;
  visualMapLeft?: string;
  visualMapOrient?: string;
  background?: string;
  smooth?: boolean;
  showArea?: boolean;
  showAllSymbol?: boolean;
  showPieLabels?: boolean;
  serieName?: string;
  showMapLabels?: boolean;
  areaColor?: string;
  nameProperty?: string;
};

export interface StoreStateType {
  data: MatrixType | null;
  dataSource?: object[];
  chart: string;
  config: any;
  rawData: MatrixType | null;
  name: null | string;
  description?: string;
  publish: boolean;
  remoteUrl: null | string;
  isRemote: boolean;
  id: null | string;
  preview: string;
  setPreview: (value: string) => void;
  setId: (value: string) => void;
  setName: (value: string) => void;
  setConfig: (value: object) => void;
  setChart: (value: string) => void;
  setRawData: (value: any) => void;
  setData: (value: MatrixType | null) => void;
  setDataSource: (value: object[] | []) => void;
  loadItem: (value: any) => void;
  resetItem: () => void;
  setRemoteUrl: (value: string | null) => void;
  setIsRemote: (value: boolean) => void;
}

export interface RemoteStoreStateType {
  list: [] | FieldDataType[];
  addItem: (item: FieldDataType) => void;
  removeItem: (id: string) => void;
  updateItem: (item: FieldDataType) => void;
  setList: (items: FieldDataType[]) => void;
}

// Types for your raw data
export type DataValue = string | number | Date; // Dates should ideally be Date objects or ISO strings
export interface RawDataRow {
  [key: string]: DataValue;
}
export type RawDataset = RawDataRow[];

// Structure for an AI Suggestion
export interface AISuggestion {
  id: string; // Unique ID for the suggestion
  description: string; // Human-readable text, e.g., "Show Total Sales by Region as a Bar Chart"
  transformations: TransformationStep[]; // Array of transformation steps
  chartType: "bar" | "line" | "map" | "geo" | "pie" | "donut"; // Suggested chart type
  xAxis: {
    sourceColumn: string; // Original column name or derived column name after transformation
    displayName?: string; // Optional: how to display it on the chart
  };
  yAxes: {
    sourceColumn: string; // Original column name or derived column name
    aggregationFunction?: AggregationType; // If applicable, e.g., SUM, AVG
    displayName: string; // How to display this series on the chart
  }[];
}

// Types for Transformation Steps
export type AggregationType =
  | "SUM"
  | "AVERAGE"
  | "COUNT"
  | "MIN"
  | "MAX"
  | "COUNT_DISTINCT";

export interface TransformationStep {
  type:
    | "GROUP_BY"
    | "AGGREGATE"
    | "FILTER"
    | "EXTRACT_DATE_PART"
    | "PIVOT" /* etc. */;
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
  datePart?: "YEAR" | "MONTH" | "QUARTER" | "DAY_OF_WEEK";

  // ... other properties for other transformation types
}

export interface ProcessedChartData {
  chartMatrix: (string | number)[][]; // Your app's expected matrix format
  chartType: AISuggestion["chartType"];
  xAxisLabel: string;
  yAxisLabels: string[];
}
