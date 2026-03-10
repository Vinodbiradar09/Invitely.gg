import { WorkspaceCard } from "@/components/workspace/workspace-card";

interface Member {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface Workspace {
  id: string;
  name: string;
  members: Member[];
  createdAt: Date;
}

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="border border-dashed border-border w-12 h-12 flex items-center justify-center">
          <span className="font-mono text-lg text-muted-foreground">+</span>
        </div>
        <div className="text-center">
          <p className="font-mono text-sm text-foreground">No workspaces yet</p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            Create your first workspace to start organizing contacts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
