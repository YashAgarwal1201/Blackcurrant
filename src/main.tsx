import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import Router from "./Routes/Routes.tsx";
// import { Suspense } from "react";
import "./assets/styles/index.css";
import "primeicons/primeicons.css";

// createRoot(document.getElementById("root")!).render(
//   <Suspense
//     fallback={
//       <div
//         role="status"
//         aria-label="Loading application"
//         className="w-screen h-screen bg-color1 flex items-center justify-center"
//       >
//         <span className="sr-only">Loading...</span>
//       </div>
//     }
//   >
//     <RouterProvider router={Router} />
//   </Suspense>,
// );

createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider value={{ unstyled: false }}>
    <RouterProvider router={Router} />
  </PrimeReactProvider>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
