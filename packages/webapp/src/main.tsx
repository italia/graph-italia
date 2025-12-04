import ReactDOM from "react-dom/client";

import "./style/index.css";

import { RouterProvider } from "react-router-dom";
import router from "./router";

// Load runtime configuration from ConfigMap (in Kubernetes) or /config.json
// This allows using the same build image across different environments
async function loadRuntimeConfig() {
  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      const config = await response.json();
      if (typeof window !== 'undefined') {
        window.__ENV__ = config;
      }
      return config;
    }
  } catch (error) {
    // config.json not available (e.g., in local development)
    // Fall back to build-time environment variables
    console.debug('Runtime config not available, using environment variables');
  }
  return null;
}

function App() {
  return <RouterProvider router={router} />;
}

// Load configuration before rendering the app
loadRuntimeConfig().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <App />
  );
});
