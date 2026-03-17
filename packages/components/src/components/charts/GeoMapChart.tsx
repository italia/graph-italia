import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { formatTooltip } from "../../lib/utils";
import type { ChartPropsType, FieldDataType } from "../../types";
import { useResolvedTheme } from "../../context/ColorSchemeContext";

function GeoMapChart({
  data,
  id,
  setEchartInstance,
  hFactor = 1,
  rowHeight,
}: ChartPropsType) {
  const resolvedTheme = useResolvedTheme();
  const refCanvas = useRef<ReactEcharts>(null);
  const [error, setError] = useState("");
  const [geoData, setGeoData] = useState(null);
  const [options, setOptions] = useState(null);
  const [weDoNotHaveInstance, setWeDoNotHaveInstance] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const mapId = useMemo(() => id || `map-${Date.now()}`, [id]);

  function getOptions(data: FieldDataType, geoData: any) {
    echarts.registerMap(mapId as string, geoData);
    const config = data.config;

    const tooltip = {
      trigger: "item",
      show: config.tooltip ?? true,
      formatter: (params: any) => {
        const value = params.value;
        const name = params.name;
        const serieName = params.seriesName;
        const formattedValue = formatTooltip(value, config);
        if (serieName) {
          return `${serieName}<br/>${name} <strong>${formattedValue}</strong>`;
        }
        return `${name} <strong>${formattedValue}</strong>`;
      },
    };

    const min = Math.min(
      ...data.dataSource.series[0].data.map((d: any) => d.value)
    );
    const max = Math.max(
      ...data.dataSource.series[0].data.map((d: any) => d.value)
    );

    // const colorOpt = config.colors?.length ? { color: config.colors } : {};

    const options = {
      // ...colorOpt,
      textStyle: {
        fontFamily: "Titillium Web, sans-serif",
        fontSize: 12,
      },
      tooltip,
      dataZoom: [
        {
          type: "inside",
          disabled: config.zoom === "none",
          zoomLock: true,
          zoomOnMouseWheel: "ctrl",
          start: 20,
          end: 100,
        },
      ],
      visualMap: {
        left: config.visualMapLeft ?? "right",
        orient: config.visualMapOrient ?? "vertical",
        min,
        max,
        text: [
          `${formatTooltip(max, config)} `,
          `${formatTooltip(min, config)} `,
        ],
        inverse: config.visualMapOrient === "vertical",
        textStyle: {
          fontSize: 11,
          lineHeight: 0,
          overflow: "truncate",
        },
        padding: 15,
        calculable: false,
        ...(config.colors?.length ? { inRange: { color: config.colors } } : {}),
        show: config.visualMap || false,
      },
      series: data.dataSource.series.map((serie: any) => {
        let otherConfig = {};
        if (config.serieName) {
          otherConfig = {
            name: config.serieName,
          };
        }
        return {
          ...serie,
          ...otherConfig,
          label: {
            show: config.showMapLabels ? true : false,
            color: "inherit",
          },
          zoom: 1.2,
          roam: true,
          select: { disabled: true },
          emphasis: {
            label: {
              show: config.showMapLabels,
              color: "inherit",
            },
            itemStyle: {
              areaColor: config.areaColor || "#F2F7FC",
            },
          },
          map: mapId,
          nameProperty: config.nameProperty ? config.nameProperty : "NAME",
        };
      }),
    };
    return options;
  }

  async function getGeoData() {
    const config = data.config;
    const url = config?.geoJsonUrl || "";
    if (url) {
      try {
        const response = await fetch(url);
        const raw = await response.json();
        setGeoData(raw);
      } catch (error) {
        console.log(error);
        setError("Errore recupero dati GEO JSON");
      }
    }
  }

  useEffect(() => {
    if (data) {
      getGeoData();
    }
  }, [data]);

  useEffect(() => {
    if (geoData) {
      const options: any = getOptions(data, geoData);
      setOptions(options);
    }
  }, [geoData]);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 2000);
  }, []);
  useEffect(() => {
    if (loaded && refCanvas.current && weDoNotHaveInstance) {
      try {
        const echartInstance = refCanvas.current.getEchartsInstance();
        if (setEchartInstance) {
          setEchartInstance(echartInstance);
          setWeDoNotHaveInstance(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [loaded, refCanvas.current, weDoNotHaveInstance]);

  const chartHeight = (data.config?.h || 500) * hFactor;
  const effectiveHeight = rowHeight || chartHeight;
  return (
    <ErrorBoundary fallback={<div>Errore nel rendering della mappa</div>}>
      <div key={mapId} id={"chart_" + mapId}>
        {error && <div className="alert error">{error}</div>}
        {!geoData && <div>In attesa dei dati geo...</div>}
        {!options ? (
          <div>Loading...</div>
        ) : (
          <ReactEcharts
            option={options}
            theme={resolvedTheme}
            ref={refCanvas}
            style={{
              height: effectiveHeight,
              minHeight: effectiveHeight,
              maxHeight: "100%",
              width: "100%",
              maxWidth: "100%",
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default GeoMapChart;
