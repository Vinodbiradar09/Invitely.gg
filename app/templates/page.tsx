import { TemplateList } from "@/components/templates/template-list";
import { TemplateListSkeleton } from "@/components/skeletons";
import { getSession } from "@/lib/auth/client/get-session";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Templates | Invitely.gg" };

function PageHeader() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-mono text-base font-semibold text-foreground">
        Templates
      </h1>
      <Separator className="bg-border" />
    </div>
  );
}

async function TemplateSection() {
  const session = await getSession();
  if (!session) redirect("/login");

  const templates = await db.eventTemplate.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
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

  return (
    <div className="flex flex-col gap-6">
      <p className="font-mono text-xs text-muted-foreground -mt-2">
        {templates.length === 0
          ? "Save reusable email templates for your events."
          : `${templates.length}/20 templates`}
      </p>
      <TemplateList templates={templates} />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader />
      <Suspense fallback={<TemplateListSkeleton />}>
        <TemplateSection />
      </Suspense>
    </div>
  );
}
