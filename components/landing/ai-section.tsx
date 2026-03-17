import { Sparkles, Clock, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const before = `bro its my bday this saturday come party with us at my place, gonna be lit, dinner and drinks on me, dont forget to bring the boys`;

const after = `It's that time of year! Come celebrate my birthday this Saturday evening at my place.
Dinner and drinks are on me just bring yourself and good energy. It's going to be a great night.
Looking forward to seeing you there.`;

export function AISection() {
  return (
    <section className="py-24 px-6 border-t border-border bg-card/20">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-3 max-w-xl">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            AI powered
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            Write casually.
            <br />
            <span className="text-muted-foreground">Send professionally.</span>
          </h2>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-lg">
            You know what you want to say you just don&rsquo;t want to spend 20
            minutes making it sound right. Type it the way you&rsquo;d text a
            friend. Invitely&rsquo;s AI optimizes it into a optimized invite in
            seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="flex flex-col">
            <div className="border-b border-border px-5 py-3 bg-muted/20 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">
                You type this
              </span>
              <Badge
                variant="outline"
                className="font-mono text-xs text-muted-foreground h-4"
              >
                casual
              </Badge>
            </div>
            <div className="px-5 py-5">
              <p className="font-mono text-xs text-muted-foreground leading-relaxed italic">
                {before}
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="border-b border-border px-5 py-3 bg-muted/20 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                AI optimizes it to
              </span>
              <Badge
                variant="outline"
                className="font-mono text-xs text-green-500 border-green-500/30 h-4"
              >
                invite-ready
              </Badge>
            </div>
            <div className="px-5 py-5 flex flex-col gap-2">
              {after.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="font-mono text-xs text-foreground leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs text-muted-foreground">
            You always review before sending
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Sparkles,
              title: "Personalised openings",
              desc: "AI writes a unique first line for each guest based on their name and the event not a mail-merge, a real personal touch.",
            },
            {
              icon: Clock,
              title: "Smart send time",
              desc: "AI suggests the best day and time to send your invitations based on the event type and date to maximise open rates.",
            },
            {
              icon: BarChart3,
              title: "Response insights",
              desc: "Once guests respond, AI analyses the data and tells you what to do next with urgency levels and specific suggestions.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="border border-border px-5 py-4 flex flex-col gap-3 hover:border-foreground/20 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center border border-border bg-background">
                <Icon className="h-4 w-4 text-foreground" />
              </div>
              <h3 className="font-mono text-sm font-semibold text-foreground">
                {title}
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
