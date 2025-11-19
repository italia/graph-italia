// export type MatrixType = any; //[[string | number] | [[string] | [number]]] | [];
export type MatrixType = (string | number)[][];

export type SerieType = {
  name: string;
  data: number[];
  type: string;
};

export type FieldDataType = {
  config: ChartConfigType;
  chart: string;
  data: MatrixType | null;
  dataSource: any;
  name?: string;
  id?: string;
  description?: string;
  publish?: boolean;
  remoteUrl?: string;
  isRemote?: boolean;
  updatedAt?: string;
};

export type Step = {
  name: string;
  id: string;
  index: number;
};

export type ChartPropsType = {
  id?: string;
  data: FieldDataType;
  isMobile?: boolean;
  setEchartInstance: (i: any) => void;
  rowHeight?: number;
  hFactor?: number;
};

export type ChartConfigType = {
  colors: [] | string[];
  direction: string;
  h: number;
  labeLine: boolean;
  legend: boolean;
  legendPosition: string;
  palette: string | string[];
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
  smooth?: string | number;
  showArea?: boolean;
  showAllSymbol?: boolean;
  showPieLabels?: boolean;
  serieName?: string;
  showMapLabels?: boolean;
  areaColor?: string;
  nameProperty?: string;
  nameGap?: string;
  preview?: string;
};

export interface StoreStateType {
  data: MatrixType | null;
  chart: string;
  config: any;
  rawData: MatrixType | null;
  name: null | string;
  description?: string;
  publish: boolean;
  remoteUrl: null | string;
  isRemote: boolean;
  id: null | string;
  setId: (value: string) => void;
  setName: (value: string) => void;
  setConfig: (value: object) => void;
  setChart: (value: string) => void;
  setRawData: (value: any) => void;
  setData: (value: MatrixType | null) => void;
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

export interface PointData {
  id: number;
  name: string;
  lon: number;
  lat: number;
  region?: string; // Optional region for context
}

export interface KpiItemType {
  title: string;
  value: string | number;
  percentage?: string;
  background_color?: string;
  value_prefix?: string;
  value_suffix?: string;
  show_flow?: boolean;
  flow_value?: string | number;
  flow_direction?: "+" | "-";
  flow_detail?: string;
  footer_text?: string;
}

export type InfosType = {
  text: string;
  title?: string;
  subTitle?: string;

  labelSource?: string;
  sourceTextInfo?: string;

  labelShare?: string;
  labelUpdated?: string;
  sharedUrl?: string;
  labelTabInfo?: string;
  labelTabChart?: string;
  labelTabData?: string;

  labelDownloadData?: string;
  labelDownloadImage?: string;

  chartFooterText?: string;
};
