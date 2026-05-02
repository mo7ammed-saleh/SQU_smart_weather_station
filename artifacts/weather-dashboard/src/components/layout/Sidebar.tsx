import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Activity, Home, Menu, LogOut, X, Cloud, Droplets, Sun, Wind } from "lucide-react";
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

  const navItems = [
    { href: "/", label: "Home Dashboard", icon: Home },
    ...SENSORS.map((s) => ({
      href: `/sensors/${s.id}`,
      label: s.name,
      icon: s.icon,
    })),
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`fixed top-0 right-0 z-50 h-screen w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out lg:static lg:block ${mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-16 items-center justify-between px-4 lg:hidden">
          <span className="font-semibold text-lg">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="text-sidebar-foreground hover:bg-sidebar-accent">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2 mt-4 lg:mt-16">
          <div className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-4 px-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"}`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
