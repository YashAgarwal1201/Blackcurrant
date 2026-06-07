import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import Router from "./Routes/Routes.tsx";

import "./assets/styles/index.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider value={{ unstyled: false }}>
    <RouterProvider router={Router} />
  </PrimeReactProvider>,
);

// if ("serviceWorker" in navigator && import.meta.env.PROD) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker.register("/sw.js");
//   });
// }

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("[SW] Registered, scope:", reg.scope);
      })
      .catch((err) => {
        console.error("[SW] Registration failed:", err);
      });
  });
}
