import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LogOut, 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Search, 
  Menu as MenuIcon, 
  Store,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const pageTitles = {
  dashboard: { title: 'Executive Overview', subtitle: 'Real-time performance, revenue, and active orders' },
  orders: { title: 'Orders & POS Terminal', subtitle: 'Live table orders, takeouts, and billing history' },
  tables: { title: 'Dining Floor Plan', subtitle: 'Table availability, section management, and seating' },
  kitchen: { title: 'Kitchen Display (KDS)', subtitle: 'Ticket queue, prep times, and fulfillment pipeline' },
  menu: { title: 'Menu & Recipes Catalog', subtitle: 'Item pricing, dietary flags, and catalog management' },
  inventory: { title: 'Stock & Inventory Control', subtitle: 'Raw ingredients, stock thresholds, and suppliers' },
  staff: { title: 'Staff & Team Directory', subtitle: 'Employee accounts, roles, and shift assignments' },
  settings: { title: 'Restaurant Configuration', subtitle: 'General preferences, taxes, receipts, and theme' },
};

const Navbar = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const pathKey = location.pathname.split('/')[1] || 'dashboard';
  const pageInfo = pageTitles[pathKey] || { title: pathKey.charAt(0).toUpperCase() + pathKey.slice(1), subtitle: 'Management portal' };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-white/80 dark:bg-[#231826]/80 backdrop-blur-md border-b border-[#EADFE8] dark:border-[#3D2C42] flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-[#242026] dark:text-[#F9F4F8] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33] transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon size={22} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-[#242026] dark:text-[#F9F4F8] tracking-tight leading-none">
              {pageInfo.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F9EAF5] dark:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] border border-[#EADFE8] dark:border-[#3D2C42]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Service Active
            </span>
          </div>
          <p className="hidden md:block text-xs text-[#817985] dark:text-[#B4A9B8] mt-0.5">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Live Clock Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF9F5] dark:bg-[#18111B] border border-[#EADFE8] dark:border-[#3D2C42] text-xs font-medium text-[#817985] dark:text-[#B4A9B8]">
          <Clock size={14} className="text-[#FF5A0A]" />
          <span>
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] transition-all"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-[#400849]" />}
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33] text-[#242026] dark:text-[#F9F4F8] relative transition-all"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5A0A] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] shadow-xl rounded-2xl">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#EADFE8] dark:border-[#3D2C42]">
              <span className="font-bold text-sm text-[#242026] dark:text-[#F9F4F8]">Live Alerts</span>
              <button 
                onClick={() => setUnreadNotifications(0)}
                className="text-[11px] text-[#FF5A0A] font-semibold hover:underline"
              >
                Mark all read
              </button>
            </div>
            <div className="py-2 space-y-1 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F9EAF5]/60 dark:bg-[#2E1E33]/60 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#FF5A0A]/15 text-[#FF5A0A] flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#242026] dark:text-[#F9F4F8]">Order ORD-1001 Preparing</p>
                  <p className="text-[11px] text-[#817985] dark:text-[#B4A9B8]">Table 2 · 2 items in kitchen</p>
                  <span className="text-[10px] text-[#817985] font-mono mt-1 block">5m ago</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl hover:bg-[#F9EAF5]/30 dark:hover:bg-[#2E1E33]/30 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#242026] dark:text-[#F9F4F8]">Low Stock Alert: Atlantic Salmon</p>
                  <p className="text-[11px] text-[#817985] dark:text-[#B4A9B8]">Current: 8 kg (Min: 10 kg)</p>
                  <span className="text-[10px] text-[#817985] font-mono mt-1 block">15m ago</span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-[#EADFE8] dark:bg-[#3D2C42]" />
            <Link to="/orders" className="block text-center py-1.5 text-xs font-semibold text-[#400849] dark:text-[#E7B0DE] hover:underline">
              View All Operations →
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33] border border-transparent hover:border-[#EADFE8] dark:hover:border-[#3D2C42] transition-all">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#400849] to-[#FF5A0A] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] leading-tight truncate max-w-[110px]">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-[10px] font-semibold text-[#FF5A0A] leading-none">
                  {user?.role || 'Staff'}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] shadow-xl rounded-2xl">
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8]">{user?.name}</p>
                <p className="text-[11px] text-[#817985] dark:text-[#B4A9B8] truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F9EAF5] dark:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] w-fit">
                  Role: {user?.role}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#EADFE8] dark:bg-[#3D2C42]" />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer text-xs font-medium py-2 rounded-lg text-[#242026] dark:text-[#F9F4F8]">
                <Store size={15} className="mr-2 text-[#400849] dark:text-[#E7B0DE]" /> Restaurant Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/staff" className="cursor-pointer text-xs font-medium py-2 rounded-lg text-[#242026] dark:text-[#F9F4F8]">
                <User size={15} className="mr-2 text-[#400849] dark:text-[#E7B0DE]" /> Team & Roles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#EADFE8] dark:bg-[#3D2C42]" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-xs font-semibold py-2 rounded-lg text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/30"
            >
              <LogOut size={15} className="mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
