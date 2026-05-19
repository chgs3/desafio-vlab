import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createLessonPlan,
  generateRecommendations,
  getLessonPlan,
  updateLessonPlan,
} from "../api/lessonPlans";

import { lessonPlanFormSchema } from "../schemas/lessonPlanSchema";
import type { LessonPlanFormSchema } from "../schemas/lessonPlanSchema";

export function LessonPlanFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LessonPlanFormSchema>({
    resolver: zodResolver(lessonPlanFormSchema),
    defaultValues: {
      title: "",
      objective: "",
      summary: "",
      plannedDate: "",
      discipline: "",
      contents: [],
      supportResources: [],
      tags: [],
    },
  });

  const title = watch("title");
  const discipline = watch("discipline");
  const summary = watch("summary");

  const contents = watch("contents");
  const supportResources = watch("supportResources");
  const tags = watch("tags");

  const contentsText = useMemo(() => contents.join("\n"), [contents]);

  const supportResourcesText = useMemo(
    () => supportResources.join("\n"),
    [supportResources]
  );

  const tagsText = useMemo(() => tags.join(", "), [tags]);

  useEffect(() => {
    async function loadPlan() {
      if (!id) return;

      try {
        setLoading(true);

        const plan = await getLessonPlan(id);

        reset({
          title: plan.title,
          objective: plan.objective,
          summary: plan.summary,
          plannedDate: plan.plannedDate.slice(0, 10),
          discipline: plan.discipline,
          contents: plan.contents,
          supportResources: plan.supportResources,
          tags: plan.tags,
        });
      } catch {
        alert("Erro ao carregar plano.");
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [id, reset]);

  async function handleGenerateRecommendations() {
    if (!title || !discipline || !summary) {
      alert("Preencha título, disciplina e ementa/resumo antes de usar a IA.");
      return;
    }

    try {
      setLoadingAi(true);

      const recommendations = await generateRecommendations({
        title,
        discipline,
        summary,
      });

      setValue("contents", [
        ...recommendations.complementaryContents,
        ...recommendations.relatedTopics,
      ]);

      setValue("supportResources", recommendations.supportResources);
      setValue("tags", recommendations.recommendedTags);
    } catch {
      alert("Não foi possível gerar recomendações com IA. Tente novamente.");
    } finally {
      setLoadingAi(false);
    }
  }

  async function onSubmit(data: LessonPlanFormSchema) {
    try {
      setLoading(true);

      if (isEditing && id) {
        await updateLessonPlan(id, data);
      } else {
        await createLessonPlan(data);
      }

      navigate("/");
    } catch {
      alert("Erro ao salvar plano de aula.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>{isEditing ? "Editar plano" : "Novo plano"}</h1>
          <p>
            Preencha os dados do plano de aula e use a IA para gerar sugestões.
          </p>
        </div>

        <Link to="/" className="button">
          Voltar
        </Link>
      </div>

      {loading && isEditing ? (
        <p>Carregando plano...</p>
      ) : (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <label>
              Título da Aula
              <input {...register("title")} />
              {errors.title && (
                <small className="field-error">{errors.title.message}</small>
              )}
            </label>

            <label>
              Disciplina
              <input {...register("discipline")} />
              {errors.discipline && (
                <small className="field-error">
                  {errors.discipline.message}
                </small>
              )}
            </label>

            <label>
              Data Prevista
              <input type="date" {...register("plannedDate")} />
              {errors.plannedDate && (
                <small className="field-error">
                  {errors.plannedDate.message}
                </small>
              )}
            </label>
          </div>

          <label>
            Objetivo
            <textarea rows={3} {...register("objective")} />
            {errors.objective && (
              <small className="field-error">{errors.objective.message}</small>
            )}
          </label>

          <label>
            Ementa/Resumo
            <textarea rows={5} {...register("summary")} />
            {errors.summary && (
              <small className="field-error">{errors.summary.message}</small>
            )}
          </label>

          <button
            type="button"
            className="button secondary"
            onClick={handleGenerateRecommendations}
            disabled={loadingAi}
          >
            {loadingAi
              ? "Gerando recomendações..."
              : "Gerar Recomendações com IA"}
          </button>

          <label>
            Conteúdos
            <textarea
              rows={5}
              value={contentsText}
              onChange={(event) =>
                setValue(
                  "contents",
                  event.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean)
                )
              }
            />
            <small>Informe um conteúdo por linha.</small>
          </label>

          <label>
            Recursos de Apoio
            <textarea
              rows={4}
              value={supportResourcesText}
              onChange={(event) =>
                setValue(
                  "supportResources",
                  event.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean)
                )
              }
            />
            <small>Informe um recurso por linha.</small>
          </label>

          <label>
            Tags
            <input
              value={tagsText}
              onChange={(event) =>
                setValue(
                  "tags",
                  event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                )
              }
            />
            <small>Separe as tags por vírgula.</small>
          </label>

          <div className="form-actions">
            <Link to="/" className="button">
              Cancelar
            </Link>

            <button className="button primary" disabled={loading}>
              {loading ? "Salvando..." : "Salvar plano"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}