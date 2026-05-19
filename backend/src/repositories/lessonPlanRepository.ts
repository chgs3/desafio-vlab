import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  CreateLessonPlanInput,
  ListLessonPlansQuery,
  UpdateLessonPlanInput,
} from "../schemas/lessonPlanSchemas";

export class LessonPlanRepository {
  async create(data: CreateLessonPlanInput) {
    return prisma.lessonPlan.create({
      data: {
        ...data,
        contents: data.contents,
        supportResources: data.supportResources,
        tags: data.tags,
      },
    });
  }

  async findById(id: string) {
    return prisma.lessonPlan.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateLessonPlanInput) {
    const updateData: Prisma.LessonPlanUpdateInput = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.objective !== undefined) {
      updateData.objective = data.objective;
    }

    if (data.summary !== undefined) {
      updateData.summary = data.summary;
    }

    if (data.plannedDate !== undefined) {
      updateData.plannedDate = data.plannedDate;
    }

    if (data.discipline !== undefined) {
      updateData.discipline = data.discipline;
    }

    if (data.contents !== undefined) {
      updateData.contents =
        data.contents as Prisma.InputJsonValue;
    }

    if (data.supportResources !== undefined) {
      updateData.supportResources =
        data.supportResources as Prisma.InputJsonValue;
    }

    if (data.tags !== undefined) {
      updateData.tags =
        data.tags as Prisma.InputJsonValue;
    }

    return prisma.lessonPlan.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.lessonPlan.delete({
      where: { id },
    });
  }

  async list(query: ListLessonPlansQuery) {
    const {
      page,
      limit,
      search,
      discipline,
      tag,
      plannedDate,
      sortBy,
      sortOrder,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.LessonPlanWhereInput = {};

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (discipline) {
      where.discipline = {
        contains: discipline,
        mode: "insensitive",
      };
    }

    if (plannedDate) {
      const start = new Date(plannedDate);
      const end = new Date(plannedDate);

      end.setDate(end.getDate() + 1);

      where.plannedDate = {
        gte: start,
        lt: end,
      };
    }

    const allData = await prisma.lessonPlan.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const filteredByTag = tag
      ? allData.filter((plan) => {
          if (!Array.isArray(plan.tags)) {
            return false;
          }

          return plan.tags.some(
            (item) =>
              typeof item === "string" &&
              item.toLowerCase().includes(tag.toLowerCase())
          );
        })
      : allData;

    const total = filteredByTag.length;

    const data = filteredByTag.slice(skip, skip + limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}