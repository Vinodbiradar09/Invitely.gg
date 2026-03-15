"use client";
import { TemplateCreateDialog } from "@/components/templates/template-create-dialog";
import { TemplateCard } from "@/components/templates/template-card";
import { useRouter } from "next/navigation";

interface Template {
  id: string;
  name: string;
  emailSubject: string;
  emailBody: string;
  createdAt: Date;
  event: { id: string; name: string } | null;
}

interface TemplateListProps {
  templates: Template[];
}

export function TemplateList({ templates }: TemplateListProps) {
  const router = useRouter();

  function handleMutation() {
    router.refresh();
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="border border-dashed border-border w-12 h-12 flex items-center justify-center">
          <span className="font-mono text-lg text-muted-foreground">+</span>
        </div>
        <div className="text-center flex flex-col gap-1">
          <p className="font-mono text-sm text-foreground">No templates yet</p>
          <p className="font-mono text-xs text-muted-foreground">
            Save reusable email templates for your events
          </p>
        </div>
        <TemplateCreateDialog onCreated={handleMutation} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <TemplateCreateDialog onCreated={handleMutation} />
      </div>
      {templates.map((template: Template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onDeleted={handleMutation}
        />
      ))}
    </div>
  );
}
