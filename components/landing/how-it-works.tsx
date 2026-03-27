const steps = [
  {
    title: "Create Workspaces",
    description:
      "Organize contacts into groups Family, Office, Friends. Add once, reuse forever.",
  },
  {
    title: "Write Your Invite",
    description:
      "Type your message casually. AI tailors it into a professional invitation.",
  },
  {
    title: "Send & Track",
    description:
      "Send to everyone at once. Watch responses come in live on your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-12 px-6 border-t border-border bg-card/30"
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map(({ title, description }, index) => (
            <div
              key={title}
              className="relative flex flex-col gap-4 px-8 py-6 border-b md:border-b-0 md:border-l border-border first:border-l-0 last:border-b-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-mono text-base font-semibold text-foreground tracking-tight">
                {title}
              </h3>
              <p className="font-mono text-sm text-muted-foreground/60 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
