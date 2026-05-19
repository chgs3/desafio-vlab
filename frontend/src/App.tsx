import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { LessonPlanFormPage } from "./pages/LessonPlanFormPage";
import { LessonPlansPage } from "./pages/LessonPlansPage";

export function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <Link to="/" className="brand">
            AulaPlan
          </Link>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<LessonPlansPage />} />
            <Route path="/lesson-plans/new" element={<LessonPlanFormPage />} />
            <Route
              path="/lesson-plans/:id/edit"
              element={<LessonPlanFormPage />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}