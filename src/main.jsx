import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ================= FIX DYNAMIC IMPORT ERROR =================
const reloadKey = "vite-dynamic-reload";

window.addEventListener("error", (event) => {
  const message = event?.message || "";

  if (
    message.includes(
      "Failed to fetch dynamically imported module"
    )
  ) {
    const hasReloaded =
      sessionStorage.getItem(reloadKey);

    if (!hasReloaded) {
      sessionStorage.setItem(reloadKey, "true");
      window.location.reload();
    }
  }
});

window.addEventListener(
  "unhandledrejection",
  (event) => {
    const message =
      event?.reason?.message || "";

    if (
      message.includes(
        "Failed to fetch dynamically imported module"
      )
    ) {
      const hasReloaded =
        sessionStorage.getItem(reloadKey);

      if (!hasReloaded) {
        sessionStorage.setItem(
          reloadKey,
          "true"
        );

        window.location.reload();
      }
    }
  }
);
// ================= END FIX =================

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);