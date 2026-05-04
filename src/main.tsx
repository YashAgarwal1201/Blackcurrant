import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./Routes/Routes.tsx";
// import { Suspense } from "react";
import "./index.css";
import "./assets/styles/animations.css";

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
  <RouterProvider router={Router} />,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("[SW] Registration failed:", err));
  });
}
