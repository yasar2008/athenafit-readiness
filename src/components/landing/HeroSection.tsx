import { useState, useEffect } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onStartAssessment?: () => void;
  hasCheckedIn?: boolean;
}

const bgImages = [
  "/athenafit-readiness/bg_runner.jpg",
  "/athenafit-readiness/bg_gym.jpg",
  "/athenafit-readiness/bg_cyclist.jpg"
];

const HeroSection = ({ onStartAssessment, hasCheckedIn }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCTA = () => {
    if (hasCheckedIn) {
      navigate("/dashboard");
    } else if (onStartAssessment) {
      onStartAssessment();
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-16 relative overflow-hidden bg-background">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {bgImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-30" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        {/* Dark radial and linear gradients for maximum legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/75 to-background z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(7,8,10,0.8)_80%)] z-10" />
      </div>

      <div className="container px-4 z-20 relative">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Eyebrow */}
          <p className="text-xs text-primary font-bold tracking-widest uppercase mb-6 animate-fade-up">
            Readiness Intelligence Platform
          </p>

          {/* Headline */}
          <h1 className="font-serif text-display mb-8 animate-fade-up-delay-1 leading-[1.1]">
            Know when to push.
            <br />
            <span className="italic text-primary">Know when to rest.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg text-muted-foreground text-center mb-10 animate-fade-up-delay-2 leading-relaxed max-w-2xl">
            ATHENAFIT analyzes your daily sleep, soreness, stress, and available time to prescribe the safest, most effective activity—preventing fatigue build-up before it starts.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3 w-full sm:w-auto">
            <Button size="xl" onClick={handleCTA} className="btn-hero-glow w-full sm:w-auto">
              {hasCheckedIn ? "Go to Dashboard" : "Start Your Assessment"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a href="#science" className="w-full sm:w-auto">
              <Button variant="outline" size="xl" className="w-full hover:bg-muted/40">
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
