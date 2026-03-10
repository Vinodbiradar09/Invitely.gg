import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardsProps {
  summary: {
    total: number;
    attending: number;
    maybe: number;
    declined: number;
    pending: number;
  };
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total invited",
      value: summary.total,
      color: "text-foreground",
      border: "border-border",
    },
    {
      label: "Attending",
      value: summary.attending,
      color: "text-green-500",
      border: "border-green-500/20",
    },
    {
      label: "Maybe",
      value: summary.maybe,
      color: "text-yellow-500",
      border: "border-yellow-500/20",
    },
    {
      label: "Declined",
      value: summary.declined,
      color: "text-destructive",
      border: "border-destructive/20",
    },
    {
      label: "Pending",
      value: summary.pending,
      color: "text-muted-foreground",
      border: "border-border",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map(({ label, value, color, border }) => (
        <Card key={label} className={`border bg-card ${border}`}>
          <CardContent className="px-4 py-3 flex flex-col gap-1">
            <span className={`font-mono text-2xl font-semibold ${color}`}>
              {value}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {label}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
