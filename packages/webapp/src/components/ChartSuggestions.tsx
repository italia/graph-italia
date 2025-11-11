import { useState } from "react";
import { getSuggestions } from "../lib/api";
import type { AISuggestion, MatrixType } from "../types";
import {
  FaChartPie,
  FaChartLine,
  FaChartBar,
  FaRegMap,
  FaMapMarkerAlt,
  FaRegListAlt,
} from "react-icons/fa";
import { applySuggestion } from "../lib/transform";
import { DataTable } from "dataviz-components";

export default function ChartsSuggestions({ data }: { data: any }) {
  const [hints, setHints] = useState<AISuggestion[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSuggestions() {
    setLoading(true);
    try {
      const results = await getSuggestions(data);
      setHints(results);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='my-4'>
      {loading && (
        <div>
          <span className='mr-2'>Loading suggestions</span>
          <span className='loading loading-dots loading-xs'></span>
        </div>
      )}
      {hints.length === 0 && !loading && (
        <button
          className='btn btn-primary btn-xl my-10'
          onClick={() => handleSuggestions()}
        >
          GET SUGGESTIONS
        </button>
      )}
      {hints.length > 0 && !loading && (
        <ul className='list bg-base-100 rounded-box shadow-md'>
          <li className='p-4 pb-2 text-lg font-bold tracking-wide'>
            Suggestions:
          </li>

          {hints.map((hint: any, i: number) => {
            const processedData = applySuggestion(data, hint);
            console.log(i, processedData);
            return (
              <li className='list-row' key={hint.id}>
                <div className='px-5 pt-2'>
                  {hint.chartType === "bar" && (
                    <FaChartBar fill={"#06c"} size={24} />
                  )}
                  {hint.chartType === "line" && (
                    <FaChartLine fill={"#06c"} size={24} />
                  )}
                  {hint.chartType === "pie" ||
                    (hint.chartType === "donut" && (
                      <FaChartPie fill={"#06c"} />
                    ))}
                  {hint.chartType === "geo" && (
                    <FaRegMap fill={"#06c"} size={24} />
                  )}
                  {hint.chartType === "map" && (
                    <FaMapMarkerAlt fill={"#06c"} size={24} />
                  )}
                  {hint.chartType === "kpi" && (
                    <FaRegListAlt fill={"#06c"} size={24} />
                  )}
                </div>
                <div className='p-4'>
                  <div>{hint.description}</div>
                  <div className='text-xs uppercase font-semibold opacity-60'>
                    {hint.chartType} chart
                  </div>
                  <ul>
                    <li>X Axis: {hint.xAxis.sourceColumn}</li>
                    <li>
                      Y Axes:{" "}
                      {hint.yAxes
                        .map((item: any) => item.sourceColumn)
                        .join(", ")}
                    </li>
                  </ul>
                </div>
                <div className='p-4 border-b flex justify-end'>
                  {/* <DataTable
                    data={processedData?.chartMatrix as (string | number)[][]}
                  /> */}
                  <button className='btn btn-primary btn-xs'>Select</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
