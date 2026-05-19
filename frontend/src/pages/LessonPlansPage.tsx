import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { deleteLessonPlan, listLessonPlans } from "../api/lessonPlans";

import type { LessonPlanFilters } from "../api/lessonPlans";
import type { LessonPlan, LessonPlansResponse } from "../types/lessonPlan";

type FilterType = "title" | "discipline" | "tag" | "plannedDate";

export function LessonPlansPage() {
  const [result, setResult] = useState<LessonPlansResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [filterType, setFilterType] = useState<FilterType>("title");
  const [filterValue, setFilterValue] = useState("");

  const [filters, setFilters] = useState<LessonPlanFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const activeFilters = useMemo<LessonPlanFilters>(() => {
    const baseFilters: LessonPlanFilters = {
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    if (!filterValue.trim()) {
      return baseFilters;
    }

    if (filterType === "title") {
      return {
        ...baseFilters,
        search: filterValue,
      };
    }

    if (filterType === "discipline") {
      return {
        ...baseFilters,
        discipline: filterValue,
      };
    }

    if (filterType === "tag") {
      return {
        ...baseFilters,
        tag: filterValue,
      };
    }

    if (filterType === "plannedDate") {
      return {
        ...baseFilters,
        plannedDate: filterValue,
      };
    }

    return baseFilters;
  }, [filterType, filterValue, filters]);

  async function loadPlans() {
    try {
      setLoading(true);
      const data = await listLessonPlans(activeFilters);
      setResult(data);
    } catch {
      alert("Erro ao carregar planos de aula.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(plan: LessonPlan) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o plano "${plan.title}"?`
    );

    if (!confirmed) return;

    try {
      await deleteLessonPlan(plan.id);
      await loadPlans();
    } catch {
      alert("Erro ao excluir plano.");
    }
  }

  function handleFilterTypeChange(value: FilterType) {
    setFilterType(value);
    setFilterValue("");
    setFilters((current) => ({
      ...current,
      page: 1,
    }));
  }

  useEffect(() => {
    loadPlans();
  }, [activeFilters]);

  const filterInputPlaceholder = {
    title: "Digite o título...",
    discipline: "Digite a disciplina...",
    tag: "Digite a tag...",
    plannedDate: "",
  }[filterType];

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Planos de Aula</h1>
          <p>Gerencie, filtre e organize seus planos de aula.</p>
        </div>

        <Link to="/lesson-plans/new" className="button primary">
          Novo plano
        </Link>
      </div>

      <div className="filters unified-filters">
        <select
          value={filterType}
          onChange={(event) =>
            handleFilterTypeChange(event.target.value as FilterType)
          }
        >
          <option value="title">Título</option>
          <option value="discipline">Disciplina</option>
          <option value="tag">Tag</option>
          <option value="plannedDate">Data prevista</option>
        </select>

        <input
          type={filterType === "plannedDate" ? "date" : "text"}
          placeholder={filterInputPlaceholder}
          value={filterValue}
          onChange={(event) => {
            setFilterValue(event.target.value);
            setFilters((current) => ({
              ...current,
              page: 1,
            }));
          }}
        />

        <select
          value={filters.sortBy}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              sortBy: event.target.value as "title" | "createdAt",
            }))
          }
        >
          <option value="createdAt">Cadastro</option>
          <option value="title">Título</option>
        </select>

        <select
          value={filters.sortOrder}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              sortOrder: event.target.value as "asc" | "desc",
            }))
          }
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>

        <button
          type="button"
          className="button"
          onClick={() => {
            setFilterValue("");
            setFilters((current) => ({
              ...current,
              page: 1,
            }));
          }}
        >
          Limpar
        </button>
      </div>

      {loading && <p>Carregando planos...</p>}

      {!loading && result?.data.length === 0 && (
        <div className="empty-state">
          <strong>Nenhum plano encontrado.</strong>
          <p>Crie um novo plano ou ajuste os filtros.</p>
        </div>
      )}

      <div className="cards-grid">
        {result?.data.map((plan) => (
          <article key={plan.id} className="card">
            <div className="card-header">
              <div>
                <h2>{plan.title}</h2>
                <span>{plan.discipline}</span>
              </div>
            </div>

            <p>{plan.summary}</p>

            <div className="tags">
              {plan.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="card-footer">
              <small>
                Data prevista:{" "}
                {new Date(plan.plannedDate).toLocaleDateString("pt-BR")}
              </small>

              <div className="actions">
                <Link to={`/lesson-plans/${plan.id}/edit`}>Editar</Link>
                <button onClick={() => handleDelete(plan)}>Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {result && result.pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={filters.page === 1}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page: Math.max(1, (current.page ?? 1) - 1),
              }))
            }
          >
            Anterior
          </button>

          <span>
            Página {result.pagination.page} de {result.pagination.totalPages}
          </span>

          <button
            disabled={filters.page === result.pagination.totalPages}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page: (current.page ?? 1) + 1,
              }))
            }
          >
            Próxima
          </button>
        </div>
      )}
    </section>
  );
}