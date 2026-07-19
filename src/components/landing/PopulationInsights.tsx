import { Users, TrendingUp, Shield, AlertTriangle } from "lucide-react";

const stats = [
  { value: "2,847", label: "Active Users", change: "+12%" },
  { value: "76%", label: "Avg. Readiness", change: "+3%" },
  { value: "94%", label: "Adherence Rate", change: "+8%" },
  { value: "12", label: "Risk Alerts", change: "-23%" },
];

const PopulationInsights = () => {
  return (
    <section className="section-padding subtle-gradient">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Stats Grid */}
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="editorial-card rounded-xl p-6 md:p-8"
                >
                  <p className="font-serif text-4xl md:text-5xl mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mb-3">{stat.label}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    stat.change.startsWith("+") 
                      ? "bg-success/10 text-success" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Alert preview */}
            <div className="mt-6 editorial-card rounded-xl p-6 border-l-2 border-warning">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Heat Advisory Active</p>
                  <p className="text-xs text-muted-foreground">
                    Outdoor training reduced by 30% across 847 users. Indoor alternatives recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">
              Population Intelligence
            </p>
            <h2 className="font-serif text-headline mb-6">
              Insights at scale.
              <br />
              <span className="italic">For those who lead.</span>
            </h2>
            <p className="text-body-lg text-muted-foreground mb-8">
              For organizations and public health programs, ATHENAFIT provides aggregate analytics on stress trends, engagement patterns, and emerging risk zones—enabling proactive intervention before problems escalate.
            </p>

            <ul className="space-y-4">
              {[
                "Real-time stress and fatigue monitoring across populations",
                "Policy-aware adaptation for environmental factors",
                "Early warning systems for burnout and injury risk",
                "Engagement analytics and adherence optimization",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopulationInsights;
