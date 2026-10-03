import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  UtensilsCrossed, 
  Users, 
  Settings, 
  Package,
  Table
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Manager'] },
    { name: 'Orders', path: '/orders', icon: ShoppingCart, roles: ['Admin', 'Manager', 'Waiter'] },
    { name: 'Kitchen', path: '/kitchen', icon: UtensilsCrossed, roles: ['Admin', 'Manager', 'Waiter'] },
    { name: 'Tables', path: '/tables', icon: Table, roles: ['Admin', 'Manager', 'Waiter'] },
    { name: 'Menu', path: '/menu', icon: UtensilsCrossed, roles: ['Admin', 'Manager'] },
    { name: 'Inventory', path: '/inventory', icon: Package, roles: ['Admin', 'Manager'] },
    { name: 'Staff', path: '/staff', icon: Users, roles: ['Admin'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin'] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(user?.role));

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <span className="text-xl font-bold flex items-center gap-2">
          <UtensilsCrossed size={24} /> RestaurantOS
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
