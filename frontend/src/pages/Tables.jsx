import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tables`);
      setTables(data.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cleaning': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading tables...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dining Tables</h2>
        {['Admin', 'Manager'].includes(user?.role) && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700">
            <Plus size={18} className="mr-2" /> Add Table
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {tables.map(table => (
          <div 
            key={table._id} 
            className={`border-2 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 shadow-sm bg-white ${getStatusColor(table.status)}`}
            onClick={() => console.log('View table', table._id)}
          >
            <h3 className="text-3xl font-bold mb-2">{table.tableNumber}</h3>
            <span className="text-sm font-semibold uppercase tracking-wider mb-3">
              {table.status}
            </span>
            <div className="text-xs flex flex-col items-center opacity-80">
              <span>Cap: {table.capacity}</span>
              <span>{table.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
