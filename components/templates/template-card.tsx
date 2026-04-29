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
    template.emailBody.length > 100
      ? template.emailBody.slice(0, 100) + "..."
      : template.emailBody;

  return (
    <div className="border border-border bg-card hover:border-foreground/20 transition-colors">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
          <h3 className="font-mono text-xs font-semibold text-foreground truncate">
            {template.name}
          </h3>
          {template.event && (
            <Badge
              variant="outline"
              className="font-mono text-[10px] px-1.5 py-0 h-4 rounded-none border-border text-muted-foreground shrink-0"
            >
              {template.event.name}
            </Badge>
          )}
        </div>
        <TemplateDeleteDialog
          templateId={template.id}
          templateName={template.name}
          onDeleted={onDeleted}
        />
      </div>

      <div className="px-4 py-3 flex flex-col gap-1">
        <p className="font-mono text-xs text-foreground truncate">
          {template.emailSubject}
        </p>
        <p className="font-mono text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {preview}
        </p>
      </div>
    </div>
  );
}
