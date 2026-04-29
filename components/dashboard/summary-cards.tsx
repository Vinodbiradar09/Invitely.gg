interface SummaryCardsProps {
  summary: {
    total: number;
    attending: number;
    maybe: number;
    declined: number;
    pending: number;
  };
}

const cards = [
  { key: "total", label: "Invited" },
  { key: "attending", label: "Attending" },
  { key: "maybe", label: "Maybe" },
  { key: "declined", label: "Declined" },
  { key: "pending", label: "Pending" },
] as const;

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-5 border border-border divide-x divide-border">
      {cards.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-1 px-4 py-3 bg-card">
          <span className="font-mono text-xl font-semibold text-foreground tabular-nums">
            {summary[key]}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
