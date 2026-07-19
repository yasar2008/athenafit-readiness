import { Dumbbell, Heart, Moon, AlertTriangle, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecommendationCardProps {
  type: "workout" | "recovery" | "rest";
  title: string;
  description: string;
  duration: string;
  intensity: string;
  explanation: string;
}

const typeConfig = {
  workout: {
    icon: Dumbbell,
    gradient: "from-success/20 to-primary/20",
    iconBg: "bg-success/20 text-success",
    badge: "bg-success/10 text-success",
  },
  recovery: {
    icon: Heart,
    gradient: "from-info/20 to-primary/20",
    iconBg: "bg-info/20 text-info",
    badge: "bg-info/10 text-info",
  },
  rest: {
    icon: Moon,
    gradient: "from-rest/20 to-info/20",
    iconBg: "bg-rest/20 text-rest",
    badge: "bg-rest/10 text-rest",
  },
};

const RecommendationCard = ({
  type,
  title,
  description,
  duration,
  intensity,
  explanation,
}: RecommendationCardProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="glass-card-hover rounded-2xl overflow-hidden slide-up">
      {/* Header gradient */}
      <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

      <div className="p-6">
        {/* Top section */}
        <div className="flex items-start gap-4">
          <div className={`p-4 rounded-2xl ${config.iconBg}`}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.badge}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Day
              </span>
            </div>
            <h3 className="text-xl font-display font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-semibold mt-0.5">{duration}</p>
          </div>
          <div className="flex-1 p-3 rounded-xl bg-muted/50">
            <p className="text-xs text-muted-foreground">Intensity</p>
            <p className="font-semibold mt-0.5">{intensity}</p>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-info/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary">AI Insight</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{explanation}</p>
        </div>

        {/* Action */}
        <Button variant="hero" className="w-full mt-6" size="lg">
          Start {type === "workout" ? "Workout" : type === "recovery" ? "Recovery" : "Rest Protocol"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RecommendationCard;
