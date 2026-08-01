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
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-16 relative overflow-hidden">
      <div className="container px-4">
        <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            {/* Eyebrow */}
            <p className="text-xs text-primary font-bold tracking-widest uppercase mb-6 animate-fade-up">
              Readiness Intelligence Platform
            </p>

            {/* Headline */}
            <h1 className="font-serif text-display mb-8 animate-fade-up-delay-1 leading-[1.1] text-left">
              Know when to push.
              <br />
              <span className="italic text-primary">Know when to rest.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-body text-muted-foreground text-left mb-10 animate-fade-up-delay-2 leading-relaxed max-w-lg">
              ATHENAFIT analyzes your daily sleep, soreness, stress, and available time to prescribe the safest, most effective activity—preventing fatigue build-up before it starts.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up-delay-3 w-full sm:w-auto">
              <Button size="xl" onClick={handleCTA} className="btn-hero-glow w-full sm:w-auto">
                {hasCheckedIn ? "Go to Dashboard" : "Start Your Assessment"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <a href="#science" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full">
                  View the Science
                </Button>
              </a>
            </div>

            {/* Trust indicator */}
            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-16 animate-fade-up-delay-4 text-left">
              Optimizing performance for over 50,000+ individuals worldwide
            </p>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-primary/20 shadow-glow animate-fade-up-delay-2 shrink-0">
            {/* Ambient background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <img 
              src="/athenafit-readiness/hero_runner.jpg" 
              alt="Elite Athlete Sprinting" 
              className="w-full h-full object-cover transform hover:scale-[1.03] transition-transform duration-700"
            />
          </div>
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
