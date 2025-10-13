import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./Routes/Routes.tsx";
import { Suspense } from "react";

createRoot(document.getElementById("root")!).render(
  <Suspense
    fallback={
      <div className="w-screen h-screen bg-color1 text-color1">Loading...</div>
    }
  >
    <RouterProvider router={Router} />
  </Suspense>
);
