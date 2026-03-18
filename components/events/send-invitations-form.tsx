"use client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Users, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string | null;
  email: string;
}

interface Workspace {
  id: string;
  name: string;
  members: Member[];
}

interface RecipientEntry {
  email: string;
  name: string | null;
}

interface SendInvitationsFormProps {
  eventId: string;
  workspaces: Workspace[];
  organizerName: string;
  organizerEmail: string;
  event: {
    name: string;
    eventAt: Date;
    location: string;
    emailSubject: string;
    emailBody: string;
  };
}

export function SendInvitationsForm({
  eventId,
  workspaces,
}: SendInvitationsFormProps) {
  const router = useRouter();
  const [selectedRecipients, setSelectedRecipients] = useState<
    Map<string, RecipientEntry>
  >(new Map());
  const [isSending, setIsSending] = useState(false);

  const allMembers = workspaces.flatMap((w) => w.members);
  const selectedCount = selectedRecipients.size;

  function toggleRecipient(member: Member) {
    setSelectedRecipients((prev) => {
      const map = new Map(prev);
      if (map.has(member.email)) {
        map.delete(member.email);
      } else {
        map.set(member.email, { email: member.email, name: member.name });
      }
      return map;
    });
  }

  function toggleWorkspace(members: Member[]) {
    setSelectedRecipients((prev) => {
      const map = new Map(prev);
      const allSelected = members.every((m) => map.has(m.email));
      if (allSelected) {
        members.forEach((m) => map.delete(m.email));
      } else {
        members.forEach((m) =>
          map.set(m.email, { email: m.email, name: m.name }),
        );
      }
      return map;
    });
  }

  function selectAll() {
    setSelectedRecipients(
      new Map(
        allMembers.map((m) => [m.email, { email: m.email, name: m.name }]),
      ),
    );
  }

  function clearAll() {
    setSelectedRecipients(new Map());
  }

  async function handleSend() {
    if (selectedRecipients.size === 0) {
      toast.error("select at least one recipient");
      return;
    }
    try {
      setIsSending(true);
      const recipients = Array.from(selectedRecipients.values());
      const res = await fetch(`/api/events/${eventId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients }),
      });
      const data = await res.json();
      if (!data.success && res.status !== 207) {
        toast.error(data.message);
        return;
      }
      if (res.status === 207) {
        toast.warning(data.message);
      } else {
        toast.success(`invitations sent to ${data.sent} guests`);
      }
      router.push(`/events/${eventId}`);
      router.refresh();
    } catch {
      toast.error("something went wrong. please try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          {selectedCount === 0
            ? "No guests selected"
            : `${selectedCount} guest${selectedCount === 1 ? "" : "s"} selected`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="font-mono text-xs h-7"
            onClick={selectAll}
            disabled={isSending}
          >
            Select all
          </Button>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-xs h-7 text-muted-foreground"
              onClick={clearAll}
              disabled={isSending}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {workspaces.map((workspace) => {
          const allSelected = workspace.members.every((m) =>
            selectedRecipients.has(m.email),
          );
          const someSelected =
            !allSelected &&
            workspace.members.some((m) => selectedRecipients.has(m.email));

          return (
            <div key={workspace.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {workspace.name}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {workspace.members.length} members
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-mono text-xs h-6 px-2"
                  onClick={() => toggleWorkspace(workspace.members)}
                  disabled={isSending}
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </Button>
              </div>

              <div className="border border-border divide-y divide-border">
                {workspace.members.map((member) => {
                  const isSelected = selectedRecipients.has(member.email);
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleRecipient(member)}
                      disabled={isSending}
                      className={`w-full flex items-center justify-between px-4 py-2.5 transition-colors text-left ${
                        isSelected ? "bg-foreground/5" : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-mono text-xs text-foreground truncate">
                          {member.name ?? (
                            <span className="text-muted-foreground italic">
                              No name
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground truncate">
                          {member.email}
                        </span>
                      </div>
                      <div
                        className={`h-4 w-4 border shrink-0 ml-3 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-foreground bg-foreground"
                            : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <span className="text-background text-xs font-bold leading-none">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {someSelected && (
                <p className="font-mono text-xs text-muted-foreground">
                  {
                    workspace.members.filter((m) =>
                      selectedRecipients.has(m.email),
                    ).length
                  }{" "}
                  of {workspace.members.length} selected
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Separator className="bg-border" />

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="font-mono text-xs"
          onClick={() => router.push(`/events/${eventId}`)}
          disabled={isSending}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="font-mono text-xs gap-2"
          onClick={handleSend}
          disabled={isSending || selectedCount === 0}
        >
          <Send className="h-3 w-3" />
          {isSending
            ? "Sending..."
            : `Send to ${selectedCount} guest${selectedCount === 1 ? "" : "s"}`}
        </Button>
      </div>
    </div>
  );
}
