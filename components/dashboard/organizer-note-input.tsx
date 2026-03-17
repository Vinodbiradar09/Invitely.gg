"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface OrganizerNoteInputProps {
  invitationId: string;
  initialNote: string | null;
}

export function OrganizerNoteInput({
  invitationId,
  initialNote,
}: OrganizerNoteInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(initialNote ?? "");
  const [savedNote, setSavedNote] = useState(initialNote ?? "");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSave() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/invitations/${invitationId}/note`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizerNote: note }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setSavedNote(note);
      setIsEditing(false);
      toast.success("note saved");
    } catch {
      toast.error("failed to save note");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setNote(savedNote);
    setIsEditing(false);
  }

  if (!isEditing) {
    return (
      <div className="flex items-start gap-2 group/note min-w-0">
        {savedNote ? (
          <p className="font-mono text-xs text-muted-foreground leading-relaxed flex-1 wrap-break-words whitespace-pre-wrap min-w-0">
            {savedNote}
          </p>
        ) : (
          <p className="font-mono text-xs text-muted-foreground/40 italic flex-1">
            Add private note...
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 opacity-0 group-hover/note:opacity-100 transition-opacity shrink-0"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 w-full min-w-0">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="font-mono text-xs min-h-12 resize-none w-full"
        maxLength={500}
        autoFocus
        placeholder="Private note — only visible to you"
      />
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-green-500 hover:text-green-400"
          onClick={handleSave}
          disabled={isLoading}
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          onClick={handleCancel}
          disabled={isLoading}
        >
          <X className="h-3 w-3" />
        </Button>
        <span className="font-mono text-xs text-muted-foreground/40 ml-1">
          {note.length}/500
        </span>
      </div>
    </div>
  );
}
