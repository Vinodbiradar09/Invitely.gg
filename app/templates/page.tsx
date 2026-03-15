import { TemplateList } from "@/components/templates/template-list";
import { TemplateListSkeleton } from "@/components/skeletons";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { db } from "@/lib/prisma";
import { Suspense } from "react";
import Link from "next/link";

export const metadata: Metadata = { title: "Templates | Invitely.gg" };

function PageHeader() {
  return (
    <>
      <Link
        href="/events"
        className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to events
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-mono text-base font-semibold text-foreground">
            Templates
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Reusable email templates for your events.
          </p>
        </div>
      </div>
      <Separator className="bg-border" />
    </>
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
      <p className="font-mono text-xs text-muted-foreground -mt-4">
        {templates.length === 0
          ? "No templates yet."
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
