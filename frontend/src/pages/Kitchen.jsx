import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle } from 'lucide-react';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOrders();
    const interval = setInterval(fetchActiveOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      // Filter for Confirmed and Preparing only
      const active = data.data.filter(o => ['Confirmed', 'Preparing'].includes(o.status));
      setOrders(active);
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${id}/status`, { status: newStatus });
      fetchActiveOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl">Loading KDS...</div>;

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-4rem)] -m-6 p-6 text-white overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Kitchen Display System (KDS)</h2>
        <div className="text-gray-400">
          <Clock className="inline mr-2" size={18} /> {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {orders.length === 0 ? (
          <div className="w-full text-center text-gray-500 py-12 text-xl">No active orders in kitchen.</div>
        ) : (
          orders.map(order => (
            <div 
              key={order._id} 
              className={`flex-shrink-0 w-80 rounded-lg shadow-lg flex flex-col ${order.status === 'Preparing' ? 'bg-gray-800 border-2 border-yellow-500' : 'bg-gray-800 border border-gray-700'}`}
            >
              <div className={`p-3 font-bold flex justify-between items-center rounded-t-lg ${order.status === 'Preparing' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700'}`}>
                <span>{order.orderId}</span>
                <span>T-{order.table?.tableNumber}</span>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="text-sm text-gray-400 mb-3 border-b border-gray-700 pb-2">
                  Time: {new Date(order.createdAt).toLocaleTimeString()}
                </div>
                
                <ul className="space-y-3">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-start border-b border-gray-700 pb-2 last:border-0">
                      <div className="flex gap-2">
                        <span className="font-bold text-blue-400">{item.quantity}x</span>
                        <span className="font-medium text-gray-200">{item.name}</span>
                      </div>
                      {item.specialInstructions && (
                        <p className="text-xs text-red-400 mt-1 pl-6 w-full italic">*{item.specialInstructions}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-3 bg-gray-900 rounded-b-lg">
                {order.status === 'Confirmed' && (
                  <button 
                    onClick={() => updateStatus(order._id, 'Preparing')}
                    className="w-full py-3 font-bold rounded bg-yellow-600 hover:bg-yellow-500 text-white transition"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'Preparing' && (
                  <button 
                    onClick={() => updateStatus(order._id, 'Ready')}
                    className="w-full py-3 font-bold rounded bg-green-600 hover:bg-green-500 text-white flex items-center justify-center transition"
                  >
                    <CheckCircle className="mr-2" size={20} /> Mark Ready
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Kitchen;
