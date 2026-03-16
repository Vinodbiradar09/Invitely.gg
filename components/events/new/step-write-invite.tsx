"use client";

import { Sparkles, FileText, ChevronDown, BookmarkPlus } from "lucide-react";
import { EventCreationState } from "@/app/hooks/use-event-creation";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  emailSubject: string;
  emailBody: string;
}

interface StepWriteInviteProps {
  state: EventCreationState;
  setField: <K extends keyof EventCreationState>(
    key: K,
    value: EventCreationState[K],
  ) => void;
  onNext: () => void;
  onBack: () => void;
  onPolish: (casualText: string) => Promise<void>;
}

export function StepWriteInvite({
  state,
  setField,
  onNext,
  onBack,
  onPolish,
}: StepWriteInviteProps) {
  const [casualText, setCasualText] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isValid = state.emailSubject.trim() && state.emailBody.trim();
  const canSaveTemplate = isValid;

  async function handlePolish() {
    if (!casualText.trim()) return;
    await onPolish(casualText);
  }

  async function handleLoadTemplates() {
    if (templatesLoaded) return;
    try {
      setIsLoadingTemplates(true);
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (!data.success) {
        toast.error("failed to load templates");
        return;
      }
      setTemplates(data.templates);
      setTemplatesLoaded(true);
    } catch {
      toast.error("failed to load templates");
    } finally {
      setIsLoadingTemplates(false);
    }
  }

  function handleUseTemplate(template: Template) {
    setField("emailSubject", template.emailSubject);
    setField("emailBody", template.emailBody);
    toast.success(`template "${template.name}" applied`);
  }

  async function handleSaveTemplate() {
    if (!templateName.trim() || !isValid) return;
    try {
      setIsSaving(true);
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName.trim(),
          emailSubject: state.emailSubject,
          emailBody: state.emailBody,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(`template "${templateName}" saved`);
      setSaveDialogOpen(false);
      setTemplateName("");
      setTemplatesLoaded(false);
    } catch {
      toast.error("failed to save template");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="border border-dashed border-border p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Improve with AI
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Write in casual tone, AI will turn it into a proper invite
            </p>
          </div>

          <DropdownMenu
            onOpenChange={(open) => {
              if (open) handleLoadTemplates();
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-2 shrink-0"
              >
                <FileText className="h-3 w-3" />
                Use template
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isLoadingTemplates && (
                <DropdownMenuItem
                  disabled
                  className="font-mono text-xs text-muted-foreground"
                >
                  Loading...
                </DropdownMenuItem>
              )}
              {!isLoadingTemplates && templates.length === 0 && (
                <DropdownMenuItem
                  disabled
                  className="font-mono text-xs text-muted-foreground"
                >
                  No templates saved yet
                </DropdownMenuItem>
              )}
              {!isLoadingTemplates && templates.length > 0 && (
                <>
                  <DropdownMenuItem
                    disabled
                    className="font-mono text-xs text-muted-foreground"
                  >
                    Select a template
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {templates.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      className="font-mono text-xs cursor-pointer"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <FileText className="h-3 w-3 mr-2 text-muted-foreground" />
                      {template.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Textarea
          placeholder={`e.g. "bro it's my bday come party with us saturday night, gonna be lit"`}
          value={casualText}
          onChange={(e) => setCasualText(e.target.value)}
          className="font-mono text-xs min-h-16 resize-none"
          maxLength={1000}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-xs gap-2 self-start"
          onClick={handlePolish}
          disabled={!casualText.trim() || state.isPolishing}
        >
          <Sparkles className="h-3 w-3" />
          {state.isPolishing ? "Optimizing..." : "Optimize"}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-border" />
        <span className="font-mono text-xs text-muted-foreground">
          or write manually
        </span>
        <Separator className="flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email-subject" className="font-mono text-xs">
            Email subject *
          </Label>
          <Input
            id="email-subject"
            placeholder="You're invited to Shambavi's Birthday Party 🎉"
            value={state.emailSubject}
            onChange={(e) => setField("emailSubject", e.target.value)}
            className="font-mono text-sm h-9"
            maxLength={150}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email-body" className="font-mono text-xs">
            Email body *
          </Label>
          <Textarea
            id="email-body"
            placeholder="Write your invite message here..."
            value={state.emailBody}
            onChange={(e) => setField("emailBody", e.target.value)}
            className="font-mono text-sm min-h-40 resize-none"
            maxLength={5000}
          />
          <p className="font-mono text-xs text-muted-foreground">
            Do not include greeting or sign-off the email template handles that.
          </p>
        </div>
      </div>

      {canSaveTemplate && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="font-mono text-xs gap-2"
            onClick={() => setSaveDialogOpen(true)}
          >
            <BookmarkPlus className="h-3 w-3" />
            Save as template
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-xs"
          onClick={onBack}
        >
          ← Back
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-mono text-xs"
          onClick={onNext}
          disabled={!isValid}
        >
          Next →
        </Button>
      </div>

      <Dialog
        open={saveDialogOpen}
        onOpenChange={(val) => {
          setSaveDialogOpen(val);
          if (!val) setTemplateName("");
        }}
      >
        <DialogContent className="font-mono sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">
              Save as template
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="template-name" className="font-mono text-xs">
                Template name *
              </Label>
              <Input
                id="template-name"
                placeholder="Birthday Party"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="font-mono text-sm h-9"
                maxLength={100}
                autoFocus
              />
            </div>
            <div className="border border-border px-3 py-2.5 flex flex-col gap-1">
              <p className="font-mono text-xs text-muted-foreground">Subject</p>
              <p className="font-mono text-xs text-foreground truncate">
                {state.emailSubject}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs"
                onClick={() => setSaveDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="font-mono text-xs"
                onClick={handleSaveTemplate}
                disabled={!templateName.trim() || isSaving}
              >
                {isSaving ? "Saving..." : "Save template"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
