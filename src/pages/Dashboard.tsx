import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Heart, Moon, Zap, Flame, Sparkles, Activity, Clock, ShieldAlert,
  ChevronRight, RefreshCw, BarChart2, Check, RefreshCcw, Info, User, Award, Target, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReadiness, getStatusFromScore, getRecommendation, calculateScore } from "@/hooks/useReadiness";
import Header from "@/components/layout/Header";
import ReadinessGauge from "@/components/dashboard/ReadinessGauge";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import AlertPanel from "@/components/dashboard/AlertPanel";
import StatCard from "@/components/dashboard/StatCard";
import RecommendationCard from "@/components/dashboard/RecommendationCard";
import CheckInSlider from "@/components/dashboard/CheckInSlider";
import AdminPanel from "@/components/dashboard/AdminPanel";
import UserControlPanel from "@/components/dashboard/UserControlPanel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Mock trend data
const baseTrendData = [
  { day: "Mon", hrv: 62, readiness: 85 },
  { day: "Tue", hrv: 58, readiness: 72 },
  { day: "Wed", hrv: 65, readiness: 88 },
  { day: "Thu", hrv: 55, readiness: 65 }, // Will be dynamic today
  { day: "Fri", hrv: 60, readiness: 70 },
  { day: "Sat", hrv: 63, readiness: 75 },
  { day: "Sun", hrv: 66, readiness: 80 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    checkInData, 
    hasCheckedIn, 
    currentScore, 
    currentStatus, 
    currentRecommendation, 
    submitCheckIn,
    resetCheckIn,
    currentUser
  } = useReadiness();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sandboxData, setSandboxData] = useState({ ...checkInData });
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  // Sync sandbox with actual state if not in active sandbox edits
  useEffect(() => {
    if (!isSandboxMode) {
      setSandboxData({ ...checkInData });
    }
  }, [checkInData, isSandboxMode]);

  const activeData = isSandboxMode ? sandboxData : checkInData;
  const score = calculateScore(activeData);
  const status = getStatusFromScore(score);
  const recommendation = getRecommendation(score, activeData);

  // Calculate health biomarkers based on check-in sliders
  const hrvValue = Math.round(55 + activeData.sleep * 7 - activeData.stress * 4 - activeData.soreness * 1.5);
  const sleepHrs = (3.5 + activeData.sleep * 1.0 + activeData.energy * 0.1).toFixed(1);
  const restingHeartRate = Math.round(75 - activeData.sleep * 2.5 - activeData.energy * 1.5 + activeData.stress * 2.5 + activeData.soreness * 1);
  const strainLabel = score >= 80 ? "Optimal Load" : score >= 65 ? "Maintenance Load" : score >= 50 ? "Deload Active" : "No Strain";

  // Build dynamic chart data
  const chartData = baseTrendData.map((d) => {
    if (d.day === "Thu") {
      return { day: "Thu", hrv: hrvValue, readiness: score };
    }
    return d;
  });

  const handleSliderChange = (key: keyof typeof sandboxData, val: number) => {
    setIsSandboxMode(true);
    setSandboxData((prev) => ({ ...prev, [key]: val }));
  };

  const handleApplySandbox = () => {
    submitCheckIn(sandboxData);
    setIsSandboxMode(false);
  };

  const handleCancelSandbox = () => {
    setSandboxData({ ...checkInData });
    setIsSandboxMode(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />
      
      <main className="container py-8 px-4 md:px-6 space-y-8">

        {/* Top welcome banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-border/50 bg-gradient-to-r from-primary/5 to-info/5 fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success animate-ping" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Live Readiness Analysis
              </p>
            </div>
            
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <button className="text-left font-serif text-headline mt-1 hover:opacity-80 transition-opacity flex items-center gap-2 group">
                  Welcome back, <span className="italic underline decoration-primary/40">{currentUser ? currentUser.name : "Athlete"}</span>.
                  <Settings className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] p-0 bg-transparent border-none">
                <UserControlPanel onClose={() => setIsProfileOpen(false)} />
              </DialogContent>
            </Dialog>
            
            {currentUser && (
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  Focus: <strong className="text-foreground">{currentUser.focus}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-primary" />
                  Goal: <strong className="text-foreground">{currentUser.goal}</strong>
                </span>
              </div>
            )}

            {isSandboxMode && (
              <p className="text-xs text-warning mt-2 font-semibold">
                ⚠️ Currently viewing simulated sandbox metrics.
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {isSandboxMode ? (
              <>
                <Button variant="outline" size="sm" className="font-serif" onClick={handleCancelSandbox}>
                  Discard Sandbox
                </Button>
                <Button variant="hero" size="sm" className="font-serif" onClick={handleApplySandbox}>
                  Save Metrics
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="font-serif text-xs flex items-center gap-2 hover:bg-muted"
                onClick={() => {
                  resetCheckIn();
                  navigate("/");
                }}
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Retake Daily Check-in
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: GAUGE AND SANDBOX */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Readiness score gauge card */}
            <div className="glass-card rounded-2xl p-6 border border-border/50 flex flex-col items-center">
              <ReadinessGauge value={score} label="Readiness" status={status} />
              
              <div className="w-full mt-6 pt-6 border-t border-border/30 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                  Today's Category
                </p>
                <p className="font-serif text-title capitalize mt-1 text-primary">
                  {status === "ready" ? "Peak Training" : status === "recovery" ? "Recovery Zone" : status === "rest" ? "Rest & Repair" : "Overtraining Warning"}
                </p>
                <p className="text-xs text-muted-foreground mt-2 px-4 leading-relaxed">
                  {status === "ready" 
                    ? "Your body is highly receptive to muscular and cardiovascular loading today." 
                    : status === "recovery" 
                    ? "Targeted volume reduction is recommended to prevent chronic overload." 
                    : status === "rest" 
                    ? "Prioritize sleep hygiene, light active stretching, and tissue hydration." 
                    : "Caution Advised. Autonomic balance suggests severe stress and fatigue."}
                </p>
              </div>
            </div>

            {/* Sandbox details */}
            <div className="glass-card rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-title">Simulation Sandbox</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tweak sliders to model different health states.
                  </p>
                </div>
                {isSandboxMode && (
                  <span className="text-[10px] uppercase font-bold text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                    Simulating
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                <CheckInSlider
                  icon={Moon}
                  label="Sleep Quality"
                  description="Simulate sleep change"
                  value={activeData.sleep}
                  onChange={(v) => handleSliderChange("sleep", v)}
                />
                <CheckInSlider
                  icon={Battery}
                  label="Energy Level"
                  description="Simulate energy changes"
                  value={activeData.energy}
                  onChange={(v) => handleSliderChange("energy", v)}
                />
                <CheckInSlider
                  icon={Brain}
                  label="Mental Stress"
                  description="Simulate mental load"
                  value={activeData.stress}
                  onChange={(v) => handleSliderChange("stress", v)}
                  labels={["Extreme", "High", "Moderate", "Low", "None"]}
                />
                <CheckInSlider
                  icon={Zap}
                  label="Muscle Soreness"
                  description="Simulate soreness levels"
                  value={activeData.soreness}
                  onChange={(v) => handleSliderChange("soreness", v)}
                  labels={["Severe", "High", "Moderate", "Mild", "None"]}
                />
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: BIOMETRICS AND STREAKS */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Active alerts panel */}
            <AlertPanel />

            {/* Biometrics Stat Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard 
                icon={Activity} 
                label="HRV Average" 
                value={`${hrvValue} ms`}
                trend={{ value: hrvValue > 60 ? Math.round(((hrvValue - 60)/60)*100) : Math.round(((hrvValue - 60)/60)*100), positive: hrvValue >= 60 }} 
                color={hrvValue >= 70 ? "success" : hrvValue >= 55 ? "info" : "warning"}
                delay={50}
              />
              <StatCard 
                icon={Moon} 
                label="Sleep logged" 
                value={`${sleepHrs}h`}
                trend={{ value: Math.round(Number(sleepHrs) > 7.5 ? 8 : -12), positive: Number(sleepHrs) >= 7.5 }} 
                color={Number(sleepHrs) >= 8.0 ? "success" : Number(sleepHrs) >= 6.5 ? "info" : "warning"}
                delay={100}
              />
              <StatCard 
                icon={Heart} 
                label="Resting HR" 
                value={`${restingHeartRate} bpm`}
                trend={{ value: restingHeartRate < 62 ? Math.round(((62 - restingHeartRate)/62)*100) : Math.round(((restingHeartRate - 62)/62)*100), positive: restingHeartRate <= 62 }} 
                color={restingHeartRate <= 60 ? "success" : restingHeartRate <= 68 ? "info" : "warning"}
                delay={150}
              />
              <StatCard 
                icon={Flame} 
                label="Strain Target" 
                value={strainLabel}
                color={score >= 80 ? "primary" : score >= 65 ? "info" : "rest"}
                delay={200}
              />
            </div>

            {/* Weekly progress */}
            <WeeklyProgress />

          </div>

          {/* RIGHT COLUMN: RECOMMENDATIONS AND CHART */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Dynamic AI Recommendation Card */}
            <RecommendationCard 
              type={recommendation.type}
              title={recommendation.title}
              description={recommendation.description}
              duration={recommendation.duration}
              intensity={recommendation.intensity}
              explanation={recommendation.explanation}
            />

            {/* Recharts trend graph */}
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-title">7-Day Biometric Trend</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    HRV and Readiness Score levels
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-primary/80" />
                    <span>Score</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-info/80" />
                    <span>HRV</span>
                  </div>
                </div>
              </div>

              <div className="h-48 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartReadiness" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="chartHrv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/40)"/>
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false}/>
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]}/>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="readiness" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#chartReadiness)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hrv" 
                      stroke="hsl(var(--info))" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#chartHrv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-muted/20 mt-16 text-center text-xs text-muted-foreground">
        <p className="font-serif">ATHENAFIT Readiness Intelligence Platform © 2026. All rights reserved.</p>
        <p className="mt-1 text-[10px]">Built for sustainable performance and biometric integrity.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
