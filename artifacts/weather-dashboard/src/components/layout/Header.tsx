import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Menu, LogOut, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [time, setTime] = useState(new Date());
  const { logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 lg:right-64 h-16 bg-white border-b border-border z-30 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <Activity className="h-6 w-6" />
        </div>
        <div className="hidden sm:block">
          <h1 className="font-semibold text-lg text-foreground leading-tight">SQU Weather Station</h1>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">System Online</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-mono font-medium text-foreground">{format(time, "HH:mm:ss")}</span>
          <span className="text-xs text-muted-foreground">{format(time, "MMM dd, yyyy")}</span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={logout} className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
          <span className="font-medium text-sm">Logout</span>
        </Button>

        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
