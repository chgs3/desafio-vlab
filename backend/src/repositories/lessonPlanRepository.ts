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
    return prisma.lessonPlan.update({
      where: { id },
      data,
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

    if (tag) {
      where.tags = {
        array_contains: [tag],
      } as Prisma.JsonFilter<"LessonPlan">;
    }

    const [data, total] = await Promise.all([
      prisma.lessonPlan.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.lessonPlan.count({ where }),
    ]);

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