import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  useReadiness, UserProfile, calculateScore, getStatusFromScore, getRecommendation 
} from "@/hooks/useReadiness";
import { 
  Users, Activity, Award, ShieldAlert, Search, Trash2, RotateCcw, 
  UserPlus, Calendar, Plus, Clock, Terminal, ChevronRight, X, User as UserIcon, Dumbbell, Target, Mail, Lock, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const statusBorders = {
  ready: "border-success/30 bg-success/10 text-success",
  recovery: "border-info/30 bg-info/10 text-info",
  rest: "border-rest/30 bg-rest/10 text-rest",
  risk: "border-destructive/30 bg-destructive/10 text-destructive",
};

const statusColors = {
  ready: "#5BA67C",
  recovery: "#3B82F6",
  rest: "#8B5CF6",
  risk: "#EF4444",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    userList, 
    adminLogs, 
    deleteUser, 
    addUser, 
    resetUserCheckIn,
    isAdminVerified,
    verifyAdminKey
  } = useReadiness();

  const [search, setSearch] = useState("");
  const [passcode, setPasscode] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Add Athlete Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newFocus, setNewFocus] = useState<UserProfile["focus"]>("Hybrid Athlete");
  const [newGoal, setNewGoal] = useState("");

  // Filter athletes
  const filteredUsers = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Compute aggregate statistics
  const totalUsers = userList.length;
  const activeCheckIns = userList.filter((u) => u.score !== undefined).length;
  
  const checkedInUsers = userList.filter((u) => u.score !== undefined);
  const avgReadiness = checkedInUsers.length > 0 
    ? Math.round(checkedInUsers.reduce((sum, u) => sum + (u.score || 0), 0) / checkedInUsers.length)
    : 0;
    
  const riskCount = userList.filter((u) => u.status === "risk").length;

  // Compute distribution for chart (Ready, Recovery, Rest, Risk counts)
  const readyCount = userList.filter((u) => u.status === "ready").length;
  const recoveryCount = userList.filter((u) => u.status === "recovery").length;
  const restCount = userList.filter((u) => u.status === "rest").length;

  const distributionData = [
    { name: "Peak Ready", count: readyCount, color: statusColors.ready },
    { name: "Recovery", count: recoveryCount, color: statusColors.recovery },
    { name: "Rest Zone", count: restCount, color: statusColors.rest },
    { name: "Risk Alert", count: riskCount, color: statusColors.risk },
  ];

  // Handlers
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      toast.error("Please input authorization key");
      return;
    }
    const success = verifyAdminKey(passcode);
    if (success) {
      toast.success("Coach verification successful. Admin Console unlocked.");
    } else {
      toast.error("Invalid Coach Access Code. Access Denied.");
    }
  };

  const handleAddAthleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newGoal) {
      toast.error("Please fill in all athlete parameters");
      return;
    }
    
    const success = addUser(newName, newEmail, newFocus, newGoal);
    if (success) {
      toast.success(`Manually registered athlete '${newName}'`);
      setIsAddOpen(false);
      // Reset forms
      setNewName("");
      setNewEmail("");
      setNewGoal("");
    } else {
      toast.error("Athlete email already registered in system.");
    }
  };

  const handleForcedReset = (email: string, name: string) => {
    resetUserCheckIn(email);
    toast.success(`Cleared today's readiness inputs for '${name}'`);
    if (selectedUser && selectedUser.email === email) {
      setSelectedUser(null);
    }
  };

  const handleForcedDelete = (email: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete athlete '${name}'?`)) {
      deleteUser(email);
      toast.success(`Removed athlete '${name}' from platform directory`);
      if (selectedUser && selectedUser.email === email) {
        setSelectedUser(null);
      }
    }
  };

  // PASSCODE GATED LOCK SCREEN
  if (!isAdminVerified) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
        <Header />
        
        <div className="container max-w-md py-16 px-4">
          <div className="glass-card rounded-2xl p-6 border border-warning/20 bg-background/95 w-full max-w-md slide-up text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-warning/10 border border-warning/30 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Lock className="h-8 w-8 text-warning" />
            </div>
            
            <h2 className="font-serif text-title text-foreground uppercase tracking-wider">
              Security Gate Required
            </h2>
            <p className="text-xs text-muted-foreground mt-1.5 px-4 leading-relaxed">
              Biometric databases contain protected health information. Please authenticate to access population directories.
            </p>

            <form onSubmit={handleVerify} className="space-y-4 mt-6 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="adminKey" className="text-[10px] font-bold uppercase text-muted-foreground">
                  Coach Passcode Key
                </Label>
                <div className="relative">
                  <Input
                    id="adminKey"
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter security key"
                    className="pl-9 bg-muted/40 border-border/40 text-foreground text-xs"
                  />
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full font-serif text-xs uppercase tracking-wider py-4 mt-2">
                Verify Coach Access
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/30 border border-border/30 rounded-xl text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-warning">
                <ShieldAlert className="h-3.5 w-3.5" />
                Testing Instructions
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                To bypass this authorization gate, enter the Coach Authorization Key:
              </p>
              <code className="block text-center font-mono font-bold text-xs bg-card border border-border/50 py-1.5 rounded text-primary">
                ATHENA2026
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header />

      <main className="container py-8 px-4 md:px-6 space-y-8">
        
        {/* Banner Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card rounded-2xl border border-border/50 bg-gradient-to-r from-primary/5 to-info/5 fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-glow animate-pulse" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Coach Administrative Center
              </p>
            </div>
            <h1 className="font-serif text-headline mt-1">
              Platform Command <span className="italic">Console</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Monitor populations, manage records, and inspect dynamic biometric profiles.
            </p>
          </div>

          <div>
            {/* Add Athlete Trigger */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" size="sm" className="font-serif text-xs uppercase tracking-wide flex items-center gap-2 py-4">
                  <UserPlus className="h-4 w-4" />
                  Add New Athlete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] p-0 bg-transparent border-none">
                <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-background/95 w-full slide-up">
                  <h3 className="font-serif text-title text-primary uppercase text-center mb-6">Manually Register Athlete</h3>
                  
                  <form onSubmit={handleAddAthleteSubmit} className="space-y-4 text-left">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Athlete Name</Label>
                      <div className="relative">
                        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="John Doe" className="pl-9 text-xs bg-muted/30 border-border/50 text-foreground" />
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Email Address</Label>
                      <div className="relative">
                        <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="john@athenafit.com" className="pl-9 text-xs bg-muted/30 border-border/50 text-foreground" />
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Focus Discipline</Label>
                      <div className="relative">
                        <select value={newFocus} onChange={(e) => setNewFocus(e.target.value as UserProfile["focus"])} className="flex h-10 w-full rounded-md border border-border/50 bg-muted/30 px-9 py-2 text-xs text-foreground focus:ring-1 focus:ring-ring">
                          <option value="Hybrid Athlete">Hybrid Athlete</option>
                          <option value="Strength/Power">Strength/Power</option>
                          <option value="Cardio Endurance">Cardio Endurance</option>
                          <option value="Recovery/Mobility">Recovery/Mobility</option>
                        </select>
                        <Dumbbell className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Training Goal</Label>
                      <div className="relative">
                        <Input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="e.g. Sub-4hr Marathon" className="pl-9 text-xs bg-muted/30 border-border/50 text-foreground" />
                        <Target className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                      </div>
                    </div>

                    <Button type="submit" variant="hero" className="w-full text-xs uppercase tracking-wider py-4 mt-2">
                      Save Athlete Record
                    </Button>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Global KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Athletes" value={totalUsers} color="primary" delay={50} />
          <StatCard icon={Calendar} label="Checked-in Today" value={`${activeCheckIns} / ${totalUsers}`} color="info" delay={100} />
          <StatCard icon={Activity} label="Population Readiness" value={`${avgReadiness}%`} color="success" delay={150} />
          <StatCard icon={ShieldAlert} label="Risk Warnings" value={riskCount} color="warning" delay={200} />
        </div>

        {/* Main Admin Dashboard splits */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT/MID COLUMN: DIRECTORY & GRAPHS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Athlete Records Table */}
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-title">Population Directory</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Click any athlete row to inspect specific biometrics</p>
                </div>
                <div className="relative w-full sm:w-60">
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter athletes..." className="pl-9 bg-muted/40 border-border/40 text-xs h-9 text-foreground" />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/30 text-muted-foreground uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-4">Athlete</th>
                      <th className="py-2.5 px-4">Discipline</th>
                      <th className="py-2.5 px-4 text-center">Score</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.email} 
                        onClick={() => setSelectedUser(user)}
                        className={`hover:bg-primary/5 cursor-pointer transition-colors ${
                          selectedUser?.email === user.email ? "bg-primary/5 border-l-2 border-primary" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-foreground">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{user.email}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-primary block">{user.focus}</span>
                          <span className="text-[10px] text-muted-foreground block truncate max-w-[150px]">{user.goal}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {user.score !== undefined ? (
                            <span className="font-mono font-bold bg-primary/10 px-2 py-0.5 rounded text-primary text-xs">
                              {user.score}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30 font-mono">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {user.status ? (
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${statusBorders[user.status]}`}>
                              {user.status.toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30 border border-dashed border-border/40 px-2 py-0.5 rounded-full text-[9px]">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1.5">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              disabled={user.score === undefined}
                              onClick={() => handleForcedReset(user.email, user.name)}
                              className="h-8 w-8 text-warning hover:bg-warning/10 disabled:opacity-30"
                              title="Force Clear Log"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleForcedDelete(user.email, user.name)}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              title="Delete Athlete Profile"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recharts Graphs Section */}
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              <h3 className="font-serif text-title mb-2">Population Readiness Distribution</h3>
              <p className="text-xs text-muted-foreground mb-6">Quantity of athletes categorized within each zone tier</p>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/40)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DETAIL INSPECTOR & AUDIT LOGS */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Athlete detail inspector */}
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              {selectedUser ? (
                <div className="space-y-6 slide-up">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-title text-primary">Biometric Inspector</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Athlete Details</p>
                    </div>
                    <button 
                      onClick={() => setSelectedUser(null)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Header metadata */}
                  <div className="p-4 bg-muted/40 rounded-xl border border-border/40">
                    <p className="font-bold text-sm text-foreground">{selectedUser.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedUser.email}</p>
                    <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-border/30 text-xs">
                      <span>Focus: <strong className="text-foreground">{selectedUser.focus}</strong></span>
                      <span>Goal: <strong className="text-foreground">{selectedUser.goal}</strong></span>
                    </div>
                  </div>

                  {/* Bio metrics sliders logs if checked in */}
                  {selectedUser.score !== undefined && selectedUser.checkInData ? (
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Logged Biomarker Inputs</p>
                      
                      <div className="space-y-2 text-xs">
                        {[
                          { label: "Sleep Quality", val: selectedUser.checkInData.sleep, max: 5 },
                          { label: "Energy Level", val: selectedUser.checkInData.energy, max: 5 },
                          { label: "Mental Stress", val: selectedUser.checkInData.stress, max: 5, invert: true },
                          { label: "Muscle Soreness", val: selectedUser.checkInData.soreness, max: 5, invert: true }
                        ].map((m) => (
                          <div key={m.label} className="p-2.5 bg-muted/30 border border-border/30 rounded-lg flex items-center justify-between">
                            <span className="font-medium text-muted-foreground">{m.label}</span>
                            <span className={`font-mono font-bold ${
                              m.invert 
                                ? (m.val >= 4 ? "text-destructive" : m.val <= 2 ? "text-success" : "text-warning")
                                : (m.val >= 4 ? "text-success" : m.val <= 2 ? "text-destructive" : "text-warning")
                            }`}>
                              {m.val} / {m.max}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* AI recommendation preview */}
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
                          <Award className="h-4 w-4" />
                          Prescribed Recommendation
                        </div>
                        <h4 className="font-bold text-xs uppercase text-foreground">
                          {getRecommendation(selectedUser.score, selectedUser.checkInData).title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {getRecommendation(selectedUser.score, selectedUser.checkInData).description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border/40 rounded-xl bg-muted/10">
                      <Clock className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
                      Athlete has not completed daily check-in assessment today.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-muted-foreground space-y-3">
                  <UserIcon className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                  <p className="font-semibold">Select an athlete row from the directory to inspect biometric logs.</p>
                </div>
              )}
            </div>

            {/* Audit Logs Ticker */}
            <div className="glass-card rounded-2xl p-6 border border-border/50 space-y-4">
              <div className="flex items-center gap-2 text-primary border-b border-border/30 pb-3">
                <Terminal className="h-4 w-4" />
                <h3 className="font-serif text-title">System Audit Log</h3>
              </div>
              
              <div className="h-48 overflow-y-auto space-y-2 font-mono text-[10px] text-muted-foreground/90 scrollbar-thin">
                {adminLogs.map((log, index) => (
                  <div key={index} className="p-1.5 rounded hover:bg-muted/30 transition-colors">
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/40 py-6 bg-muted/20 mt-16 text-center text-xs text-muted-foreground">
        <p className="font-serif">ATHENAFIT Readiness Intelligence Platform © 2026. Coach Admin Console.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
