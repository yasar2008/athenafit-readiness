import { useEffect, useState } from "react";
import { ReadinessStatus } from "@/hooks/useReadiness";

interface ReadinessGaugeProps {
  value: number;
  label: string;
  status: ReadinessStatus;
}

const statusGlows = {
  ready: "shadow-[0_0_50px_-5px_rgba(91,166,124,0.3)] border-success/20",
  recovery: "shadow-[0_0_50px_-5px_rgba(71,154,196,0.3)] border-info/20",
  rest: "shadow-[0_0_50px_-5px_rgba(155,135,245,0.3)] border-rest/20",
  risk: "shadow-[0_0_50px_-5px_rgba(234,88,12,0.3)] border-destructive/20",
};

const statusLabels = {
  ready: "Ready to Train",
  recovery: "Light Activity",
  rest: "Rest Day",
  risk: "Caution Advised",
};

const ReadinessGauge = ({ value, label, status }: ReadinessGaugeProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const circumference = 2 * Math.PI * 88;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  // Select color gradient based on status
  const getGradientId = () => {
    return `gaugeGradient-${status}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-56 h-56 rounded-full flex items-center justify-center p-2 bg-card/40 backdrop-blur-md border ${statusGlows[status]} transition-all duration-700`}>
        {/* SVG Circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            className="opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke={`url(#${getGradientId()})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            {/* Gradients for each readiness tier */}
            <linearGradient id="gaugeGradient-ready" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5BA67C" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="gaugeGradient-recovery" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="gaugeGradient-rest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="gaugeGradient-risk" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-serif font-bold tracking-tight mb-0.5">
            {animatedValue}%
          </span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {label}
          </span>
        </div>
      </div>

      {/* Status badge */}
      <span className={`mt-6 px-5 py-2 rounded-full font-serif text-sm font-medium shadow-soft border border-border/40 transition-colors duration-500 bg-card`}>
        Status: <span className={`font-semibold capitalize text-primary`}>{statusLabels[status]}</span>
      </span>
    </div>
  );
};

export default ReadinessGauge;
