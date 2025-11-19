import { Icon } from "ol/style";

const svgMarkerIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#0066cc" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill-opacity="0.9"/>
  <circle cx="12" cy="9" r="2.5" fill="none"/>
</svg>`;
// Convert SVG string to a data URI for use in ol/style/Icon
const svgMarkerDataURI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  svgMarkerIcon
)}`;
const markerIcon = new Icon({
  color: "#0066cc",
  anchor: [0.5, 1], // Anchor at the bottom-center of the icon
  anchorXUnits: "fraction",
  anchorYUnits: "fraction",
  src: svgMarkerDataURI,
  scale: 1,
});

export default markerIcon;
