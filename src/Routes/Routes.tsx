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
  () => import("../Pages/StringManipulationPage/StringManipulation"),
);
const NumberManipulation = lazy(
  () => import("../Pages/NumbersPage/NumberManipulation"),
);
const PlayWithJsDates = lazy(
  () => import("./../Pages/DatesPage/PlayWithDatesPage"),
);
const WebAPI = lazy(() => import("../Pages/WebAPIsPage/WebAPI"));
const Playground = lazy(
  () => import("../Pages/CoditorPlayground/PlaygroundPage"),
);
const PageNotFound = lazy(() => import("../Pages/PageNotFound/PageNotFound"));

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/play-with-strings" element={<StringManipulation />} />
      <Route path="/play-with-numbers" element={<NumberManipulation />} />
      <Route path="/play-with-dates" element={<PlayWithJsDates />} />
      <Route path="/browser-vitals" element={<WebAPI />} />
      <Route path="/coditor-playground" element={<Playground />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>,
  ),
);

export default Router;
