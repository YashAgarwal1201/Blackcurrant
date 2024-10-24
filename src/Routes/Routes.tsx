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
const StringManipulation = lazy(
  () => import("./../Pages/StringManipulation/StringManipulation")
);
const NumberManipulation = lazy(
  () => import("./../Pages/Number/NumberManipulation")
);
const PageNotFound = lazy(() => import("../Pages/PageNotFound/PageNotFound"));

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/string-manipulation" element={<StringManipulation />} />
      <Route path="/number" element={<NumberManipulation />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

export default Router;
