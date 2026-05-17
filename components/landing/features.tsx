import { CardSpotlight } from "@/components/ui/card-spotlight";

interface FeatureItem {
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    title: "AI Powered",
    description:
      "Write casually, send professionally. AI optimizes your message into a clean invitation with personalized openings.",
  },
  {
    title: "Send at Scale",
    description:
      "Batch delivery to your entire contact list with zero manual effort. Schedule sends for the perfect time.",
  },
  {
    title: "Live Tracking",
    description:
      "Track attending, maybe, and declined in real time. Send reminders to pending guests in one click.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-white/8 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-balance">
            Everything you need to send
            <br />
            <span className="text-muted-foreground">at scale.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 border border-white/8">
          {features.map(({ title, description }) => (
            <CardSpotlight
              key={title}
              className="relative bg-black/40 backdrop-blur-sm p-8 flex flex-col justify-start min-h-50 cursor-default"
              radius={200}
              color="rgba(255,255,255,0.03)"
            >
              <div className="relative z-20 flex flex-col gap-3 cursor-pointer">
                <h3 className="font-mono text-base font-semibold text-foreground tracking-tight">
                  {title}
                </h3>
                <p className="font-mono text-sm text-muted-foreground/60 leading-relaxed">
                  {description}
                </p>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  );
}
