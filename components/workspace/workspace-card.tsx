import { WorkspaceDeleteDialog } from "@/components/workspace/workspace-delete-dialog";
import { MemberAddDialog } from "@/components/workspace/member-add-dialog";
import { MemberList } from "@/components/workspace/member-list";
import { Badge } from "@/components/ui/badge";

interface Member {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    members: Member[];
    createdAt: Date;
  };
}

const MAX_MEMBERS = 25;

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const memberCount = workspace.members.length;
  const isAtLimit = memberCount >= MAX_MEMBERS;

  return (
    <div className="border border-border bg-card flex flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-mono text-xs font-semibold text-foreground truncate">
            {workspace.name}
          </h3>
          <Badge
            variant="outline"
            className={`font-mono text-[10px] px-1.5 py-0 h-4 rounded-none tabular-nums ${
              isAtLimit
                ? "text-destructive border-destructive/30 bg-destructive/5"
                : "text-muted-foreground border-border bg-transparent"
            }`}
          >
            {memberCount}/{MAX_MEMBERS}
          </Badge>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <MemberAddDialog
            workspaceId={workspace.id}
            workspaceName={workspace.name}
            currentMemberCount={memberCount}
          />
          <WorkspaceDeleteDialog
            workspaceId={workspace.id}
            workspaceName={workspace.name}
          />
        </div>
      </div>

      <div className="px-4 py-1 flex-1">
        <MemberList members={workspace.members} workspaceId={workspace.id} />
      </div>
    </div>
  );
}
