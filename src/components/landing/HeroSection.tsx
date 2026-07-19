import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onStartAssessment?: () => void;
  hasCheckedIn?: boolean;
}

const HeroSection = ({ onStartAssessment, hasCheckedIn }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (hasCheckedIn) {
      navigate("/dashboard");
    } else if (onStartAssessment) {
      onStartAssessment();
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center pt-16 relative">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-xs text-primary font-bold tracking-widest uppercase mb-6 animate-fade-up">
            Readiness Intelligence Platform
          </p>

          {/* Headline */}
          <h1 className="font-serif text-display mb-8 animate-fade-up-delay-1">
            Know when to push.
            <br />
            <span className="italic">Know when to rest.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-up-delay-2 leading-relaxed">
            ATHENAFIT analyzes your daily sleep, soreness, stress, and available time to prescribe the safest, most effective activity—preventing fatigue build-up before it starts.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3">
            <Button size="xl" onClick={handleCTA} className="btn-hero-glow">
              {hasCheckedIn ? "Go to Dashboard" : "Start Your Assessment"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a href="#science">
              <Button variant="outline" size="xl">
                View the Science
              </Button>
            </a>
          </div>

          {/* Trust indicator */}
          <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-16 animate-fade-up-delay-4">
            Optimizing performance for over 50,000+ individuals worldwide
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <ArrowDown className="h-5 w-5 text-muted-foreground/50" />
      </div>
    </section>
  );
};

export default HeroSection;
