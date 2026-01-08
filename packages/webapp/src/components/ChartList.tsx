import { type FieldDataType } from "dataviz-components";
import dayjs from "dayjs";
import { useState } from "react";

import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaMapMarkerAlt,
  FaRegListAlt,
  FaRegMap,
} from "react-icons/fa";
import Dialog from "./layout/Dialog";
// import RenderChart from "./RenderChart";

type FieldDataTypeWithPreview = FieldDataType & { preview?: string };

type ChartListProps = {
  list: FieldDataType[] | [];
  handleLoadChart: (item: FieldDataType) => void;
  handleDeleteChart: (id: string) => void;
};

// type picItem = { id: string; pic: string };

export default function ChartList({
  list,
  handleLoadChart,
  handleDeleteChart,
}: ChartListProps) {
  const [show, setShow] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {list?.map((item) => {
        const updatedAt = item.updatedAt || "";
        // const pic = picList.find((i) => i.id === item.id);
        return (
          <div className="w-full" key={item.id}>
            <div className="flex flex-wrap gap-2 border p-2">
              {/* {(item as FieldDataTypeWithPreview).preview && (
								<img
									src={(item as FieldDataTypeWithPreview).preview}
									alt="chart"
									style={{
										maxWidth: 160,
										maxHeight: 160,
									}}
									className="m-2"
								/>
							)} */}
              {/* @ts-expect-error react-icons type issue */}
              {item.chart === "bar" && <FaChartBar fill="#06c" size={24} />}
              {/* @ts-expect-error react-icons type issue */}
              {item.chart === "line" && <FaChartLine fill="#06c" size={24} />}
              {/* @ts-expect-error react-icons type issue */}
              {item.chart === "pie" && <FaChartPie fill="#06c" />}
              {/* @ts-expect-error react-icons type issue */}
              {item.chart === "geo" && <FaRegMap fill="#06c" size={24} />}
              {/* @ts-expect-error react-icons type issue */}
              {item.chart === "map" && <FaMapMarkerAlt fill="#06c" size={24} />}
              {(item.chart === "kpi" || item.chart === "kpigroup") && (
                // @ts-expect-error react-icons type issue
                <FaRegListAlt fill="#06c" size={24} />
              )}

              <div className="grow flex flex-col justify-start  pb-4">
                <div className="text-md">{item.name}</div>
                <span>
                  {updatedAt && (
                    <small className={`text-xxs text-content opacity-70 pr-4`}>
                      {dayjs(updatedAt).format("DD/MM/YYYY HH:mm")}
                    </small>
                  )}
                  <small
                    className={`text-xxs text-content opacity-70 pr-4 ${
                      item.publish ? "text-success" : "text-content"
                    }`}
                  >
                    {item.publish ? "public" : "private"}
                  </small>

                  <small
                    className={`text-xxs text-content opacity-70 pr-4 ${
                      item.isRemote ? "text-primary" : "text-content"
                    }`}
                  >
                    {item.isRemote ? "remote" : ""}
                  </small>
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-error btn-sm"
                  onClick={() => handleDeleteChart(item.id || "")}
                >
                  DELETE
                </button>
                {item.publish && (
                  <>
                    <button
                      className="btn btn-outline  btn-sm"
                      onClick={() =>
                        setShow(
                          `<iframe src="${window.location.origin}/charts/${item.id}/embed" width="100%" height="400px" frameborder="0"></iframe>`
                        )
                      }
                    >
                      EMBED
                    </button>
                    <a
                      className="btn btn-outline btn-success btn-sm"
                      target="_blank"
                      href={`/charts/${item.id}/view`}
                    >
                      VIEW
                    </a>
                  </>
                )}
                <a
                  className="btn btn-outline btn-primary btn-sm"
                  // onClick={() => handleLoadChart(item)}
                  href={`/edit/${item.chart === "kpiGroup" ? "kpi" : "chart"}/${
                    item.id
                  }`}
                >
                  EDIT
                </a>
              </div>
            </div>
          </div>
        );
      })}

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
