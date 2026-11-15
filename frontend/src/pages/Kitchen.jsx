import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  ChefHat, 
  RefreshCw, 
  Bell, 
  Volume2, 
  VolumeX,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Active'); // 'Active' or 'Ready'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchActiveOrders();
    const pollTimer = setInterval(fetchActiveOrders, 8000); // Poll every 8s
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(pollTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      const allOrders = data.data || [];
      // Active in kitchen: Confirmed, Preparing, Ready
      const active = allOrders.filter(o => ['Confirmed', 'Preparing', 'Ready'].includes(o.status));
      setOrders(active);
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      // Optimistic update
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
      await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${id}/status`, { status: newStatus });
      toast.success(`Ticket marked as ${newStatus}`);
      fetchActiveOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update kitchen ticket');
    }
  };

  const getElapsedTimeMinutes = (createdAt) => {
    const diffMs = currentTime - new Date(createdAt);
    return Math.floor(diffMs / 60000);
  };

  const filteredOrders = filter === 'Ready' 
    ? orders.filter(o => o.status === 'Ready')
    : orders;

  const preparingCount = orders.filter(o => o.status === 'Preparing').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;
  const newCount = orders.filter(o => o.status === 'Confirmed').length;

  return (
    <div className="bg-[#18111B] text-white min-h-[calc(100vh-5rem)] -m-4 md:-m-8 p-6 md:p-8 space-y-6">
      {/* Top KDS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3D2C42] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5A0A] to-[#E7B0DE] flex items-center justify-center text-white shadow-lg shadow-[#FF5A0A]/30">
              <ChefHat size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Kitchen Display System (KDS)
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </h2>
              <p className="text-xs text-[#B4A9B8]">
                Station Queue & Prep Timeline Sync
              </p>
            </div>
          </div>
        </div>

        {/* Live Metrics & Actions */}
        <div className="flex items-center gap-3">
          {/* Status Counts */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/50 text-[#E7B0DE]">
              {newCount} New Tickets
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400">
              {preparingCount} On Range
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
              {readyCount} Ready to Serve
            </span>
          </div>

          {/* Clock Display */}
          <div className="px-3.5 py-1.5 rounded-xl bg-[#231826] border border-[#3D2C42] text-xs font-mono font-bold text-white flex items-center gap-2">
            <Clock size={14} className="text-[#FF5A0A]" />
            {currentTime.toLocaleTimeString()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchActiveOrders}
            className="rounded-xl border-[#3D2C42] bg-[#231826] text-white hover:bg-[#2E1E33] h-9"
          >
            <RefreshCw size={14} className="mr-1.5" /> Sync
          </Button>
        </div>
      </div>

      {/* Ticket Board Grid */}
      {loading ? (
        <div className="p-16 text-center text-[#B4A9B8]">Connecting to Kitchen Brigade...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-20 text-center bg-[#231826] rounded-3xl border border-[#3D2C42] max-w-xl mx-auto my-12">
          <ChefHat size={48} className="mx-auto mb-3 text-[#FF5A0A] opacity-40" />
          <h3 className="text-lg font-bold text-white">All Kitchen Tickets Cleared!</h3>
          <p className="text-xs text-[#B4A9B8] mt-1">New table orders placed from the POS terminal will appear here instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredOrders.map(order => {
            const elapsed = getElapsedTimeMinutes(order.createdAt);
            const isLate = elapsed >= 15;
            const isPreparing = order.status === 'Preparing';
            const isReady = order.status === 'Ready';

            return (
              <div 
                key={order._id}
                className={`rounded-2xl flex flex-col justify-between border-2 transition-all shadow-xl overflow-hidden ${
                  isReady
                    ? 'border-emerald-500 bg-[#1D2B22]'
                    : isPreparing
                    ? 'border-[#FF5A0A] bg-[#2A171D]'
                    : isLate
                    ? 'border-amber-500 bg-[#2B2117] animate-pulse'
                    : 'border-[#3D2C42] bg-[#231826]'
                }`}
              >
                {/* Ticket Top Header */}
                <div className={`p-4 flex items-center justify-between border-b ${
                  isReady 
                    ? 'bg-emerald-600 text-white' 
                    : isPreparing
                    ? 'bg-[#FF5A0A] text-white'
                    : 'bg-[#2E1E33] text-white border-[#3D2C42]'
                }`}>
                  <div>
                    <span className="text-base font-black tracking-tight">{order.orderId}</span>
                    <span className="block text-xs font-bold opacity-90">
                      Table #{order.table?.tableNumber || 'Takeout'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
                      isLate ? 'bg-red-900 text-red-200' : 'bg-black/30 text-white'
                    }`}>
                      <Clock size={12} /> {elapsed}m elapsed
                    </span>
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-90 mt-0.5">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 flex-1 space-y-3 max-h-[320px] overflow-y-auto">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="pb-3 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="flex items-start gap-2.5">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-black shrink-0 ${
                          isReady ? 'bg-emerald-900 text-emerald-200' : 'bg-[#FF5A0A]/20 text-[#FF5A0A]'
                        }`}>
                          {item.quantity}x
                        </span>
                        <div className="flex-1">
                          <p className="font-extrabold text-sm text-white leading-tight">
                            {item.name}
                          </p>
                          {item.specialInstructions && (
                            <div className="mt-1 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1">
                              <AlertCircle size={12} className="shrink-0" />
                              <span>{item.specialInstructions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Action Button */}
                <div className="p-3 bg-black/40 border-t border-white/10">
                  {order.status === 'Confirmed' && (
                    <Button
                      onClick={() => updateStatus(order._id, 'Preparing')}
                      className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-black text-sm shadow-md"
                    >
                      <Flame size={16} className="mr-1.5" /> Start Cooking
                    </Button>
                  )}

                  {order.status === 'Preparing' && (
                    <Button
                      onClick={() => updateStatus(order._id, 'Ready')}
                      className="w-full h-11 rounded-xl bg-[#FF5A0A] hover:bg-[#e04e06] text-white font-black text-sm shadow-md"
                    >
                      <CheckCircle2 size={16} className="mr-1.5" /> Mark Ready for Server
                    </Button>
                  )}

                  {order.status === 'Ready' && (
                    <Button
                      onClick={() => updateStatus(order._id, 'Completed')}
                      className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md"
                    >
                      <CheckCircle2 size={16} className="mr-1.5" /> Complete & Clear
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Kitchen;
