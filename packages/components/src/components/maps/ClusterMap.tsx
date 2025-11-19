import React, { useRef, useEffect, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import Cluster from "ol/source/Cluster";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import { createEmpty, extend, isEmpty } from "ol/extent";
import { click } from "ol/events/condition";
import Select from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import { fromLonLat, toLonLat } from "ol/proj";
import type { Coordinate } from "ol/coordinate";
import type { StyleLike } from "ol/style/Style";
import type { PointData, FieldDataType } from "../../types";
import "./map.css";

const styleCache: { [key: string]: Style } = {};

const circleIcon = new CircleStyle({
  radius: 5,
  fill: new Fill({ color: `#0066cc` }),
  stroke: new Stroke({ color: "#fff", width: 1.5 }),
});

interface PopupInfo {
  name: string;
  id: number;
  mapCoordinates: Coordinate; // For OL Overlay position
  displayCoordinates: string; // For showing in popup
}

const ClusterMapComponent = ({
  data,
  hFactor = 1,
  rowHeight,
}: {
  data: FieldDataType;
  hFactor: number;
  rowHeight?: number;
}) => {
  const { dataSource, config } = data;
  const { h } = config;
  const initialZoom = 2;
  const clusterDistance = 50;
  const minDistance = 20;
  const zoomOnClick = false;
  const height = rowHeight ? rowHeight * hFactor : h || 700;

  const mapElement = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const popupElementRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [currentPopupInfo, setCurrentPopupInfo] = useState<PopupInfo | null>(
    null
  );

  const [pointsData, setPointsData] = useState<PointData[] | null>(null);
  const [initialCenter, setCenter] = useState<Coordinate | null>(null);

  useEffect(() => {
    if (dataSource) {
      setPointsData(dataSource as PointData[]);
      setCenter([
        (dataSource as PointData[])[0].lon,
        (dataSource as PointData[])[0].lat,
      ]);
    }
  }, [dataSource]);

  useEffect(() => {
    if (!mapElement.current || mapRef.current || !pointsData?.length) return;

    if (popupElementRef.current && !overlayRef.current) {
      const overlay = new Overlay({
        element: popupElementRef.current,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
        positioning: "bottom-center", // How the overlay is positioned relative to its 'position'
        offset: [0, -15], // Offset from the anchor point (e.g., move it up from the marker tip)
      });
      overlayRef.current = overlay;
    }

    // If map already exists, clean it up before re-creating (e.g. on prop change)
    if (mapRef.current) {
      (mapRef as React.RefObject<Map>)
        .current!.getInteractions()
        .forEach((interaction) =>
          mapRef.current!.removeInteraction(interaction)
        );
      if (overlayRef.current) {
        (mapRef as React.RefObject<Map>).current!.removeOverlay(
          overlayRef.current
        );
      }
      (mapRef as React.RefObject<Map>).current!.setTarget(undefined);
      mapRef.current = null;
    }

    const features = pointsData.map(
      (point) =>
        new Feature({
          geometry: new Point(fromLonLat([point.lon, point.lat])),
          name: point.name,
          id: point.id,
        })
    );
    const source = new VectorSource({ features }); // Source with original individual points
    const clusterSource = new Cluster({
      distance: clusterDistance,
      minDistance: minDistance,
      source: source,
    });

    const clusterStyleFunction = (feature: Feature): Style => {
      // ... (style function as before, with dynamic color)
      const originalFeatures = feature.get("features") as Feature[];
      const size = originalFeatures.length;
      const cacheKey = `feature-${size > 1 ? "cluster-" + size : "point"}`;
      let style = styleCache[cacheKey];
      if (!style) {
        if (size > 1) {
          const opacity = Math.max(0.2, size / 100); // Adjust opacity based on sizes

          style = new Style({
            image: new CircleStyle({
              radius: 10 + Math.min(size, 20) * 0.75,
              fill: new Fill({ color: `rgba(51, 153, 204, ${opacity})` }),
              stroke: new Stroke({ color: "#fff", width: 1.5 }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({ color: "#fff" }),
              stroke: new Stroke({ color: "rgba(0, 0, 0, 0.7)", width: 3 }),
              font: "bold 12px sans-serif",
            }),
          });
        } else {
          // Individual point style - NOW USING ICON
          style = new Style({ image: circleIcon });
        }
        styleCache[cacheKey] = style;
      }
      return style;
    };

    const clustersLayer = new VectorLayer({
      source: clusterSource,
      style: clusterStyleFunction as StyleLike,
      declutter: false,
    });

    const osmLayer = new TileLayer({ source: new OSM() });
    const mapView = new View({
      center: fromLonLat(initialCenter!),
      zoom: initialZoom,
      minZoom: 4,
    });

    const initialMap = new Map({
      target: mapElement.current,
      layers: [osmLayer, clustersLayer],
      view: mapView,
      controls: [],
    });
    mapRef.current = initialMap; // Store map instance
    // --- Add Overlay to Map ---
    if (overlayRef.current) {
      initialMap.addOverlay(overlayRef.current);
    }
    // --- CLICK ON CLUSTER LOGIC ---
    const selectInteraction = new Select({
      condition: click, // Trigger on single click
      layers: [clustersLayer], // Only select features from the clustersLayer
      style: null, // Don't change style son select, we handle interaction manually
    });

    selectInteraction.on("select", (event) => {
      setCurrentPopupInfo(null); // Hide previous popup
      if (overlayRef.current) overlayRef.current.setPosition(undefined); // Hide OL overlay

      if (event.selected.length > 0) {
        const clickedFeature = event.selected[0];
        const originalFeaturesInCluster = clickedFeature.get(
          "features"
        ) as Feature[];

        if (originalFeaturesInCluster && originalFeaturesInCluster.length > 1) {
          // It's a cluster with multiple points
          const extentOfClusterFeatures = createEmpty();
          originalFeaturesInCluster.forEach((feature) => {
            extend(extentOfClusterFeatures, feature.getGeometry()!.getExtent());
          });

          if (!isEmpty(extentOfClusterFeatures)) {
            initialMap.getView().fit(extentOfClusterFeatures, {
              padding: [50, 50, 50, 50], // Add padding
              duration: 750, // Animation duration
              maxZoom: initialMap.getView().getMaxZoom() ?? 18, // Prevent over-zooming, respect map's maxZoom
            });
          }
        } else if (
          originalFeaturesInCluster &&
          originalFeaturesInCluster.length === 1
        ) {
          if (zoomOnClick) {
            const pointGeometry =
              originalFeaturesInCluster[0].getGeometry() as Point;
            if (pointGeometry) {
              initialMap.getView().animate({
                center: pointGeometry.getCoordinates(),
                zoom: Math.max(initialMap.getView().getZoom() || 0, 10), // Zoom to a fixed level or current if higher
                duration: 500,
              });
            }
          }
          // Single point click: Show Popup
          const pointFeature = originalFeaturesInCluster[0];
          const geometry = pointFeature.getGeometry() as Point;
          if (geometry) {
            const mapCoords = geometry.getCoordinates();
            const lonLatCoords = toLonLat(mapCoords); // Convert to LonLat for display

            setCurrentPopupInfo({
              name: pointFeature.get("name") || "Unknown Point",
              id: pointFeature.get("id"),
              mapCoordinates: mapCoords,
              displayCoordinates: `Lon: ${lonLatCoords[0].toFixed(
                4
              )}, Lat: ${lonLatCoords[1].toFixed(4)}`,
            });
            if (overlayRef.current) {
              overlayRef.current.setPosition(mapCoords);
            }
          }
        }
      }
      // Deselect features after processing to allow re-clicking the same cluster
      selectInteraction.getFeatures().clear();
    });

    initialMap.addInteraction(selectInteraction);
    // ------------------------------

    // --- Optional: Change cursor on hover over clusters ---
    initialMap.on("pointermove", function (e) {
      const pixel = initialMap.getEventPixel(e.originalEvent);
      const hit = initialMap.hasFeatureAtPixel(pixel, {
        layerFilter: (layer) => layer === clustersLayer,
        hitTolerance: 5, // Optional: makes it easier to hit small features
      });
      if (mapElement.current) {
        mapElement.current.style.cursor = hit ? "pointer" : "";
      }
    });
    // ----------------------------------------------------

    const extentOfAllPoints = source.getExtent();
    if (!isEmpty(extentOfAllPoints)) {
      mapView.fit(extentOfAllPoints, {
        padding: [50, 50, 50, 50],
        maxZoom: 15,
        duration: 800,
      });
    }

    // Cleanup
    return () => {
      if (initialMap) {
        // Use initialMap directly as mapRef.current might be nullified early
        initialMap.removeInteraction(selectInteraction);
        initialMap.setTarget(undefined);
      }
      mapRef.current = null;
      Object.keys(styleCache).forEach((key) => delete styleCache[key]);
    };
  }, [pointsData, clusterDistance, initialCenter, initialZoom]);

  const closePopup = () => {
    setCurrentPopupInfo(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined); // Important to hide the OL overlay
    }
  };

  return (
    <div style={{ width: "100%", height }}>
      <div style={{ width: "100%", height, position: "relative" }}>
        <div
          ref={mapElement}
          style={{
            width: "100%",
            height: "100%",
          }}
          className='map-container'
        />
        <div ref={popupElementRef} className='ol-popup'>
          {currentPopupInfo && (
            <>
              <a
                href='#'
                className='ol-popup-closer'
                onClick={(e) => {
                  e.preventDefault();
                  closePopup();
                }}
              ></a>
              <div className='ol-popup-content'>
                <h4>{currentPopupInfo.name}</h4>
                <p>ID: {currentPopupInfo.id}</p>
                <p>Coords: {currentPopupInfo.displayCoordinates}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClusterMapComponent;
