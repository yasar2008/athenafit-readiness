import { Activity, Bell, User, Menu, Sun, Moon, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useReadiness } from "@/hooks/useReadiness";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import QuickCheckIn from "@/components/dashboard/QuickCheckIn";
import AuthModal from "@/components/dashboard/AuthModal";
import UserControlPanel from "@/components/dashboard/UserControlPanel";

interface HeaderProps {
  onToggleAdmin?: () => void;
  isAdminOpen?: boolean;
}

const Header = ({ onToggleAdmin, isAdminOpen }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { theme, toggleTheme, currentUser, signOutUser } = useReadiness();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOutUser();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-border/40">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center shadow-glow transition-transform group-hover:scale-105">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base tracking-tight leading-none">ATHENAFIT</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5 font-bold">
              Readiness Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="font-serif text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Button>

          {/* Dialog trigger for QuickCheckIn inline */}
          <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="font-serif text-xs text-muted-foreground hover:text-foreground font-semibold"
              >
                Log Check-in
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-none">
              <QuickCheckIn onClose={() => setIsCheckInOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* Link to Admin Console */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
            className="font-serif text-xs font-semibold text-primary"
          >
            Coach Directory
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="font-serif text-xs text-muted-foreground hover:text-foreground font-semibold"
          >
            Landing Page
          </Button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Active User Indicator / Link to User Control Panel */}
          {currentUser && (
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {currentUser.name}
                  <Settings className="h-3 w-3 ml-0.5 opacity-70" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] p-0 bg-transparent border-none">
                <UserControlPanel onClose={() => setIsProfileOpen(false)} />
              </DialogContent>
            </Dialog>
          )}

          {/* Theme switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground h-9 w-9"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </Button>

          {/* Bell Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          </Button>
          
          {/* User Sign-In Trigger or Profile Settings Toggle */}
          {currentUser ? (
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-primary hover:bg-primary/10"
                  title="User Control Panel"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] p-0 bg-transparent border-none">
                <UserControlPanel onClose={() => setIsProfileOpen(false)} />
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="font-serif text-xs h-9 px-3 hover:bg-muted"
                >
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] p-0 bg-transparent border-none">
                <AuthModal onClose={() => setIsAuthOpen(false)} />
              </DialogContent>
            </Dialog>
          )}

          {currentUser && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="text-muted-foreground hover:text-destructive h-9 w-9"
              title="Log Out"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/50 py-4 bg-background">
          <nav className="container flex flex-col gap-2">
            <Button
              variant="ghost"
              className="justify-start font-serif font-semibold text-xs"
              onClick={() => {
                navigate("/dashboard");
                setIsMenuOpen(false);
              }}
            >
              Dashboard
            </Button>
            
            <Button
              variant="ghost"
              className="justify-start font-serif text-muted-foreground hover:text-foreground font-semibold text-xs"
              onClick={() => {
                setIsCheckInOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Log Check-in
            </Button>

            <Button
              variant="ghost"
              className="justify-start font-serif text-primary font-semibold text-xs"
              onClick={() => {
                navigate("/admin");
                setIsMenuOpen(false);
              }}
            >
              Coach Directory
            </Button>

            {currentUser && (
              <Button
                variant="ghost"
                className="justify-start font-serif text-primary font-semibold text-xs"
                onClick={() => {
                  setIsProfileOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                Settings Control Panel
              </Button>
            )}

            <Button
              variant="ghost"
              className="justify-start font-serif text-muted-foreground hover:text-foreground font-semibold text-xs"
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
            >
              Landing Page
            </Button>

            {currentUser ? (
              <Button
                variant="ghost"
                className="justify-start text-destructive hover:text-destructive font-serif font-semibold text-xs"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Log Out ({currentUser.name})
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="justify-start font-serif font-semibold text-xs"
                onClick={() => {
                  setIsAuthOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
