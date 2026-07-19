import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: "primary" | "success" | "warning" | "info" | "rest";
  delay?: number;
}

const colorStyles = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  rest: "bg-rest/10 text-rest",
};

const StatCard = ({ icon: Icon, label, value, trend, color = "primary", delay = 0 }: StatCardProps) => {
  return (
    <div 
      className="glass-card-hover rounded-2xl p-5 fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.positive 
              ? "bg-success/10 text-success" 
              : "bg-destructive/10 text-destructive"
          }`}>
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-2xl font-display font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
