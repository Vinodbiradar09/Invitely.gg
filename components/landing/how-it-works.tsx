const steps = [
  {
    number: "01",
    title: "Create Workspaces",
    description:
      "Organize contacts into groups Family, Office, Friends. Add once, reuse forever.",
  },
  {
    number: "02",
    title: "Write Your Invite",
    description:
      "Type your message casually. AI tailors it into a professional invitation.",
  },
  {
    number: "03",
    title: "Send & Track",
    description:
      "Send to everyone at once. Watch responses come in live on your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 border-t border-border bg-card/30"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-16">
          <div className="text-center">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              How it works
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-3">
              Three steps to send
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {steps.map(({ number, title, description }, index) => (
              <div
                key={number}
                className={`flex flex-col gap-4 ${index !== 0 ? "md:border-l md:border-border md:pl-8" : ""}`}
              >
                <span className="font-mono text-4xl font-bold text-border select-none">
                  {number}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-mono text-sm font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
