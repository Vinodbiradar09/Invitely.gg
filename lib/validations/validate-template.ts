import { ForbiddenError, NotFoundError } from "../shared/exceptions";
import { db } from "../db/prisma";

const TemplateService = {
  async ownedTemplate(id: string, userId: string) {
    const template = await db.eventTemplate.findUnique({
      where: {
        id,
      },
    });
    if (!template) {
      throw new NotFoundError("Template not found");
    }
    if (template.userId !== userId) {
      throw new ForbiddenError("You don't have access to this template");
    }
    return template;
  },
  async eventTemplates(userId: string) {
    const templates = await db.eventTemplate.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        emailSubject: true,
        emailBody: true,
        createdAt: true,
        eventId: true,
        event: {
          select: { id: true, name: true },
        },
      },
    });
    return templates;
  },
  async templatesLimit(userId: string) {
    const existingCount = await db.eventTemplate.count({
      where: {
        userId,
      },
    });
    if (existingCount >= 20) {
      throw new ForbiddenError(
        "Templates limit reached , maximum 20 templates allowed",
      );
    }
  },
};

export { TemplateService };
