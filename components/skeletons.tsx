export function EventListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="border border-border p-4 flex items-center justify-between animate-pulse"
        >
          <div className="flex flex-col gap-2">
            <div className="h-3 w-48 bg-muted rounded-none" />
            <div className="h-2 w-32 bg-muted rounded-none" />
          </div>
          <div className="h-2 w-16 bg-muted rounded-none" />
        </div>
      ))}
    </div>
  );
}

export function GuestTableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="border border-border p-3 flex items-center gap-4 animate-pulse"
        >
          <div className="h-2 w-40 bg-muted rounded-none" />
          <div className="h-2 w-24 bg-muted rounded-none" />
          <div className="h-2 w-16 bg-muted rounded-none" />
        </div>
      ))}
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border border-border p-4 animate-pulse">
          <div className="h-2 w-16 bg-muted rounded-none mb-3" />
          <div className="h-6 w-8 bg-muted rounded-none" />
        </div>
      ))}
    </div>
  );
}

export function WorkspaceListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="border border-border p-4 flex items-center justify-between animate-pulse"
        >
          <div className="flex flex-col gap-2">
            <div className="h-3 w-40 bg-muted rounded-none" />
            <div className="h-2 w-24 bg-muted rounded-none" />
          </div>
          <div className="h-2 w-16 bg-muted rounded-none" />
        </div>
      ))}
    </div>
  );
}

export function NewEventFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-2 w-24 bg-muted rounded-none" />
          <div className="h-9 w-full bg-muted rounded-none" />
        </div>
      ))}
      <div className="h-9 w-full bg-muted rounded-none mt-2" />
    </div>
  );
}
