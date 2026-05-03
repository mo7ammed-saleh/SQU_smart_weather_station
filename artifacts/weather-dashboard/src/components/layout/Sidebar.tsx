import { Link, useLocation } from "wouter";
import { Cloud, Sun, Wind, Home, X, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const SENSORS = [
  { id: "aqt560", name: "AQT560 Air Quality", icon: Cloud },
  { id: "ws500", name: "WS500 Weather", icon: Wind },
  { id: "smp10", name: "SMP10 Pyranometer", icon: Sun },
  { id: "dr30", name: "DR30 Pyrheliometer", icon: Sun },
];

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (o: boolean) => void }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home Dashboard", icon: Home },
    ...SENSORS.map((s) => ({ href: `/sensors/${s.id}`, label: s.name, icon: s.icon })),
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col
          transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:flex flex-shrink-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div
          className="flex h-20 items-center justify-between px-4 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #0c4a6e, #0e7490)" }}
        >
          <div className="flex-1 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wide uppercase">Navigation</span>
          </div>
          <Button
            variant="ghost" size="icon"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white/80 hover:text-white hover:bg-white/15 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150
                    ${isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/75"
                    }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70
              hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
