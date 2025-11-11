import ReactDOM from "react-dom/client";

import "./style/index.css";

import { RouterProvider } from "react-router-dom";
import router from "./router";

function App() {
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
