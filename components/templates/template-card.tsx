import { TemplateDeleteDialog } from "@/components/templates/template-delete-dialog";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    emailSubject: string;
    emailBody: string;
    createdAt: Date;
    event: { id: string; name: string } | null;
  };
  onDeleted: () => void;
}

export function TemplateCard({ template, onDeleted }: TemplateCardProps) {
  const preview =
    template.emailBody.length > 120
      ? template.emailBody.slice(0, 120) + "..."
      : template.emailBody;

  return (
    <div className="border border-border bg-card group hover:border-foreground/20 transition-colors px-4 py-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
            <h3 className="font-mono text-sm font-semibold text-foreground truncate">
              {template.name}
            </h3>
          </div>
          {template.event && (
            <Badge
              variant="secondary"
              className="font-mono text-xs px-1.5 py-0 h-4 w-fit bg-muted text-muted-foreground"
            >
              from: {template.event.name}
            </Badge>
          )}
        </div>
        <TemplateDeleteDialog
          templateId={template.id}
          templateName={template.name}
          onDeleted={onDeleted}
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-mono text-xs text-foreground">
          {template.emailSubject}
        </p>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          {preview}
        </p>
      </div>
    </div>
  );
}
