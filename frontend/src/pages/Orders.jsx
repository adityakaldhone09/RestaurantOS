import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2, 
  ShoppingBag, 
  Receipt,
  FileText,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { toast } from 'sonner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders history');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
      await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${id}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
      fetchOrders();
    }
  };

  const statusFilters = ['All', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(order.table?.tableNumber || '').includes(searchQuery) ||
      order.items?.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge className="bg-purple-100 dark:bg-purple-950/50 text-[#400849] dark:text-[#E7B0DE] border-purple-200">Confirmed</Badge>;
      case 'Preparing':
        return <Badge className="bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200">Preparing</Badge>;
      case 'Ready':
        return <Badge className="bg-[#FF5A0A]/15 text-[#FF5A0A] border-[#FF5A0A]/30">Ready</Badge>;
      case 'Completed':
        return <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200">Completed</Badge>;
      case 'Cancelled':
        return <Badge className="bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalBilled = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeCount = orders.filter(o => ['Confirmed', 'Preparing', 'Ready'].includes(o.status)).length;
  const completedCount = orders.filter(o => o.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242026] dark:text-[#F9F4F8]">
            Orders & POS Ledger
          </h2>
          <p className="text-sm text-[#817985] dark:text-[#B4A9B8] mt-1">
            Complete real-time order history, kitchen statuses, and digital bill management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchOrders} 
            className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826]"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link to="/orders/new">
            <Button className="rounded-xl bg-[#FF5A0A] hover:bg-[#e04e06] text-white font-bold shadow-md shadow-[#FF5A0A]/20">
              <Plus size={18} className="mr-2" />
              New Order
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#231826] border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">Active In Service</p>
            <p className="text-2xl font-black text-[#FF5A0A] mt-1">{activeCount} Tickets</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF5A0A]/10 text-[#FF5A0A] flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#231826] border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">Completed Orders</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{completedCount} Orders</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#231826] border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">Total Recorded Value</p>
            <p className="text-2xl font-black text-[#400849] dark:text-[#E7B0DE] mt-1">${totalBilled.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F9EAF5] dark:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] flex items-center justify-center">
            <Receipt size={20} />
          </div>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#231826] rounded-2xl border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#817985]" />
          <Input
            placeholder="Search by Order ID (ORD-1001), Table, or Dish..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {statusFilters.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-[#400849] text-white shadow-sm'
                  : 'text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Card */}
      <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F5] dark:bg-[#18111B] text-[#817985] dark:text-[#B4A9B8] border-b border-[#EADFE8] dark:border-[#3D2C42] uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Order Ref</th>
                  <th className="px-6 py-4">Table</th>
                  <th className="px-6 py-4">Items Summary</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Lifecycle Status</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFE8] dark:divide-[#3D2C42]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#817985]">
                      Loading orders data...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-[#817985]">
                      No orders matched your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr 
                      key={order._id}
                      className="hover:bg-[#FFF9F5] dark:hover:bg-[#18111B]/60 transition-colors"
                    >
                      <td className="px-6 py-4 font-extrabold text-[#400849] dark:text-[#E7B0DE]">
                        <Link to={`/orders/${order._id}`} className="hover:underline flex items-center gap-1.5">
                          <FileText size={14} className="text-[#FF5A0A]" />
                          {order.orderId}
                        </Link>
                      </td>

                      <td className="px-6 py-4 font-bold text-[#242026] dark:text-[#F9F4F8]">
                        <span className="px-2 py-0.5 rounded-lg bg-[#F9EAF5] dark:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] border border-[#EADFE8] dark:border-[#3D2C42]">
                          Table #{order.table?.tableNumber || 'Takeout'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[#817985] dark:text-[#B4A9B8] max-w-xs truncate">
                        {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') || 'No items'}
                      </td>

                      <td className="px-6 py-4 font-black text-sm text-[#242026] dark:text-[#F9F4F8]">
                        ${order.total?.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="px-6 py-4 text-[#817985] dark:text-[#B4A9B8] font-mono text-[11px]">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/orders/${order._id}`)}
                            className="h-8 px-2.5 rounded-lg border-[#EADFE8] dark:border-[#3D2C42] text-xs font-semibold"
                          >
                            <Eye size={13} className="mr-1" /> View
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="w-8 h-8 rounded-lg hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33] text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8] flex items-center justify-center transition-colors">
                                <MoreVertical size={15} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] rounded-xl shadow-lg">
                              <DropdownMenuLabel className="text-xs font-bold text-[#817985]">Fast Status Update</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'Preparing')} className="cursor-pointer text-xs">
                                Set Preparing
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'Ready')} className="cursor-pointer text-xs">
                                Set Ready
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'Completed')} className="cursor-pointer text-xs text-emerald-600 font-semibold">
                                Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-[#EADFE8] dark:bg-[#3D2C42]" />
                              <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'Cancelled')} className="cursor-pointer text-xs text-rose-600">
                                Cancel Ticket
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
