import { type FieldDataType } from "dataviz-components";
import dayjs from "dayjs";
import { useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaCode,
  FaEye,
  FaMapLocationDot,
  FaList,
  FaMap,
  FaLink,
  FaTable,
  FaRegSquare,
  FaTrashCan,
  FaPenToSquare,
  FaCopy
} from "react-icons/fa6";

import Dialog from "./layout/Dialog";
import { RenderChart } from "dataviz-components";

type FieldDataTypeWithPreview = FieldDataType & { preview?: string };

type CharTableProps = {
  list: FieldDataType[] | [];
  handleLoadChart: (item: FieldDataType) => void;
  handleDeleteChart: (id: string) => void;
};


createTheme(
  "black",
  {
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
  },
);

const actionColor = "";
const actionSize = 16;

export default function ChartTable({
  list,
  handleLoadChart: _handleLoadChart,
  handleDeleteChart,
}: CharTableProps) {
  const [show, setShow] = useState<string | null>(null);
  const [data, setData] = useState<FieldDataType | null>(null);

  const currentTheme = "default";

  return (

    <div className="flex flex-col gap-2">

      {list && <div>
        <DataTable
          columns={[{
            name: "Type",
            maxWidth: '80px',
            selector: (row: FieldDataType) => row.chart,
            cell: (row: FieldDataType) => {
              let IconComponent;
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
                    <IconComponent fill="#06c" size={24} title={row.chart} />
                    {/* <span className="capitalize">{row.chart}</span> */}
                  </div>
                </div>
              );
            },
          }, {
            name: "Name",
            selector: (row: FieldDataType) => row.name ?? "",
            sortable: true,
            cell: (row: FieldDataType) => (
              <div className="text-md font-medium">
                <div>{row.name}</div>
              </div>
            ),
          },



          {
            name: "Is Remote",
            selector: (row: FieldDataType) => row.isRemote ?? false,
            cell: (row: FieldDataType) =>
              row.remoteUrl ? (
                <div className="flex gap-2">
                  <a href={row.remoteUrl} target="_blank" rel="noopener noreferrer" >
                    <FaLink fill={actionColor} size={actionSize} title={row.remoteUrl} />
                  </a>
                  <FaCopy fill={actionColor} size={actionSize} title={"preview"} onClick={() => alert("copy")} />
                </div>
              ) : (
                "No"
              ),
            sortable: true,
          },
          {
            name: "Created At",
            selector: (row: FieldDataType) => row.createdAt ?? "",
            cell: (row: FieldDataType) =>
              dayjs(row.createdAt).format("YYYY-MM-DD HH:mm"),
            sortable: true,
          },

          {
            name: "Updated At",
            selector: (row: FieldDataType) => row.updatedAt ?? "",
            cell: (row: FieldDataType) =>
              dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm"),
            sortable: true,
          },
          {
            name: "status",
            cell: (row: FieldDataType) => (
              <div>

                {row.publish ? (
                  <span className="text-success">{`Public `}</span>
                ) : (
                  <span className="text-info">{`Private`}</span>
                )}

                <span className="ml-2">
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
                </span>

              </div>
            ),
          },
          {
            name: "Share",
            cell: (row: FieldDataType) => (
              <div className="flex gap-2">

                <FaEye fill={actionColor} size={actionSize} title={"preview"} onClick={() => setData(row)} />
                <FaCode fill={actionColor} size={actionSize} title={"embed"} onClick={() => setShow(
                  `<iframe width="600" height="400" src="${window.location.origin}/charts/${row.id}/embed" frameborder="0" allowfullscreen></iframe>`,
                )} />
                <a href={`${window.location.origin}/charts/${row.id}/view`} target="_blank" rel="noopener noreferrer">
                  <FaLink fill={actionColor} size={actionSize} title={"view"} />
                </a>
                <FaCopy fill={actionColor} size={actionSize} title={"preview"} onClick={() => alert("copy")} />
              </div>
            ),
          },

          {
            name: "Actions",
            cell: (row: FieldDataType) => (
              <div className="flex gap-2">
                <FaTrashCan fill={actionColor} size={actionSize} title={"delete"} onClick={() => handleDeleteChart(row.id ?? "")} />
                <a
                  href={`/edit/${row.chart === "kpiGroup" ? "kpi" : "chart"}/${row.id
                    }`}
                >
                  <FaPenToSquare fill={actionColor} size={actionSize} title={"edit"} onClick={() => setData(row)} />
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
      </div>}

      <Dialog
        toggle={data ? true : false}
        title="Preview Chart"
        callback={() => setData(null)}
      >
        <div className="w-full h-full p-4" style={{ width: "800px", height: "600px" }}>
          {data && <RenderChart {...data} />}
        </div>
      </Dialog>
      <Dialog
        toggle={show ? true : false}
        title="Embed This Chart"
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
