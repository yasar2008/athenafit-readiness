import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ShieldCheck, CreditCard, Users, Briefcase, FileText, 
  Mail, MessageSquare, Send, CheckCircle2, ChevronRight 
} from "lucide-react";
import { toast } from "sonner";

interface FooterDialogsProps {
  type: string | null;
  onClose: () => void;
}

const FooterDialogs = ({ type, onClose }: FooterDialogsProps) => {
  // Support Form State
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportDesc, setSupportDesc] = useState("");

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportEmail || !supportDesc) {
      toast.error("Please fill in all support details.");
      return;
    }
    toast.success("Support ticket submitted! Our coach team will contact you shortly.");
    onClose();
  };

  const handleApplyJob = (jobTitle: string) => {
    toast.success(`Application for '${jobTitle}' submitted!`);
    onClose();
  };

  if (!type) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-primary/20 bg-background/95 w-full max-w-lg slide-up max-h-[85vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="font-serif text-title text-primary uppercase tracking-wider">
          ATHENAFIT | {type}
        </h3>
        <div className="h-px bg-border/40 my-3 w-16 mx-auto" />
      </div>

      {/* PRICING SHEET */}
      {type === "Pricing" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground text-center mb-4">
            Select the biometric plan built for your athletic performance.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Free Tier */}
            <div className="p-4 border border-border/50 rounded-xl bg-muted/20 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase text-muted-foreground">Free Athlete</h4>
                <p className="font-serif text-2xl font-bold mt-1 text-foreground">$0</p>
                <ul className="text-[10px] text-muted-foreground mt-3 space-y-1.5">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" /> Daily Readiness Score</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" /> Basic Training Advice</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-success" /> 7-Day History Chart</li>
                </ul>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-4 text-[10px]" onClick={onClose}>Active</Button>
            </div>
            
            {/* Pro Tier */}
            <div className="p-4 border border-primary/30 rounded-xl bg-primary/5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] uppercase font-bold px-2 py-0.5 rounded-bl">
                Popular
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-primary">Performance Pro</h4>
                <p className="font-serif text-2xl font-bold mt-1 text-foreground">$9 <span className="text-[10px] text-muted-foreground">/mo</span></p>
                <ul className="text-[10px] text-muted-foreground mt-3 space-y-1.5">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-primary" /> Advanced HRV Analytics</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-primary" /> Dynamic Simulation Sandbox</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-primary" /> Custom AI Workouts</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-primary" /> Unlimited History Sync</li>
                </ul>
              </div>
              <Button size="sm" variant="hero" className="w-full mt-4 text-[10px]" onClick={() => { toast.success("Subscribed to Pro Tier!"); onClose(); }}>Upgrade</Button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY SHEET */}
      {type === "Security" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 justify-center text-success">
            <ShieldCheck className="h-6 w-6" />
            <h4 className="font-bold text-sm uppercase tracking-wide">Military Grade Cryptography</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            Your physiological biometrics are private. We employ end-to-end security measures.
          </p>
          <div className="space-y-3 mt-4 text-xs">
            <div className="p-3 bg-muted/30 border border-border/40 rounded-lg">
              <strong className="text-foreground block uppercase text-[10px] tracking-wide">1. HIPAA Compliant Storage</strong>
              <span className="text-muted-foreground text-[11px] mt-0.5 block">Health metrics (sleep quality, HRV logs, stress ratings) are locked behind isolated, HIPAA-certified servers.</span>
            </div>
            <div className="p-3 bg-muted/30 border border-border/40 rounded-lg">
              <strong className="text-foreground block uppercase text-[10px] tracking-wide">2. Absolute Data Ownership</strong>
              <span className="text-muted-foreground text-[11px] mt-0.5 block">We will never sell or monetize your fitness records. You retain full control, and can delete your profile at any time.</span>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT & CONTACT */}
      {(type === "Contact" || type === "Support") && (
        <form onSubmit={handleSupportSubmit} className="space-y-4">
          <p className="text-xs text-muted-foreground text-center mb-2">
            Submit a support ticket. Our coaches reply within 4 hours.
          </p>
          <div className="space-y-1">
            <Label htmlFor="sName" className="text-[10px] font-bold uppercase text-muted-foreground">Your Name</Label>
            <Input 
              id="sName" 
              value={supportName} 
              onChange={(e) => setSupportName(e.target.value)} 
              placeholder="Alex Rivera"
              className="bg-muted/40 border-border/40 text-foreground text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="sEmail" className="text-[10px] font-bold uppercase text-muted-foreground">Email Address</Label>
            <Input 
              id="sEmail" 
              type="email"
              value={supportEmail} 
              onChange={(e) => setSupportEmail(e.target.value)} 
              placeholder="alex@athenafit.com"
              className="bg-muted/40 border-border/40 text-foreground text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="sDesc" className="text-[10px] font-bold uppercase text-muted-foreground">Issue Details</Label>
            <Textarea 
              id="sDesc" 
              value={supportDesc} 
              onChange={(e) => setSupportDesc(e.target.value)} 
              placeholder="Explain what is going on..."
              rows={4}
              className="bg-muted/40 border-border/40 text-foreground text-xs"
            />
          </div>
          <Button type="submit" variant="hero" className="w-full text-xs uppercase tracking-wider py-4 mt-2">
            Submit Ticket
          </Button>
        </form>
      )}

      {/* CAREERS SHEET */}
      {type === "Careers" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground text-center mb-2">
            Join the biometric revolution. Help us write exercises of the future.
          </p>
          <div className="space-y-3">
            {[
              { title: "Lead Exercise Physiologist", type: "Full-Time | Hybrid", desc: "Formulate readiness algorithm coefficients and strain thresholds." },
              { title: "Senior React Native Engineer", type: "Full-Time | Remote", desc: "Build out the mobile biometric syncing app (iOS & Android)." },
              { title: "Bio-Data Researcher", type: "Contract | Remote", desc: "Analyze raw HRV and sleep data sets to optimize training models." }
            ].map((job) => (
              <div key={job.title} className="p-3 border border-border/50 rounded-lg hover:border-primary/40 transition-colors flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wide">{job.title}</h4>
                  <span className="text-[9px] font-bold text-primary block mt-0.5">{job.type}</span>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{job.desc}</p>
                </div>
                <Button size="sm" variant="outline" className="text-[10px] shrink-0" onClick={() => handleApplyJob(job.title)}>Apply</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAREERS / DOCUMENTATION / BLOG FALLBACKS */}
      {["Documentation", "Research", "Blog", "Press", "About", "Privacy", "Terms", "Cookies"].includes(type || "") && (
        <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
          <div className="p-4 bg-muted/30 border border-border/40 rounded-lg text-center font-mono">
            <p className="font-semibold text-foreground uppercase text-[10px] tracking-widest mb-1">
              File: {type?.toLowerCase()}.md
            </p>
            <p className="text-[10px]">Biometric Platform Node - Rev 1.04</p>
          </div>
          <p>
            This section contains active guidelines and specifications for **ATHENAFIT**. Our engineering team updates these publications dynamically to remain in lockstep with the latest peer-reviewed fitness science and security architectures.
          </p>
          <p>
            For further technical briefs, raw API schemas, or licensing disclosures, contact our engineering support desk.
          </p>
          <Button variant="outline" size="sm" className="w-full text-xs font-serif" onClick={onClose}>
            Acknowledge Document
          </Button>
        </div>
      )}
    </div>
  );
};

export default FooterDialogs;
