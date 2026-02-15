import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../features/dashboard/components/custom-sidebar';
import { Header } from './header';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex bg-dashboard-bg min-h-screen relative">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col">
        <Header />
        <main className="p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
