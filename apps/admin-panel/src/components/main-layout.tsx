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
    <div className="flex bg-background min-h-screen relative overflow-x-hidden font-sans selection:bg-primary/30">
      {/* Sidebar - Overlay logic for mobile */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        !isMobile ? "ml-72" : "ml-0"
      )}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8 lg:p-10 flex-1 w-full max-w-[1600px] mx-auto animate-in fade-in duration-500">
          <Outlet />
        </main>
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
