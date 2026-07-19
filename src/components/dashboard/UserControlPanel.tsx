import { useState } from "react";
import { useReadiness, UserProfile } from "@/hooks/useReadiness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Target, Dumbbell, ShieldAlert, Award, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface UserControlPanelProps {
  onClose: () => void;
}

const UserControlPanel = ({ onClose }: UserControlPanelProps) => {
  const { currentUser, signUpUser, resetCheckIn, signOutUser } = useReadiness();

  const [name, setName] = useState(currentUser?.name || "Guest Athlete");
  const [email, setEmail] = useState(currentUser?.email || "guest@athenafit.com");
  const [focus, setFocus] = useState<UserProfile["focus"]>(currentUser?.focus || "Hybrid Athlete");
  const [goal, setGoal] = useState(currentUser?.goal || "General Conditioning");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !goal) {
      toast.error("All profile fields are required");
      return;
    }

    signUpUser(name, email, focus, goal);
    toast.success("Athlete profile updated successfully.");
    onClose();
  };

  const handleResetLogs = () => {
    resetCheckIn();
    toast.success("Today's check-in metrics have been reset.");
    onClose();
  };

  const handleDeleteProfile = () => {
    signOutUser();
    toast.info("Athlete profile logged out.");
    onClose();
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-background/95 w-full max-w-md slide-up">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-serif text-title text-primary uppercase tracking-wider">
          User Control Panel
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your biometric profile and database records
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <Label htmlFor="name" className="text-[10px] font-bold uppercase text-muted-foreground">Athlete Name</Label>
          <div className="relative">
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-9 bg-muted/40 border-border/40 text-foreground text-xs"
            />
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email" className="text-[10px] font-bold uppercase text-muted-foreground">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={currentUser?.email === "guest@athenafit.com"}
              className="pl-9 bg-muted/40 border-border/40 text-foreground text-xs disabled:opacity-50"
            />
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
          </div>
        </div>

        {/* Focus */}
        <div className="space-y-1">
          <Label htmlFor="focus" className="text-[10px] font-bold uppercase text-muted-foreground">Athletic Discipline</Label>
          <div className="relative">
            <select
              id="focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value as UserProfile["focus"])}
              className="flex h-10 w-full rounded-md border border-border/40 bg-muted/40 px-9 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="Hybrid Athlete" className="bg-card">Hybrid Athlete (Strength & Speed)</option>
              <option value="Strength/Power" className="bg-card">Strength/Power (Lifting & Clean)</option>
              <option value="Cardio Endurance" className="bg-card">Cardio Endurance (Running & VO2)</option>
              <option value="Recovery/Mobility" className="bg-card">Recovery/Mobility (Yoga & Core)</option>
            </select>
            <Dumbbell className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-1">
          <Label htmlFor="goal" className="text-[10px] font-bold uppercase text-muted-foreground">Training Goal</Label>
          <div className="relative">
            <Input
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="pl-9 bg-muted/40 border-border/40 text-foreground text-xs"
            />
            <Target className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
          </div>
        </div>

        <Button type="submit" variant="hero" className="w-full mt-2 font-serif text-xs uppercase tracking-wider py-4">
          Save Settings
        </Button>
      </form>

      {/* Account Settings / Actions */}
      <div className="mt-6 pt-5 border-t border-border/30 space-y-2">
        <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Biometric Management</p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResetLogs}
            className="flex-1 text-xs border-warning/30 hover:bg-warning/10 text-warning flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Daily Log
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeleteProfile}
            className="flex-1 text-xs border-destructive/30 hover:bg-destructive/10 text-destructive flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Logout Athlete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserControlPanel;
