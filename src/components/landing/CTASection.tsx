import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  onStartAssessment?: () => void;
  hasCheckedIn?: boolean;
}

const CTASection = ({ onStartAssessment, hasCheckedIn }: CTASectionProps) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (hasCheckedIn) {
      navigate("/dashboard");
    } else if (onStartAssessment) {
      onStartAssessment();
    }
  };

  return (
    <section className="section-padding subtle-gradient border-t border-border/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-headline mb-6">
            Ready to train smarter?
          </h2>
          <p className="text-body-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands who have unlocked peak physiological efficiency with readiness-based strain prescription.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" onClick={handleCTA} className="btn-hero-glow">
              {hasCheckedIn ? "Enter Dashboard" : "Begin Your Assessment"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="xl">
              Schedule a Consultation
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-10">
            Free 14-day trials · No credit card commitment · Seamless wearable integration
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
