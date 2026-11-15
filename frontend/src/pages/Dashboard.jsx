import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  DollarSign, 
  UtensilsCrossed, 
  Table as TableIcon,
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  PlusCircle, 
  ChefHat, 
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Package,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, tablesRes, invRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/orders`).catch(() => ({ data: { data: [] } })),
        axios.get(`${import.meta.env.VITE_API_URL}/tables`).catch(() => ({ data: { data: [] } })),
        axios.get(`${import.meta.env.VITE_API_URL}/inventory`).catch(() => ({ data: { data: [] } }))
      ]);

      setOrders(ordersRes.data?.data || []);
      setTables(tablesRes.data?.data || []);
      setInventory(invRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Computations
  const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const activeOrders = orders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'Completed');
  const occupiedTables = tables.filter(t => t.status === 'Occupied').length;
  const totalTables = tables.length || 10;
  const occupancyRate = Math.round((occupiedTables / totalTables) * 100);
  const lowStockItems = inventory.filter(i => i.currentQuantity <= i.minimumStockLevel);

  // Chart Data: Hourly or Daily Trends
  const salesChartData = [
    { time: '11 AM', sales: 45, orders: 3 },
    { time: '1 PM', sales: 120, orders: 7 },
    { time: '3 PM', sales: 65, orders: 4 },
    { time: '5 PM', sales: 160, orders: 9 },
    { time: '7 PM', sales: 290, orders: 15 },
    { time: '9 PM', sales: 210, orders: 11 },
    { time: '10 PM', sales: 85, orders: 5 },
  ];

  const categoryDistribution = [
    { name: 'Main Course', value: 48, color: '#400849' },
    { name: 'Appetizers', value: 24, color: '#FF5A0A' },
    { name: 'Beverages', value: 18, color: '#E7B0DE' },
    { name: 'Desserts', value: 10, color: '#9333EA' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Preparing':
        return <Badge className="bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200">Preparing</Badge>;
      case 'Ready':
        return <Badge className="bg-[#FF5A0A]/15 text-[#FF5A0A] border-[#FF5A0A]/30">Ready</Badge>;
      case 'Completed':
        return <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200">Completed</Badge>;
      case 'Confirmed':
        return <Badge className="bg-purple-100 dark:bg-purple-950/50 text-[#400849] dark:text-[#E7B0DE] border-purple-200">Confirmed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242026] dark:text-[#F9F4F8]">
            Operations Executive Deck
          </h2>
          <p className="text-sm text-[#817985] dark:text-[#B4A9B8] mt-1">
            Real-time live telemetry for revenue, table seating, and kitchen speed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/orders/new">
            <Button className="rounded-xl bg-[#FF5A0A] hover:bg-[#e04e06] text-white font-bold shadow-md shadow-[#FF5A0A]/20 transition-all">
              <PlusCircle size={18} className="mr-2" />
              New Table Order
            </Button>
          </Link>

          <Link to="/kitchen">
            <Button variant="outline" className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] font-semibold">
              <ChefHat size={18} className="mr-2 text-[#FF5A0A]" />
              KDS Screen
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Gross Sales */}
        <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">
                Gross Revenue
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#F9EAF5] dark:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] flex items-center justify-center">
                <DollarSign size={20} className="stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-3xl font-black text-[#242026] dark:text-[#F9F4F8] tracking-tight">
                ${totalSales.toFixed(2)}
              </p>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <TrendingUp size={13} className="mr-1" /> +14.2%
              </span>
            </div>
            <p className="text-xs text-[#817985] dark:text-[#B4A9B8] mt-2">
              Based on today's active & closed tickets
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total Orders */}
        <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">
                Total Orders
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#FF5A0A]/10 text-[#FF5A0A] flex items-center justify-center">
                <ShoppingBag size={20} className="stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-3xl font-black text-[#242026] dark:text-[#F9F4F8] tracking-tight">
                {orders.length}
              </p>
              <span className="text-xs font-semibold text-[#817985] dark:text-[#B4A9B8]">
                Avg: ${(orders.length ? (totalSales / orders.length) : 0).toFixed(1)} / ticket
              </span>
            </div>
            <p className="text-xs text-[#817985] dark:text-[#B4A9B8] mt-2">
              {completedOrders.length} completed, {activeOrders.length} in service
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Kitchen Pipeline */}
        <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">
                Active Kitchen Queue
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ChefHat size={20} className="stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-3xl font-black text-[#242026] dark:text-[#F9F4F8] tracking-tight">
                {activeOrders.length}
              </p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeOrders.length > 3 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {activeOrders.length > 3 ? 'High Volume' : 'Smooth Flow'}
              </span>
            </div>
            <p className="text-xs text-[#817985] dark:text-[#B4A9B8] mt-2">
              Avg ticket wait: ~12 mins
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Floor Occupancy */}
        <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">
                Table Occupancy
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#E7B0DE]/20 text-[#400849] dark:text-[#E7B0DE] flex items-center justify-center">
                <TableIcon size={20} className="stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-3xl font-black text-[#242026] dark:text-[#F9F4F8] tracking-tight">
                {occupancyRate}%
              </p>
              <span className="text-xs font-bold text-[#400849] dark:text-[#E7B0DE] bg-[#F9EAF5] dark:bg-[#2E1E33] px-2 py-0.5 rounded-full">
                {occupiedTables} / {totalTables} tables
              </span>
            </div>
            <p className="text-xs text-[#817985] dark:text-[#B4A9B8] mt-2">
              {totalTables - occupiedTables} tables ready for guests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Chart */}
        <Card className="lg:col-span-2 rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-[#242026] dark:text-[#F9F4F8]">
                Hourly Sales Velocity
              </CardTitle>
              <CardDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
                Track order peaks during lunch and dinner rushes
              </CardDescription>
            </div>
            <span className="text-xs font-bold text-[#400849] dark:text-[#E7B0DE] bg-[#F9EAF5] dark:bg-[#2E1E33] px-3 py-1 rounded-full">
              Today's Session
            </span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#400849" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#400849" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5A0A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF5A0A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EADFE8" opacity={0.5} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#817985' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#817985' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#242026', 
                      borderRadius: '12px', 
                      color: '#FFF', 
                      border: 'none',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    name="Sales ($)" 
                    stroke="#400849" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#salesGrad)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    name="Orders Count" 
                    stroke="#FF5A0A" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#orderGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown Chart */}
        <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-[#242026] dark:text-[#F9F4F8]">
              Sales by Category
            </CardTitle>
            <CardDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              Top performing menu segments
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex-1 flex flex-col justify-between">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#242026', 
                      borderRadius: '8px', 
                      color: '#FFF', 
                      fontSize: '11px',
                      border: 'none' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EADFE8] dark:border-[#3D2C42]">
              {categoryDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-[#817985] dark:text-[#B4A9B8]">{item.name}</span>
                  <span className="font-bold ml-auto text-[#242026] dark:text-[#F9F4F8]">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Feed & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Live Orders Feed */}
        <Card className="lg:col-span-2 rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-bold text-[#242026] dark:text-[#F9F4F8]">
                Recent Orders Stream
              </CardTitle>
              <CardDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
                Live customer tickets placed across all floor tables
              </CardDescription>
            </div>
            <Link to="/orders">
              <Button variant="ghost" size="sm" className="text-xs text-[#400849] dark:text-[#E7B0DE] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33]">
                View All <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF9F5] dark:bg-[#18111B] text-[#817985] dark:text-[#B4A9B8] border-y border-[#EADFE8] dark:border-[#3D2C42] uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="px-5 py-3">Order Ref</th>
                    <th className="px-4 py-3">Table</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADFE8] dark:divide-[#3D2C42]">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-5 py-8 text-center text-[#817985]">
                        No orders recorded yet. Start by creating a new table order!
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="hover:bg-[#FFF9F5] dark:hover:bg-[#18111B]/60 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-[#400849] dark:text-[#E7B0DE]">
                          {order.orderId}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#242026] dark:text-[#F9F4F8]">
                          T-{order.table?.tableNumber || '1'}
                        </td>
                        <td className="px-4 py-3.5 text-[#817985] dark:text-[#B4A9B8] max-w-[200px] truncate">
                          {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') || 'N/A'}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#242026] dark:text-[#F9F4F8]">
                          ${order.total?.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link to={`/orders/${order._id}`}>
                            <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-lg border-[#EADFE8] dark:border-[#3D2C42] text-xs">
                              <Eye size={12} className="mr-1" /> View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Stock Alert & Floor Snapshot */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[#242026] dark:text-[#F9F4F8] flex items-center gap-1.5">
                  <AlertTriangle size={16} className="text-amber-500" />
                  Inventory Thresholds
                </CardTitle>
                <CardDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
                  Ingredients requiring kitchen restock
                </CardDescription>
              </div>
              <Link to="/inventory">
                <Button variant="ghost" size="sm" className="text-xs text-[#FF5A0A] p-0 h-auto">
                  Manage →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockItems.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} /> All ingredient inventory levels optimal
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item._id} className="p-3 rounded-xl bg-[#FFF9F5] dark:bg-[#18111B] border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8]">{item.name}</p>
                      <p className="text-[10px] text-[#817985] dark:text-[#B4A9B8]">Min threshold: {item.minimumStockLevel} {item.unit}</p>
                    </div>
                    <Badge variant="destructive" className="bg-rose-500 text-white text-[10px]">
                      {item.currentQuantity} {item.unit} left
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Hub Navigator */}
          <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-gradient-to-br from-[#400849] to-[#2B0531] text-white shadow-md p-5">
            <h4 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <Sparkles size={16} className="text-[#FF5A0A]" /> Fast Service Shortcuts
            </h4>
            <p className="text-xs text-[#E7B0DE]/80 mt-1">
              Direct access for waitstaff and kitchen brigade during live service.
            </p>
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <Link to="/tables" className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-center text-xs font-bold text-white block">
                Floor Plan (Tables)
              </Link>
              <Link to="/kitchen" className="p-2.5 rounded-xl bg-[#FF5A0A] hover:bg-[#e04e06] transition-colors text-center text-xs font-bold text-white block shadow-sm">
                Kitchen Display (KDS)
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
