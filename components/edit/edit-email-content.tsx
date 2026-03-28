"use client";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditEmailContentProps {
  initialValues: {
    emailSubject: string;
    emailBody: string;
  };
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventDesc: string;
  onBack: () => void;
  onSave: (values: { emailSubject: string; emailBody: string }) => void;
  isSaving: boolean;
}

export function EditEmailContent({
  initialValues,
  eventName,
  eventDate,
  eventLocation,
  eventDesc,
  onBack,
  onSave,
  isSaving,
}: EditEmailContentProps) {
  const [emailSubject, setEmailSubject] = useState(initialValues.emailSubject);
  const [emailBody, setEmailBody] = useState(initialValues.emailBody);
  const [casualText, setCasualText] = useState("");
  const [isPolishing, setIsPolishing] = useState(false);

  const isValid = emailSubject.trim() && emailBody.trim();

  async function handlePolish() {
    if (!casualText.trim()) return;
    try {
      setIsPolishing(true);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casualText,
          eventName,
          eventDate,
          eventLocation,
          eventDesc,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setEmailSubject(data.data.subject);
      setEmailBody(data.data.body);
      toast.success("email polished");
    } catch {
      toast.error("failed to polish email");
    } finally {
      setIsPolishing(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="border border-dashed border-border p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Rewrite with AI
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Write in casual tone, AI will turn it into a proper invite
          </p>
        </div>
        <Textarea
          placeholder={`e.g. "bro it's my bday come party with us saturday night"`}
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
          disabled={!casualText.trim() || isPolishing}
        >
          <Sparkles className="h-3 w-3" />
          {isPolishing ? "Optimizing..." : "Optimize"}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-border" />
        <span className="font-mono text-xs text-muted-foreground">
          or edit manually
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
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
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
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            className="font-mono text-sm min-h-40 resize-none"
            maxLength={5000}
          />
          <p className="font-mono text-xs text-muted-foreground">
            Do not include greeting or sign-off the email template handles that.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="font-mono text-xs"
          onClick={onBack}
          disabled={isSaving}
        >
          ← Back
        </Button>
        <Button
          type="button"
          size="sm"
          className="font-mono text-xs"
          onClick={() => onSave({ emailSubject, emailBody })}
          disabled={!isValid || isSaving}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
