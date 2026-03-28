"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Insights {
  summary: string;
  responseRate: number;
  topInsight: string;
  suggestion: string;
  urgency: "low" | "medium" | "high";
}

interface InsightsCardProps {
  eventId: string;
}

const urgencyConfig = {
  low: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    text: "text-blue-500",
    label: "Suggestion",
  },
  medium: {
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
    text: "text-yellow-500",
    label: "Action needed",
  },
  high: {
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    text: "text-red-500",
    label: "Urgent",
  },
};

export function InsightsCard({ eventId }: InsightsCardProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function handleGenerate() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const result = await res.json();
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setInsights(result.data.insights);
      setGenerated(true);
    } catch {
      toast.error("failed to generate insights");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="px-4 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              AI Insights
            </span>
          </div>
          {!generated && (
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs h-7 gap-2"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <Sparkles className="h-3 w-3" />
              {isLoading ? "Analysing..." : "Generate insights"}
            </Button>
          )}
          {generated && (
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-xs h-7 gap-2 text-muted-foreground"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? "Analysing..." : "Refresh"}
            </Button>
          )}
        </div>

        {!generated && !isLoading && (
          <p className="font-mono text-xs text-muted-foreground">
            Generate AI powered insights based on your guest responses.
          </p>
        )}

        {isLoading && (
          <div className="flex flex-col gap-3 animate-pulse">
            <div className="h-2 w-full bg-muted rounded-none" />
            <div className="h-2 w-3/4 bg-muted rounded-none" />
            <div className="h-2 w-1/2 bg-muted rounded-none" />
          </div>
        )}

        {insights && !isLoading && (
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              {insights.summary}
            </p>

            <Separator className="bg-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 border border-border px-3 py-2.5">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Response rate
                </span>
                <span className="font-mono text-2xl font-semibold text-foreground">
                  {insights.responseRate}%
                </span>
              </div>
              <div className="flex flex-col gap-1 border border-border px-3 py-2.5">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Top insight
                </span>
                <span className="font-mono text-xs text-foreground leading-relaxed">
                  {insights.topInsight}
                </span>
              </div>
            </div>

            <div
              className={`border ${urgencyConfig[insights.urgency].border} ${urgencyConfig[insights.urgency].bg} px-3 py-2.5 flex flex-col gap-1`}
            >
              <span
                className={`font-mono text-xs uppercase tracking-widest ${urgencyConfig[insights.urgency].text}`}
              >
                {urgencyConfig[insights.urgency].label}
              </span>
              <span className="font-mono text-xs text-foreground leading-relaxed">
                {insights.suggestion}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
