import { createTheme } from "react-data-table-component";

let registered = false;

export function registerDataTableDarkTheme() {
  if (registered) return;
  createTheme("graph-italia-dark", {
    text: {
      primary: "rgba(255,255,255, 0.87)",
      secondary: "rgba(255,255,255, 0.54)",
      disabled: "rgba(255,255,255, 0.38)",
    },
    background: {
      default: "transparent",
    },
    divider: {
      default: "rgba(92, 94, 95, 0.18)",
    },
    highlightOnHover: {
      default: "rgba(255,255,255,.03)",
      text: "#fff",
    },
  });
  registered = true;
}
