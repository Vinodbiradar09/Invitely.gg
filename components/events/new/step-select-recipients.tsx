"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  EventCreationState,
  RecipientEntry,
} from "@/app/hooks/use-event-creation";

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

interface StepSelectRecipientsProps {
  state: EventCreationState;
  workspaces: Workspace[];
  onToggleRecipient: (entry: RecipientEntry) => void;
  onToggleWorkspace: (members: RecipientEntry[]) => void;
  getWorkspaceSelectionState: (
    members: RecipientEntry[],
  ) => "none" | "some" | "all";
  onNext: () => void;
  onBack: () => void;
}

export function StepSelectRecipients({
  state,
  workspaces,
  onToggleRecipient,
  onToggleWorkspace,
  getWorkspaceSelectionState,
  onNext,
  onBack,
}: StepSelectRecipientsProps) {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(
    new Set(workspaces.map((w) => w.id)), // all expanded by default
  );

  function toggleExpanded(workspaceId: string) {
    setExpandedWorkspaces((prev) => {
      const next = new Set(prev);
      if (next.has(workspaceId)) {
        next.delete(workspaceId);
      } else {
        next.add(workspaceId);
      }
      return next;
    });
  }

  const selectedCount = state.selectedRecipients.size;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          Select who to invite
        </p>
        {selectedCount > 0 && (
          <Badge
            variant="secondary"
            className="font-mono text-xs bg-foreground/10 text-foreground"
          >
            {selectedCount} selected
          </Badge>
        )}
      </div>

      {workspaces.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-border">
          <p className="font-mono text-xs text-muted-foreground">
            No workspaces found. Create a workspace first.
          </p>
        </div>
      ) : (
        <div className="flex flex-col border border-border divide-y divide-border">
          {workspaces.map((workspace) => {
            const members: RecipientEntry[] = workspace.members.map((m) => ({
              email: m.email,
              name: m.name,
            }));
            const selectionState = getWorkspaceSelectionState(members);
            const isExpanded = expandedWorkspaces.has(workspace.id);

            return (
              <div key={workspace.id}>
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                  <Checkbox
                    checked={selectionState === "all"}
                    data-state={
                      selectionState === "some" ? "indeterminate" : undefined
                    }
                    onCheckedChange={() => onToggleWorkspace(members)}
                    disabled={members.length === 0}
                    className={
                      selectionState === "some"
                        ? "data-[state=checked]:bg-foreground/50"
                        : ""
                    }
                  />
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-between gap-3 text-left"
                    onClick={() => toggleExpanded(workspace.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {workspace.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs px-1.5 py-0 h-4"
                      >
                        {workspace.members.length}
                      </Badge>
                      {selectionState === "some" && (
                        <span className="font-mono text-xs text-muted-foreground">
                          (
                          {
                            members.filter((m) =>
                              state.selectedRecipients.has(m.email),
                            ).length
                          }{" "}
                          selected)
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {isExpanded && workspace.members.length > 0 && (
                  <div className="border-t border-border bg-muted/10 divide-y divide-border">
                    {workspace.members.map((member) => {
                      const isSelected = state.selectedRecipients.has(
                        member.email,
                      );
                      return (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 px-4 py-2.5 pl-10 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() =>
                            onToggleRecipient({
                              email: member.email,
                              name: member.name,
                            })
                          }
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() =>
                              onToggleRecipient({
                                email: member.email,
                                name: member.name,
                              })
                            }
                          />
                          <div className="flex flex-col gap-0.5 min-w-0">
                            {member.name && (
                              <span className="font-mono text-xs text-foreground">
                                {member.name}
                              </span>
                            )}
                            <span className="font-mono text-xs text-muted-foreground truncate">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {isExpanded && workspace.members.length === 0 && (
                  <div className="px-10 py-3 border-t border-border bg-muted/10">
                    <p className="font-mono text-xs text-muted-foreground">
                      No members in this workspace
                    </p>
                  </div>
                )}
              </div>
            );
          })}
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
          disabled={selectedCount === 0}
        >
          Next → ({selectedCount})
        </Button>
      </div>
    </div>
  );
}
