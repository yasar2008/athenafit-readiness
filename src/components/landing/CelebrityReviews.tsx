import { Star, Award, Shield, Sparkles } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  readinessAvg: number;
  tags: string[];
}

const testimonials: Testimonial[] = [
  {
    name: "Hrithik Roshan",
    role: "Bollywood Icon & Fitness Pioneer",
    quote: "ATHENAFIT's biometric tracking is pure science. It helps me balance heavy action choreography, intense gym sessions, and recovery time. My daily readiness score determines exactly how hard I push on set.",
    readinessAvg: 94,
    tags: ["Hybrid Training", "CNS Recovery"]
  },
  {
    name: "Virat Kohli",
    role: "Indian Cricket Legend & Elite Athlete",
    quote: "In modern sport, load management is the difference between peak form and injury. ATHENAFIT gives me a clear biometric screenshot every single morning. The HRV analysis is spot on.",
    readinessAvg: 92,
    tags: ["Athletic Performance", "HRV Logging"]
  },
  {
    name: "Katrina Kaif",
    role: "Fitness Icon & Film Personality",
    quote: "I use the GPS Run Tracker and the simulation sliders to customize my weekly active recovery. It's the first platform that actually details how sleep debt impacts muscle soreness. Incredibly helpful.",
    readinessAvg: 89,
    tags: ["Functional Conditioning", "Sleep Sync"]
  },
  {
    name: "John Abraham",
    role: "Actor & Strength Specialist",
    quote: "No more guessing if I should load another plate or go home. ATHENAFIT's central nervous system warnings keep me lifting safely. When my score says 50%, I deload. Period.",
    readinessAvg: 96,
    tags: ["Powerlifting", "Strain Targets"]
  }
];

const CelebrityReviews = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden border-t border-border/30">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 filter blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 filter blur-3xl -z-10 animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="container px-4">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Elite Endorsements
          </div>
          <h2 className="font-serif text-title md:text-headline uppercase tracking-tight">
            Trusted by the <span className="italic text-primary">Best</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
            How India's leading sports icons and fitness advocates analyze their daily autonomic biomarkers to perform at their absolute potential.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div 
              key={t.name}
              className="glass-card rounded-2xl p-6 border border-border/50 bg-card hover:border-primary/45 transition-all duration-300 flex flex-col justify-between gap-4 group hover:scale-[1.01] hover:shadow-card"
            >
              <div className="space-y-3">
                
                {/* Top header details */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-base text-foreground font-bold leading-none">
                      {t.name}
                    </h4>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider block mt-1">
                      {t.role}
                    </span>
                  </div>
                  
                  {/* Avg readiness indicator */}
                  <div className="bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg text-right shrink-0">
                    <span className="text-[8px] font-bold text-muted-foreground uppercase block tracking-wider leading-none">Avg Readiness</span>
                    <span className="font-mono text-xs font-bold text-primary block mt-0.5">{t.readinessAvg}%</span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Review body */}
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Tags HUD */}
              <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-border/10">
                {t.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-muted/40 border border-border/40 text-[9px] font-semibold text-muted-foreground"
                  >
                    <Award className="h-2.5 w-2.5 text-primary" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CelebrityReviews;
