import { type FieldDataType } from "dataviz-components";
import dayjs from "dayjs";
import { useCallback, useRef, useState } from "react";
import DataTable, {
  createTheme,
  type TableColumn,
} from "react-data-table-component";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaCode,
  FaCopy,
  FaEye,
  FaLink,
  FaList,
  FaMap,
  FaMapLocationDot,
  FaPenToSquare,
  FaRegSquare,
  FaTrashCan,
} from "react-icons/fa6";
import { useAriaSort } from "../hooks/useAriaSort";
import { useSettingsStore } from "../store/settings_store.ts";

import { RenderChart } from "dataviz-components";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCopyToClipboard } from "usehooks-ts";
import Dialog from "./layout/Dialog";

type FieldDataTypeWithPreview = FieldDataType & { preview?: string };

type CharTableProps = {
  list: FieldDataType[] | [];
  handleLoadChart: (item: FieldDataType) => void;
  handleDeleteChart: (id: string) => void;
};

createTheme("dark", {
  text: {
    primary: "rgba(255,255,255, 0.54)",
    secondary: "rgba(255,255,255, 0.54)",
    disabled: "rgba(255,255,255, 0.38)",
  },
  background: {
    default: "#trasnparent",
  },
  divider: {
    default: "rgba(255,255,255,.075)",
  },
  highlightOnHover: {
    default: "rgba(255,255,255,.03)",
    text: "#fff",
  },
});

