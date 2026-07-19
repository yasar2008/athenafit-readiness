import { useState, useEffect } from "react";
import { Moon, Battery, Brain, Clock, Zap, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReadiness, CheckInData } from "@/hooks/useReadiness";
import { useNavigate } from "react-router-dom";
import CheckInSlider from "./CheckInSlider";

interface QuickCheckInProps {
  onClose?: () => void;
}

const QuickCheckIn = ({ onClose }: QuickCheckInProps) => {
  const { checkInData, submitCheckIn } = useReadiness();
  const navigate = useNavigate();

  const [data, setData] = useState<CheckInData>({ ...checkInData });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisPhrases = [
    "Analyzing sleep quality and circadian rhythm...",
    "Correlating stress levels with heart rate variability...",
    "Assessing neuromuscular recovery and muscle soreness...",
    "Optimizing training volume for available time...",
    "Generating personalized AthenaFit readiness protocol..."
  ];

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev >= analysisPhrases.length - 1) {
            clearInterval(interval);
            // Complete submission
            submitCheckIn(data);
            setIsAnalyzing(false);
            if (onClose) onClose();
            navigate("/dashboard");
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing, data, navigate, submitCheckIn, onClose]);

  const handleSubmit = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
  };

  if (isAnalyzing) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center slide-up flex flex-col items-center justify-center min-h-[300px] border border-primary/20">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-primary/10 animate-ping opacity-75" />
        </div>
        <h3 className="font-serif text-title mb-2">Analyzing Biometrics</h3>
        <div className="h-6 overflow-hidden max-w-md">
          <p className="text-sm text-muted-foreground animate-pulse">
            {analysisPhrases[analysisStep]}
          </p>
        </div>
        
        {/* Step dots */}
        <div className="flex gap-2 mt-8">
          {analysisPhrases.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                idx <= analysisStep ? "bg-primary w-4" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 slide-up border border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-info text-primary-foreground">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-serif text-title">Daily Assessment</h3>
          <p className="text-xs text-muted-foreground">Log your indicators to compute today's training recommendations.</p>
        </div>
      </div>

      <div className="space-y-4">
        <CheckInSlider
          icon={Moon}
          label="Sleep Quality"
          description="Restoration and depth of sleep last night"
          value={data.sleep}
          onChange={(v) => setData({ ...data, sleep: v })}
        />
        <CheckInSlider
          icon={Battery}
          label="Energy Level"
          description="Physical energy and alertness"
          value={data.energy}
          onChange={(v) => setData({ ...data, energy: v })}
        />
        <CheckInSlider
          icon={Brain}
          label="Mental Stress"
          description="Cognitive load and stress levels"
          value={data.stress}
          onChange={(v) => setData({ ...data, stress: v })}
          labels={["Extreme", "High", "Moderate", "Low", "None"]}
        />
        <CheckInSlider
          icon={Zap}
          label="Muscle Soreness"
          description="Muscle tightness or fatigue"
          value={data.soreness}
          onChange={(v) => setData({ ...data, soreness: v })}
          labels={["Severe", "High", "Moderate", "Mild", "None"]}
        />
        <CheckInSlider
          icon={Clock}
          label="Time Available"
          description="Time you can allocate to physical activity"
          value={data.timeAvailable}
          onChange={(v) => setData({ ...data, timeAvailable: v })}
          labels={["15 min", "30 min", "45 min", "60 min", "90+ min"]}
        />
      </div>

      <div className="flex gap-3 mt-6">
        {onClose && (
          <Button
            variant="outline"
            className="flex-1 font-serif"
            onClick={onClose}
          >
            Cancel
          </Button>
        )}
        <Button variant="hero" className="flex-1 font-serif" onClick={handleSubmit}>
          Generate My Plan
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuickCheckIn;
