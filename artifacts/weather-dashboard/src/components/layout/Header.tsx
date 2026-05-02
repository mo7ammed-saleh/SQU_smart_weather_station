import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Menu, LogOut } from "lucide-react";
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
    <header
      className="fixed top-0 left-0 lg:left-64 right-0 h-20 z-30 flex items-center justify-between px-4 lg:px-6 shadow-md animate-header-gradient"
      style={{
        background: "linear-gradient(135deg, #0c4a6e, #075985, #0e7490, #0369a1)",
      }}
    >
      {/* LEFT: SQU Logo */}
      <div className="flex items-center gap-2 w-40 flex-shrink-0">
        <img
          src="/squ-logo.png"
          alt="SQU"
          className="h-14 w-14 object-contain drop-shadow-md flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <span className="hidden xl:block text-xs text-white/70 leading-tight font-medium">Sultan Qaboos<br />University</span>
      </div>

      {/* CENTER: Title + status */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="font-bold text-xl text-white tracking-wide drop-shadow-sm leading-tight">
          Smart Weather Station
        </h1>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-xs text-white/70 font-medium uppercase tracking-widest">System Online</span>
        </div>
      </div>

      {/* RIGHT: Company logo + time + logout */}
      <div className="flex items-center gap-3 w-36 justify-end flex-shrink-0">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-mono font-semibold text-white">{format(time, "HH:mm:ss")}</span>
          <span className="text-xs text-white/60">{format(time, "dd MMM yyyy")}</span>
        </div>

        <img
          src="/company-logo.png"
          alt="iLab Marine"
          className="h-14 object-contain drop-shadow-md flex-shrink-0 hidden sm:block"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="hidden sm:flex gap-1.5 text-white/80 hover:text-white hover:bg-white/15 px-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-xs font-medium hidden lg:inline">Logout</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-white/15"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
