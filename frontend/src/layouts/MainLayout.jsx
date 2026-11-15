import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Sheet, SheetContent } from '../components/ui/sheet';

const MainLayout = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FFF9F5] dark:bg-[#18111B] text-[#242026] dark:text-[#F9F4F8] transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
        />
      </div>

      {/* Mobile Drawer (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-[#400849] dark:bg-[#130C15] border-r border-[#52155D] dark:border-[#2B1930]">
          <Sidebar 
            collapsed={false} 
            setCollapsed={() => {}} 
            mobileClose={() => setMobileOpen(false)} 
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Navbar onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 bg-[#FFF9F5] dark:bg-[#18111B] transition-colors">
          <div className="max-w-7xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
