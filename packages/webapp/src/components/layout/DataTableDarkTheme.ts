
import { createTheme } from "react-data-table-component";

function registerDarkTheme() {

  createTheme("dark", {
    text: {
      primary: "rgba(255,255,255, 0.54)",
      secondary: "rgba(255,255,255, 0.54)",
      disabled: "rgba(255,255,255, 0.38)",
    },
    background: {
      default: "transparent",
    },
    divider: {
      default: "rgba(255,255,255,.075)",
    },
    highlightOnHover: {
      default: "rgba(255,255,255,.03)",
      text: "#fff",
    },
  });

}
export default registerDarkTheme
