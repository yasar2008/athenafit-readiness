import { CheckCircle2, Circle, Flame } from "lucide-react";
import { useReadiness } from "@/hooks/useReadiness";

const typeColors = {
  workout: "bg-success/15 text-success border-success/30",
  recovery: "bg-info/15 text-info border-info/30",
  rest: "bg-rest/15 text-rest border-rest/30",
  pending: "bg-muted/50 text-muted-foreground border-muted-foreground/10",
};

const WeeklyProgress = () => {
  const { weekData } = useReadiness();
  
  const completedDays = weekData.filter((d) => d.completed).length;
  // Calculate streak based on consecutive completed days from Monday
  let streak = 0;
  for (let i = 0; i < weekData.length; i++) {
    if (weekData[i].completed) {
      streak++;
    } else {
      break;
    }
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-title">Weekly Progress</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedDays} of {weekData.length} days logged
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/20">
          <Flame className="h-4 w-4 fill-warning/20 animate-pulse" />
          <span className="text-xs font-bold">{streak} day streak</span>
        </div>
      </div>

      {/* Day circles */}
      <div className="flex justify-between gap-2 overflow-x-auto pb-2">
        {weekData.map((day, index) => (
          <div
            key={day.day}
            className="flex flex-col items-center gap-2 fade-in min-w-[42px]"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`w-11 h-11 rounded-full border flex flex-col items-center justify-center transition-all duration-300 ${
                day.completed
                  ? typeColors[day.type]
                  : "bg-muted/30 border-dashed border-muted-foreground/20"
              }`}
            >
              {day.completed ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/35" />
              )}
            </div>
            <span
              className={`text-xs font-semibold ${
                day.completed ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {day.day}
            </span>
            {day.completed && day.score ? (
              <span className="text-[10px] font-mono bg-primary/10 px-1 rounded text-primary">
                {day.score}%
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/40">-</span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-border/30">
        {[
          { type: "workout", label: "Workout logged" },
          { type: "recovery", label: "Recovery logged" },
          { type: "rest", label: "Rest logged" },
        ].map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                typeColors[item.type as keyof typeof typeColors].split(" ")[0]
              } border ${typeColors[item.type as keyof typeof typeColors].split(" ")[2]}`}
            />
            <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgress;
