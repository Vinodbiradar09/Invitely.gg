import { MemberDeleteDialog } from "@/components/workspace/member-delete-dialog";

interface Member {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface MemberListProps {
  members: Member[];
  workspaceId: string;
}

export function MemberList({ members, workspaceId }: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          No members yet. Add someone to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between py-2.5 px-1 group"
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              {member.name ? (
                <span className="font-mono text-xs text-foreground truncate">
                  {member.name}
                </span>
              ) : (
                <span className="font-mono text-xs text-muted-foreground italic">
                  No name
                </span>
              )}
            </div>
            <span className="font-mono text-xs text-muted-foreground truncate">
              {member.email}
            </span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MemberDeleteDialog
              memberId={member.id}
              memberEmail={member.email}
              workspaceId={workspaceId}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
