import { TemplateService } from "@/lib/validations/validate-template";
import { requireSession } from "@/lib/auth/server/require-session";
import { InvitelyError, InvitelyResponse } from "@/lib/shared/api";
import { TemplateIdParams } from "@/lib/utils";
import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";

export async function DELETE(_req: NextRequest, { params }: TemplateIdParams) {
  try {
    const session = await requireSession();
    const { templateId } = await params;
    const template = await TemplateService.ownedTemplate(
      templateId,
      session.user.id,
    );
    await db.eventTemplate.delete({
      where: {
        id: templateId ?? template.id,
      },
    });
    return InvitelyResponse(200, "Template deleted successfully");
  } catch (e) {
    return InvitelyError(e);
  }
}
