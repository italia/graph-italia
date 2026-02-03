import { type FieldDataType } from "dataviz-components";
import dayjs from "dayjs";
import { useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaMapMarkerAlt,
  FaRegListAlt,
  FaRegMap,
} from "react-icons/fa";
import Dialog from "./layout/Dialog";
import { RenderChart } from "dataviz-components";
import ReactMarkdown from 'react-markdown';

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


export default function ChartTable({
  list,
  handleLoadChart,
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
            name: "Name",
            selector: (row: FieldDataType) => row.name,
            sortable: true,
            cell: (row: FieldDataType) => (
              <div className="text-md font-medium">
                <div>{row.name}</div>
                <small className="truncate"><ReactMarkdown >{row.description}</ReactMarkdown></small></div>
            ),
          }, {
            name: "Type",
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
                case "point_map":
                  IconComponent = FaMapMarkerAlt;
                  break;
                case "choropleth_map":
                  IconComponent = FaRegMap;
                  break;
                default:
                  IconComponent = FaRegListAlt;
              }
              return (
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <IconComponent fill="#06c" size={24} />
                    <span className="capitalize">{row.chart}</span>
                  </div>
                </div>
              );
            },
          },


          // {
          //   name: "Preview",
          //   selector: (row: FieldDataTypeWithPreview) => row.preview,
          //   cell: (row: FieldDataTypeWithPreview) => (
          //     <div>
          //       {row.preview ? (
          //         <img
          //           src={row.preview}
          //           alt="chart preview"
          //           className="w-24 h-16 object-contain border"
          //         />
          //       ) : (
          //         <div className="w-24 h-16 flex items-center justify-center bg-base-200 border">
          //           <FaRegListAlt className="text-3xl text-base-content/50" />
          //         </div>
          //       )}
          //     </div>
          //   ),
          // },


          {
            name: "Is Remote",
            selector: (row: FieldDataType) => row.isRemote,
            cell: (row: FieldDataType) =>
              row.remoteUrl ? (
                <a
                  href={row.remoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 underline"
                >
                  link
                </a>
              ) : (
                "No"
              ),
            sortable: true,
          },
          {
            name: "Created At",
            selector: (row: FieldDataType) => row.createdAt,
            cell: (row: FieldDataType) =>
              dayjs(row.createdAt).format("YYYY-MM-DD HH:mm"),
            sortable: true,
          },
          {
            name: "Updated At",
            selector: (row: FieldDataType) => row.updatedAt,
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
            name: "preview",
            cell: (row: FieldDataType) => (
              <div className="flex gap-2">
                <button className="btn btn-sm" onClick={() => setData(row)}>
                  Preview
                </button >
                <button
                  className="btn btn-sm "
                  onClick={() =>
                    setShow(
                      `<iframe width="600" height="400" src="${window.location.origin}/embed/chart/${row.id}" frameborder="0" allowfullscreen></iframe>`,
                    )
                  }
                >
                  Embed
                </button>
              </div>)
          },
          {
            name: "Actions",
            cell: (row: FieldDataType) => (
              <div className="flex gap-2">
                <button
                  className="btn btn-sm "
                  onClick={() => handleDeleteChart(row.id)}
                >
                  Delete
                </button>

                <a
                  className="btn btn-sm "
                  href={`/edit/${row.chart === "kpiGroup" ? "kpi" : "chart"}/${row.id
                    }`}
                >
                  Edit
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
        <div className="w-full h-full p-4" width="800" height="600">
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
