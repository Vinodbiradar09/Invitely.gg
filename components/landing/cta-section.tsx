export function CTASection() {
  return (
    <section className="py-24 px-6 border-t border-border bg-card/30">
      <div className="mx-auto max-w-5xl">
        <div className="border border-border px-8 py-16 flex flex-col items-center text-center gap-6">
          <div className="flex flex-col gap-4 max-w-lg">
            <h2 className="font-mono text-2xl sm:text-3xl font-bold text-foreground leading-tight text-balance">
              Stop copy-pasting.
              <br />
              Start inviting.
            </h2>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Invitely.gg handles the sending so you can focus on the event.
              Free to use, no credit card required.
            </p>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            5 workspaces · 25 members each · Free forever
          </p>
        </div>
      </div>
    </section>
  );
}
