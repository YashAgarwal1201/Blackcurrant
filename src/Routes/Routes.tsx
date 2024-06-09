import { lazy } from "react";

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./../App";
// import { DOCK_OPTIONS_LIST } from "../Services/Constants";

// Lazy Loaded Components
const LandingPage = lazy(() => import("./../Pages/LandingPage/LandingPage"));
const HomePage = lazy(() => import("./../Pages/HomePage/HomePage"));
// const DynamicPage = lazy(() => import("./../Pages/DynamicPage/DynamicPage"));
const PageNotFound = lazy(() => import("../Pages/PageNotFound/PageNotFound"));
// const ImageFramesPage = lazy(() => import("../Pages/ImageFramesPage/ImageFramesPage"));

// import ImageFramesPage from "../Pages/ImageFramesPage/ImageFramesPage";

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      {/* {DOCK_OPTIONS_LIST.map((option) => (
        <Route
          key={option.name}
          path={`/${option.name.replace(/\s+/g, "-").toLowerCase()}`}
          element={<DynamicPage data={option} />}
        />
      ))} */}
      <Route path="*" element={<PageNotFound />} />
      {/* <Route path="/image-frames" element={<ImageFramesPage />} /> */}
    </Route>
  )
);

export default Router;
