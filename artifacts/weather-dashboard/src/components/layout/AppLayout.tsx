import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row-reverse overflow-hidden font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        <Header onMenuClick={() => setMobileOpen(true)} />
        
        <main className="flex-1 overflow-y-auto pt-16 pb-16 lg:pb-12 bg-background/50">
          <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 lg:right-64 h-12 bg-white/80 backdrop-blur-md border-t border-border flex items-center justify-center text-xs text-muted-foreground z-20">
          SQU Weather Station Monitoring System © 2026 | Developed for environmental data monitoring
        </footer>
      </div>
    </div>
  );
}
