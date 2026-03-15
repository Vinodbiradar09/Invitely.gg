"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface TemplateCreateDialogProps {
  onCreated: () => void;
}

export function TemplateCreateDialog({ onCreated }: TemplateCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const isValid = name.trim() && emailSubject.trim() && emailBody.trim();

  function handleOpenChange(val: boolean) {
    setOpen(val);
    if (!val) {
      setName("");
      setEmailSubject("");
      setEmailBody("");
    }
  }

  async function handleCreate() {
    if (!isValid) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, emailSubject, emailBody }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("template created");
      setOpen(false);
      onCreated();
    } catch {
      toast.error("failed to create template");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="font-mono text-xs gap-2">
          <Plus className="h-3 w-3" />
          New template
        </Button>
      </DialogTrigger>
      <DialogContent className="font-mono sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">
            Create template
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-mono text-sm h-9"
              maxLength={100}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="template-subject" className="font-mono text-xs">
              Email subject *
            </Label>
            <Input
              id="template-subject"
              placeholder="You're invited to..."
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="font-mono text-sm h-9"
              maxLength={150}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="template-body" className="font-mono text-xs">
              Email body *
            </Label>
            <Textarea
              id="template-body"
              placeholder="Write your invite template here..."
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="font-mono text-sm min-h-32 resize-none"
              maxLength={5000}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="font-mono text-xs"
              onClick={handleCreate}
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Creating..." : "Create template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
