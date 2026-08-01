import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useReadiness } from "@/hooks/useReadiness";
import Navigation from "@/components/landing/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import ReadinessVisual from "@/components/landing/ReadinessVisual";
import AdaptiveRecommendations from "@/components/landing/AdaptiveRecommendations";
import PopulationInsights from "@/components/landing/PopulationInsights";
import ScienceSection from "@/components/landing/ScienceSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import QuickCheckIn from "@/components/dashboard/QuickCheckIn";
import FooterDialogs from "@/components/landing/FooterDialogs";
import CelebrityReviews from "@/components/landing/CelebrityReviews";

const Index = () => {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [footerDialogType, setFooterDialogType] = useState<string | null>(null);
  
  const { hasCheckedIn, currentScore, currentUser } = useReadiness();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      
      {/* Top Banner for Checked-in Users */}
      {hasCheckedIn && (
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 fixed top-0 left-0 right-0 z-[60] shadow-sm animate-fade-down">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Daily Check-in logged {currentUser ? `for ${currentUser.name}` : ""} (Score: {currentScore}%).</span>
          <Link to="/dashboard" className="underline font-bold flex items-center gap-1 hover:opacity-90 ml-1">
            Open Dashboard <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      <Navigation onStartAssessment={() => setIsCheckInOpen(true)} />
      
      <main className={hasCheckedIn ? "pt-8" : ""}>
        <HeroSection 
          onStartAssessment={() => setIsCheckInOpen(true)} 
          hasCheckedIn={hasCheckedIn} 
        />
        
        <div id="platform">
          <ReadinessVisual />
        </div>
        
        <AdaptiveRecommendations />
        
        <div id="insights">
          <PopulationInsights />
        </div>

        <CelebrityReviews />
        
        <div id="science">
          <ScienceSection />
        </div>
        
        <CTASection 
          onStartAssessment={() => setIsCheckInOpen(true)} 
          hasCheckedIn={hasCheckedIn} 
        />
      </main>
      
      <Footer onLinkClick={(link) => setFooterDialogType(link)} />

      {/* Daily Check-In Assessment Modal */}
      <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-none">
          <QuickCheckIn onClose={() => setIsCheckInOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Footer Informational Dialogs Modal */}
      <Dialog open={footerDialogType !== null} onOpenChange={(open) => !open && setFooterDialogType(null)}>
        <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-none">
          <FooterDialogs type={footerDialogType} onClose={() => setFooterDialogType(null)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
