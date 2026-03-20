import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../features/dashboard/components/custom-sidebar';
import { Header } from './header';
import { useIsMobile } from '../hooks/use-mobile';
import { cn } from 'ui-components';

export const MainLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-background min-h-screen relative overflow-x-hidden font-sans selection:bg-primary/30 dark:bg-[#030303] transition-all duration-700">
      {/* Background Starfield Decorator */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar - Ahora flotante y cristalino */}
      <div className="relative z-50">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-500 relative z-10",
        !isMobile ? "ml-72" : "ml-0"
      )}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="container-app py-10 md:py-16 flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Outlet />
        </main>

        <footer className="py-10 text-center opacity-20 pointer-events-none">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground">KuinTwin Admin Experience — 2026</p>
        </footer>
      </div>


      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
