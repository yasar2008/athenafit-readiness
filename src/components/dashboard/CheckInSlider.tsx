import { Slider } from "@/components/ui/slider";
import { LucideIcon } from "lucide-react";

interface CheckInSliderProps {
  icon: LucideIcon;
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  labels?: string[];
}

const CheckInSlider = ({
  icon: Icon,
  label,
  description,
  value,
  onChange,
  min = 1,
  max = 5,
  labels = ["Poor", "Fair", "Good", "Great", "Excellent"],
}: CheckInSliderProps) => {
  const getValueColor = (val: number) => {
    if (val <= 2) return "text-destructive";
    if (val <= 3) return "text-warning";
    return "text-success";
  };

  return (
    <div className="glass-card rounded-2xl p-5 transition-all duration-200 hover:shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{label}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <span className={`text-lg font-display font-bold ${getValueColor(value)}`}>
          {value}/{max}
        </span>
      </div>

      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={1}
        className="my-4"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        {labels.map((lbl, idx) => (
          <span
            key={lbl}
            className={`transition-colors ${
              value === idx + 1 ? "text-primary font-medium" : ""
            }`}
          >
            {lbl}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CheckInSlider;
