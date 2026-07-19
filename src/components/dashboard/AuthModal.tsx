import { useState } from "react";
import { useReadiness, UserProfile } from "@/hooks/useReadiness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Target, Dumbbell, ShieldAlert, Check } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal = ({ onClose }: AuthModalProps) => {
  const { signUpUser, signInUser } = useReadiness();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [focus, setFocus] = useState<UserProfile["focus"]>("Hybrid Athlete");
  const [goal, setGoal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (isSignUp) {
      if (!name || !goal) {
        toast.error("All registration fields are required");
        return;
      }
      signUpUser(name, email, focus, goal);
      toast.success(`Welcome, ${name}! Your profile is active.`);
      onClose();
    } else {
      const success = signInUser(email);
      if (success) {
        toast.success("Successfully logged in.");
        onClose();
      } else {
        toast.error("Email not found. Please click register to create a new profile.");
        setIsSignUp(true);
      }
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-background/95 w-full max-w-md slide-up">
      <div className="text-center mb-6">
        <h3 className="font-serif text-title text-primary uppercase tracking-wider">
          {isSignUp ? "Create Athlete Profile" : "Athlete Portal"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {isSignUp 
            ? "Configure your biomarkers and training goals" 
            : "Sign in using your registration email"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground">Full Name</Label>
            <div className="relative">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="pl-10 bg-muted/30 border-border/50 text-foreground text-xs"
              />
              <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold uppercase text-muted-foreground">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@athenafit.com"
              className="pl-10 bg-muted/30 border-border/50 text-foreground text-xs"
            />
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {isSignUp && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="focus" className="text-xs font-bold uppercase text-muted-foreground">Athletic Focus</Label>
              <div className="relative">
                <select
                  id="focus"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value as UserProfile["focus"])}
                  className="flex h-10 w-full rounded-md border border-border/50 bg-muted/30 px-10 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1"
                >
                  <option value="Hybrid Athlete" className="bg-card">Hybrid Athlete (Strength & Speed)</option>
                  <option value="Strength/Power" className="bg-card">Strength/Power (Lifting & Clean)</option>
                  <option value="Cardio Endurance" className="bg-card">Cardio Endurance (Running & VO2)</option>
                  <option value="Recovery/Mobility" className="bg-card">Recovery/Mobility (Yoga & Core)</option>
                </select>
                <Dumbbell className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="goal" className="text-xs font-bold uppercase text-muted-foreground">Primary Fitness Goal</Label>
              <div className="relative">
                <Input
                  id="goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Sub-20min 5K, 400lb Squat"
                  className="pl-10 bg-muted/30 border-border/50 text-foreground text-xs"
                />
                <Target className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </>
        )}

        <Button type="submit" variant="hero" className="w-full mt-2 font-serif text-sm uppercase tracking-wider py-5">
          {isSignUp ? "Register Profile" : "Access Console"}
        </Button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-border/30">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-primary hover:underline font-semibold font-serif"
        >
          {isSignUp 
            ? "Already have an account? Access Console" 
            : "First time here? Register Athlete Profile"
          }
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
