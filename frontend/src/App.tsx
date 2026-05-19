import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import { LessonPlansPage } from "./pages/LessonPlansPage";
import { LessonPlanFormPage } from "./pages/LessonPlanFormPage";

export function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <Link to="/" className="brand">
            Planos de Aula
          </Link>

          <nav>
            <Link to="/lesson-plans/new">Novo plano</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<LessonPlansPage />} />
            <Route path="/lesson-plans/new" element={<LessonPlanFormPage />} />
            <Route path="/lesson-plans/:id/edit" element={<LessonPlanFormPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}