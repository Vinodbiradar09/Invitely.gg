import { WorkspaceDeleteDialog } from "@/components/workspace/workspace-delete-dialog";
import { MemberAddDialog } from "@/components/workspace/member-add-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  const isNearLimit = memberCount >= 20;
  const isAtLimit = memberCount >= MAX_MEMBERS;

  return (
    <Card className="border-border bg-card flex flex-col">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-mono text-sm font-semibold text-foreground truncate">
              {workspace.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`font-mono text-xs px-1.5 py-0 h-4 ${
                  isAtLimit
                    ? "bg-destructive/20 text-destructive border-destructive/30"
                    : isNearLimit
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      : ""
                }`}
              >
                {memberCount}/{MAX_MEMBERS}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                members
              </span>
            </div>
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
      </CardHeader>

      <CardContent className="px-4 pb-4 flex-1">
        <MemberList members={workspace.members} workspaceId={workspace.id} />
      </CardContent>
    </Card>
  );
}
