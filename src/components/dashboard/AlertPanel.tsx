import { AlertTriangle, ThermometerSun, Wind, Info, X, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useReadiness } from "@/hooks/useReadiness";

interface Alert {
  id: string;
  type: "warning" | "info" | "caution";
  icon: "heat" | "fatigue" | "stress" | "time" | "soreness";
  title: string;
  message: string;
}

const iconMap = {
  heat: ThermometerSun,
  fatigue: AlertTriangle,
  stress: Wind,
  time: Info,
  soreness: Zap,
};

const typeStyles = {
  warning: "border-warning/30 bg-warning/5 text-warning",
  info: "border-info/30 bg-info/5 text-info",
  caution: "border-destructive/30 bg-destructive/5 text-destructive",
};

const iconStyles = {
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
  caution: "bg-destructive/15 text-destructive",
};

const AlertPanel = () => {
  const { checkInData } = useReadiness();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const list: Alert[] = [];

    // Heat Advisory (always show one environment advisory for context)
    list.push({
      id: "env-heat",
      type: "warning",
      icon: "heat",
      title: "Heat Advisory Active",
      message: "High ambient temperature detected. Hydrate extra and consider training indoors.",
    });

    // Sleep Alert
    if (checkInData.sleep <= 2) {
      list.push({
        id: "sleep-debt",
        type: "caution",
        icon: "fatigue",
        title: "Sleep Debt Advisory",
        message: `Critical sleep score (${checkInData.sleep}/5) logged. Growth hormone and recovery pathways are impaired. Minimize joint impact.`,
      });
    }

    // Stress Alert
    if (checkInData.stress >= 4) {
      list.push({
        id: "stress-cortisol",
        type: "warning",
        icon: "stress",
        title: "High Cortisol Index",
        message: `Your stress rating is elevated (${checkInData.stress}/5). Mental fatigue affects motor unit recruitment. Focus on flow and control.`,
      });
    }

    // Soreness Alert
    if (checkInData.soreness >= 4) {
      list.push({
        id: "soreness-injury",
        type: "caution",
        icon: "soreness",
        title: "Micro-Tear Accumulation",
        message: `Acute muscle soreness is high (${checkInData.soreness}/5). Rest or gentle recovery flows are advised to prevent strain.`,
      });
    }

    // Time Constraint
    if (checkInData.timeAvailable <= 1) {
      list.push({
        id: "time-short",
        type: "info",
        icon: "time",
        title: "Express Protocol Triggered",
        message: `You are limited on time today (${checkInData.timeAvailable}/5). We have adjusted recommendations to be completed in 15-20 mins.`,
      });
    }

    setAlerts(list);
  }, [checkInData]);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Info className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
          Active Biomarker Alerts
        </h3>
      </div>

      {alerts.map((alert, index) => {
        const Icon = iconMap[alert.icon];
        return (
          <div
            key={alert.id}
            className={`glass-card rounded-xl p-4 border ${typeStyles[alert.type]} fade-in transition-all duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${iconStyles[alert.type]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs uppercase tracking-wide">{alert.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {alert.message}
                </p>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground p-1 shrink-0 transition-colors"
                onClick={() => dismissAlert(alert.id)}
                aria-label="Dismiss alert"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertPanel;
