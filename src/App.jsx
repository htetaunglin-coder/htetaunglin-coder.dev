import { Routes, Route, useLocation } from "react-router-dom";
import "./css/fonts.css";
import "./css/util.css";
import "./css/animation.css";
import "./css/loading.css";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import PageLoading from "./components/animation/PageLoading";
import PageNotFound from "./Pages/PageNotFound";

const Home = lazy(() => import("./Pages/Home"));
const ProjectPage = lazy(() => import("./Pages/Projects/ProjectPage"));
const PDFViewer = lazy(() => import("./Pages/PDFViewer"));

function App() {
  const location = useLocation();

  return (
    <div className="app relative bg-gray-300 dark:bg-flat-black">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoading />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/projects"
            element={
              <Suspense fallback={<PageLoading />}>
                <ProjectPage />
              </Suspense>
            }
          />
          <Route
            path="/resume"
            element={
              <Suspense fallback={<PageLoading />}>
                <PDFViewer />
              </Suspense>
            }
          />
          <Route
            path="/*"
            element={
              <Suspense fallback={<PageLoading />}>
                <PageNotFound />
              </Suspense>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
