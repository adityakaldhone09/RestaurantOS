import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, ShoppingBag, DollarSign, Utensils } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    availableTables: 0
  });

  useEffect(() => {
    // In a real app, this would be an API call to a specific dashboard endpoint
    // For MVP, we might just fetch the data or use mock data
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
        const orders = data.data;
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;

        setStats({
          totalOrders: orders.length,
          totalSales,
          pendingOrders,
          availableTables: 10 // Mock for now
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">${stats.totalSales.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <Utensils size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Available Tables</p>
            <p className="text-2xl font-bold text-gray-900">{stats.availableTables}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 h-64 flex flex-col justify-center items-center text-gray-500">
        <p>Charts will be displayed here</p>
        <p className="text-sm">(Sales over time, popular items)</p>
      </div>
    </div>
  );
};

export default Dashboard;
