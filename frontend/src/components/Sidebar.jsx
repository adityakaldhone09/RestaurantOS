import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  Users, 
  Settings, 
  Package,
  Table as TableIcon,
  ChefHat,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const Sidebar = ({ collapsed, setCollapsed, mobileClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager'] },
    { name: 'POS & Orders', path: '/orders', icon: ShoppingBag, roles: ['Admin', 'Manager', 'Waiter'], badge: 'Live' },
    { name: 'Dining Tables', path: '/tables', icon: TableIcon, roles: ['Admin', 'Manager', 'Waiter'] },
    { name: 'Kitchen KDS', path: '/kitchen', icon: ChefHat, roles: ['Admin', 'Manager', 'Waiter'], badgeColor: 'bg-[#FF5A0A]' },
    { name: 'Menu Catalog', path: '/menu', icon: UtensilsCrossed, roles: ['Admin', 'Manager'] },
    { name: 'Inventory', path: '/inventory', icon: Package, roles: ['Admin', 'Manager'] },
    { name: 'Staff & Team', path: '/staff', icon: Users, roles: ['Admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin'] },
  ];

  const filteredLinks = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <TooltipProvider delayDuration={150}>
      <aside 
        className={`h-screen flex flex-col bg-[#400849] text-[#F9EAF5] border-r border-[#52155D] dark:bg-[#130C15] dark:border-[#2B1930] transition-all duration-300 relative z-30 select-none ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#52155D] dark:border-[#2B1930]">
          {!collapsed ? (
            <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-white group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5A0A] to-[#E7B0DE] flex items-center justify-center text-white shadow-md shadow-[#FF5A0A]/20 transition-transform group-hover:scale-105">
                <UtensilsCrossed size={22} className="stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-[17px] leading-tight flex items-center gap-1.5">
                  Restaurant<span className="text-[#FF5A0A]">OS</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#E7B0DE]/70">
                  Hospitality Suite
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/dashboard" className="mx-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5A0A] to-[#E7B0DE] flex items-center justify-center text-white shadow-md shadow-[#FF5A0A]/20">
                <UtensilsCrossed size={22} className="stroke-[2.2]" />
              </div>
            </Link>
          )}

          {/* Collapse Toggle Button (Desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-[#E7B0DE]/70 hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Quick Action: New Order */}
        <div className="px-3 pt-4 pb-2">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/orders/new" onClick={mobileClose}>
                  <button className="w-full h-11 rounded-xl bg-[#FF5A0A] hover:bg-[#e04e06] text-white flex items-center justify-center shadow-lg shadow-[#FF5A0A]/25 transition-all hover:scale-105 active:scale-95">
                    <PlusCircle size={20} />
                  </button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">New Order</TooltipContent>
            </Tooltip>
          ) : (
            <Link to="/orders/new" onClick={mobileClose}>
              <button className="w-full h-11 px-4 rounded-xl bg-[#FF5A0A] hover:bg-[#e04e06] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A0A]/25 transition-all hover:shadow-[#FF5A0A]/40 active:scale-[0.98]">
                <PlusCircle size={18} />
                <span>Create New Order</span>
              </button>
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
          {filteredLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            const linkContent = (
              <Link
                to={item.path}
                onClick={mobileClose}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-white/15 to-white/5 text-white font-semibold shadow-sm'
                    : 'text-[#E7B0DE]/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-[#FF5A0A]" />
                )}

                <Icon 
                  size={20} 
                  className={`transition-colors shrink-0 ${
                    isActive ? 'text-[#FF5A0A]' : 'text-[#E7B0DE]/70 group-hover:text-white'
                  }`} 
                />

                {!collapsed && (
                  <span className="flex-1 truncate tracking-tight">{item.name}</span>
                )}

                {!collapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider ${item.badgeColor || 'bg-white/20'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <div>{linkContent}</div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-semibold">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.name}>{linkContent}</div>;
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-[#52155D] dark:border-[#2B1930] bg-[#33063A]/50 dark:bg-[#0E0810]/50">
          {!collapsed ? (
            <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E7B0DE] to-[#FF5A0A] text-[#400849] font-black text-sm flex items-center justify-center shrink-0 shadow-inner">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate leading-tight">{user?.name || 'Aditya Admin'}</p>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#E7B0DE] bg-[#E7B0DE]/15 px-1.5 py-0.2 rounded">
                    {user?.role || 'Admin'}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-8 h-8 rounded-lg text-[#E7B0DE]/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 text-[#E7B0DE] hover:text-white flex items-center justify-center transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign out ({user?.name})</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default Sidebar;
