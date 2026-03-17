const steps = [
  {
    number: "01",
    title: "Build your workspaces",
    desc: "Organise your contacts into groups Family, College, Office, Close Friends. Add names and emails once. Reuse forever across events.",
    detail: "Up to 5 workspaces · 25 members each",
  },
  {
    number: "02",
    title: "Write your invite",
    desc: "Type your message in plain casual language. Our AI optimizes it into a proper, warm invitation email with the right subject and tone.",
    detail: "AI powered · Editable output · Save as template",
  },
  {
    number: "03",
    title: "Select & send",
    desc: "Pick entire workspaces or specific people. Preview exactly what they'll receive. Send now or schedule for the best time.",
    detail: "Batch delivery · Smart send time · Schedule support",
  },
  {
    number: "04",
    title: "Track every response",
    desc: "Watch RSVPs come in live. See who opened, who responded, who added a note. Send reminders to pending guests in one click.",
    detail: "Real-time dashboard · AI insights · Guest notes",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-3 max-w-xl">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            How it works
          </span>
          <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            Four steps from idea
            <br />
            <span className="text-muted-foreground">to inbox.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
          {steps.map(({ number, title, desc, detail }) => (
            <div
              key={number}
              className="flex flex-col gap-5 px-6 py-8 relative"
            >
              <span className="font-mono text-5xl font-bold text-border select-none">
                {number}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-mono text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
              <div className="mt-auto pt-4 border-t border-border">
                <span className="font-mono text-xs text-muted-foreground">
                  {detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