export default function ChartTable({
  list,
  handleDeleteChart,
}: CharTableProps) {
  const { t } = useTranslation("components", {
    keyPrefix: "components.chartTable",
  });
  const [show, setShow] = useState<string | null>(null);
  const [data, setData] = useState<FieldDataType | null>(null);

  const { settings } = useSettingsStore();
  const currentTheme = settings?.preferredTheme === "dark" ? "dark" : "default";

  const actionColor = currentTheme === "dark" ? "#fff" : "#111";
  const actionSize = 16;

  const [sortState, setSortState] = useState<{
    columnKey: string;
    direction: "asc" | "desc";
  } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  useAriaSort(tableRef, sortState);

  const handleSort = useCallback(
    (
      column: TableColumn<FieldDataTypeWithPreview>,
      direction: "asc" | "desc",
    ) => {
      const key = typeof column.name === "string" ? column.name : "";
      if (key) {
        setSortState({ columnKey: key, direction });
      }
    },
    [],
  );

  const [copiedText, copy] = useCopyToClipboard();
  const [copyStatus, setCopyStatus] = useState<string>("");

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        toast.success("Copied to clipboard!");
        setCopyStatus("Copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
        toast.error("Failed to copy!");
        setCopyStatus("Failed to copy!");
      });
  };

  const navigate = useNavigate();
  function handleRowClick(item: FieldDataType) {
    const path = `/edit/${item.chart === "kpiGroup" ? "kpi" : "chart"}/${item.id}`;
    navigate(path);
  }

  const COLUMNS_TRANSLATION_KEY_PATH = `columns`;

  return (
    <div className="flex flex-col gap-2">
      <div role="status" aria-live="polite" className="sr-only">
        {copyStatus}
      </div>

      {list && (
        <div ref={tableRef}>
          <DataTable
            onRowClicked={(row) => handleRowClick(row)}
            onSort={handleSort}
            columns={[
              {
                name: t(`${COLUMNS_TRANSLATION_KEY_PATH}.type.label`),
                maxWidth: "80px",
                selector: (row: FieldDataType) => row.chart,
                sortable: true,
                cell: (row: FieldDataType) => {
                  // let iconName = "";
                  let IconComponent = FaRegSquare;
                  switch (row.chart) {
                    case "bar":
                      IconComponent = FaChartBar;
                      break;
                    case "line":
                      IconComponent = FaChartLine;
                      break;
                    case "pie":
                      IconComponent = FaChartPie;
                      break;
                    case "kpiGroup":
                      IconComponent = FaList;
                      break;
                    case "point_map":
                      IconComponent = FaMapLocationDot;
                      break;
                    case "map":
                    case "geo":
                      IconComponent = FaMap;
                      break;
                    default:
                      IconComponent = FaRegSquare;
                  }
                  return (
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <IconComponent
                          fill={currentTheme === "dark" ? "#fff" : "#06c"}
                          size={24}
                          aria-hidden="true"
                        />
                        <span className="capitalize">{row.chart}</span>
                      </div>
                    </div>
                  );
                },
              },
              {
                name: t(`${COLUMNS_TRANSLATION_KEY_PATH}.name.label`),
                selector: (row: FieldDataType) => row.name ?? "",
                sortable: true,
                cell: (row: FieldDataType) => (
                  <div className="text-md font-medium">
                    <div>{row.name}</div>
                  </div>
                ),
              },

              {
                name: t(`${COLUMNS_TRANSLATION_KEY_PATH}.isRemote.label`),
                selector: (row: FieldDataType) => row.isRemote ?? false,
                cell: (row: FieldDataType) =>
                  row.remoteUrl ? (
                    <div className="flex gap-2">
                      <a
                        href={row.remoteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="open remote URL"
                        className="btn btn-ghost btn-xs btn-square"
                      >
                        <FaLink
                          fill={actionColor}
                          size={actionSize}
                          aria-hidden="true"
                        />
                      </a>
                      <button
                        type="button"
                        aria-label="copy remote URL"
                        className="btn btn-ghost btn-xs btn-square"
                        onClick={handleCopy(`${row.remoteUrl || ""}`)}
                      >
                        <FaCopy
                          fill={actionColor}
                          size={actionSize}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  ) : (
                    "No"
                  ),
                sortable: true,
              },
              {
                name: t(`${COLUMNS_TRANSLATION_KEY_PATH}.createdAt.label`),
                selector: (row: FieldDataType) => row.createdAt ?? "",
                cell: (row: FieldDataType) =>
                  dayjs(row.createdAt).format("YYYY-MM-DD HH:mm"),
                sortable: true,
              },

              {
                name: t(`${COLUMNS_TRANSLATION_KEY_PATH}.updatedAt.label`),
                selector: (row: FieldDataType) => row.updatedAt ?? "",
                cell: (row: FieldDataType) =>
                  dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm"),
                sortable: true,
              },
              {
                name: t(`${COLUMNS_TRANSLATION_KEY_PATH}.visibility.label`),
                cell: (row: FieldDataType) => (
                  <div>
                    {row.publish ? (
                      <span className="text-content">
                        {t(
                          `${COLUMNS_TRANSLATION_KEY_PATH}.visibility.values.public`,
                        )}{" "}
                      </span>
                    ) : (
                      <span className="text-content">
                        {" "}
                        {t(
                          `${COLUMNS_TRANSLATION_KEY_PATH}.visibility.values.private`,
                        )}{" "}
                      </span>
                    )}

                    {/* <span className="ml-2">
                  {row.publish ? (
                    <button
                      className="btn btn-xs "
                      onClick={() => console.log("Make Private")}
                    >
                      Toggle
                    </button>
                  ) : (
                    <button
                      className="btn btn-xs "
                      onClick={() => console.log("Make Public")}
                    >
                      Toggle
                    </button>
                  )}
                </span> */}
                  </div>
                ),
              },
              {
                name: t(`${COLUMNS_TRANSLATION_KEY_PATH}.share.label`),
                cell: (row: FieldDataType) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="preview"
                      className="btn btn-ghost btn-xs btn-square"
                      onClick={() => setData(row)}
                    >
                      <FaEye
                        fill={actionColor}
                        size={actionSize}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      aria-label="embed"
                      className="btn btn-ghost btn-xs btn-square"
                      onClick={() =>
                        setShow(
                          `<iframe width="600" height="400" src="${window.location.origin}/charts/${row.id}/embed" frameborder="0" allowfullscreen></iframe>`,
                        )
                      }
                    >
                      <FaCode
                        fill={actionColor}
                        size={actionSize}
                        aria-hidden="true"
                      />
                    </button>
                    <a
                      href={`${window.location.origin}/charts/${row.id}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="view"
                      className="btn btn-ghost btn-xs btn-square"
                    >
                      <FaLink
                        fill={actionColor}
                        size={actionSize}
                        aria-hidden="true"
                      />
                    </a>
                    <button
                      type="button"
                      aria-label="copy link"
                      className="btn btn-ghost btn-xs btn-square"
                      onClick={handleCopy(
                        `${window.location.origin}/charts/${row.id}/view`,
                      )}
                    >
                      <FaCopy
                        fill={actionColor}
                        size={actionSize}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                ),
              },

              {
                name: t(`${COLUMNS_TRANSLATION_KEY_PATH}.actions.label`),
                cell: (row: FieldDataType) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="delete"
                      className="btn btn-ghost btn-xs btn-square"
                      onClick={() => handleDeleteChart(row.id ?? "")}
                    >
                      <FaTrashCan
                        fill={actionColor}
                        size={actionSize}
                        aria-hidden="true"
                      />
                    </button>
                    <a
                      href={`/edit/${row.chart === "kpiGroup" ? "kpi" : "chart"}/${
                        row.id
                      }`}
                      aria-label="edit"
                      className="btn btn-ghost btn-xs btn-square"
                    >
                      <FaPenToSquare
                        fill={actionColor}
                        size={actionSize}
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                ),
              },
            ]}
            data={list as FieldDataTypeWithPreview[]}
            theme={currentTheme}
            pagination
            highlightOnHover
          />
        </div>
      )}

      <Dialog
        toggle={data ? true : false}
        title={t(`modals.previewChart.title`)}
        callback={() => setData(null)}
      >
        <div className="w-full h-full p-4" style={{ minHeight: "400px" }}>
          {data && <RenderChart {...data} />}
        </div>
      </Dialog>
      <Dialog
        toggle={show ? true : false}
        title={t(`modals.embedChart.title`)}
        callback={() => setShow(null)}
      >
        <div className="mockup-code">
          <pre data-prefix="">
            <code>{show}</code>
          </pre>
        </div>
      </Dialog>
    </div>
  );
}
