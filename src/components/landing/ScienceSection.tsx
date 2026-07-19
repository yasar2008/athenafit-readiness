const principles = [
  {
    number: "01",
    title: "Safety First",
    description: "Every recommendation prioritizes your long-term health over short-term performance gains. We believe in sustainable progress.",
  },
  {
    number: "02",
    title: "Transparent AI",
    description: "No black boxes. Every decision is explained in plain language, helping you develop intuition about your own body.",
  },
  {
    number: "03",
    title: "Evidence-Based",
    description: "Our models are built on peer-reviewed research in exercise science, recovery physiology, and behavioral health.",
  },
  {
    number: "04",
    title: "Human-Centered",
    description: "Technology should empower, not overwhelm. Our interface is designed for clarity, not complexity.",
  },
];

const ScienceSection = () => {
  return (
    <section className="section-padding">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">
            Our Philosophy
          </p>
          <h2 className="font-serif text-headline mb-6">
            Built on science.
            <br />
            <span className="italic">Designed for humans.</span>
          </h2>
          <p className="text-body-lg text-muted-foreground">
            ATHENAFIT isn't just another fitness app. It's a health intelligence platform grounded in research and guided by principles that put your wellbeing first.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid md:grid-cols-2 gap-px bg-border">
          {principles.map((principle) => (
            <div
              key={principle.number}
              className="bg-background p-10 md:p-14 group hover:bg-muted/30 transition-colors duration-500"
            >
              <span className="text-xs text-muted-foreground tracking-widest mb-6 block">
                {principle.number}
              </span>
              <h3 className="font-serif text-title mb-4 group-hover:translate-x-1 transition-transform duration-300">
                {principle.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScienceSection;
