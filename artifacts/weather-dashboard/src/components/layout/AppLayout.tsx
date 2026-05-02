import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Sidebar on the LEFT */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        <Header onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto pt-20 pb-14 bg-background/50">
          <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer
          className="fixed bottom-0 left-0 lg:left-64 right-0 h-14 z-20 flex items-center justify-between px-6 text-xs text-white/80 shadow-lg"
          style={{ background: "linear-gradient(90deg, #0c4a6e, #075985, #0e7490)" }}
        >
          <span className="hidden sm:block" />
          <span className="font-medium tracking-wide text-center flex-1">
            SQU Smart Weather Station Monitoring System © 2026 &nbsp;|&nbsp; Developed for environmental data monitoring
          </span>
          <span className="font-semibold text-cyan-200 whitespace-nowrap flex-shrink-0">
            iLab Marine
          </span>
        </footer>
      </div>
    </div>
  );
}
