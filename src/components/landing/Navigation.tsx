import { useState } from "react";
import { Menu, X, ArrowRight, Sun, Moon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReadiness } from "@/hooks/useReadiness";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthModal from "@/components/dashboard/AuthModal";
import UserControlPanel from "@/components/dashboard/UserControlPanel";

interface NavigationProps {
  onStartAssessment?: () => void;
}

const Navigation = ({ onStartAssessment }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { theme, toggleTheme, hasCheckedIn, currentUser, signOutUser } = useReadiness();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (hasCheckedIn) {
      navigate("/dashboard");
    } else if (onStartAssessment) {
      onStartAssessment();
    }
  };

  const handleScroll = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-serif text-xl tracking-tight font-semibold hover:opacity-80 transition-opacity">
            ATHENAFIT
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleScroll("platform")}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300 line-reveal"
          >
            Platform
          </button>
          <button
            onClick={() => handleScroll("science")}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300 line-reveal"
          >
            Science
          </button>
          <button
            onClick={() => handleScroll("insights")}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-300 line-reveal"
          >
            Insights
          </button>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Switcher */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="text-muted-foreground hover:text-foreground h-9 w-9"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </Button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                    Hi, {currentUser.name.split(" ")[0]}
                    <Settings className="h-3 w-3 opacity-70" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[450px] p-0 bg-transparent border-none">
                  <UserControlPanel onClose={() => setIsProfileOpen(false)} />
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm" onClick={signOutUser} className="font-serif text-xs text-muted-foreground hover:text-destructive">
                Sign Out
              </Button>
            </div>
          ) : (
            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="font-serif text-xs font-semibold">
                  Sign in
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] p-0 bg-transparent border-none">
                <AuthModal onClose={() => setIsAuthOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
          
          <Button size="sm" onClick={handleCTA} className="font-serif">
            {hasCheckedIn ? "Go to Dashboard" : "Get Started"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="text-muted-foreground hover:text-foreground h-9 w-9"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container py-6 space-y-4">
            <button
              onClick={() => handleScroll("platform")}
              className="block text-left w-full text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Platform
            </button>
            <button
              onClick={() => handleScroll("science")}
              className="block text-left w-full text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Science
            </button>
            <button
              onClick={() => handleScroll("insights")}
              className="block text-left w-full text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Insights
            </button>

            <div className="pt-4 space-y-3">
              {currentUser ? (
                <>
                  <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                    <DialogTrigger asChild>
                      <button className="text-xs font-semibold text-primary block w-full text-left">
                        Settings ({currentUser.name})
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px] p-0 bg-transparent border-none">
                      <UserControlPanel onClose={() => setIsProfileOpen(false)} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="w-full font-serif text-xs text-destructive" onClick={signOutUser}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full font-serif text-xs">
                      Sign in
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[450px] p-0 bg-transparent border-none">
                    <AuthModal onClose={() => setIsAuthOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
              <Button onClick={handleCTA} className="w-full font-serif text-xs">
                {hasCheckedIn ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
