import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  UtensilsCrossed, 
  MoreVertical, 
  Trash2,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { toast } from 'sonner';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Add Table Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tableForm, setTableForm] = useState({
    tableNumber: '',
    capacity: 4,
    location: 'Main Floor',
    status: 'Available'
  });
  const [saving, setSaving] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tables`);
      setTables(data.data || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast.error('Failed to load floor tables');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      // Optimistic update
      setTables(prev => prev.map(t => t._id === tableId ? { ...t, status: newStatus } : t));
      await axios.put(`${import.meta.env.VITE_API_URL}/tables/${tableId}`, { status: newStatus });
      toast.success(`Table status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error updating table status:', error);
      toast.error('Failed to update table status');
      fetchTables();
    }
  };

  const handleDeleteTable = async (tableId, tableNum) => {
    if (!window.confirm(`Are you sure you want to delete Table #${tableNum}?`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tables/${tableId}`);
      setTables(prev => prev.filter(t => t._id !== tableId));
      toast.success(`Table #${tableNum} deleted`);
    } catch (error) {
      console.error('Error deleting table:', error);
      toast.error('Failed to delete table');
    }
  };

  const handleAddTableSubmit = async (e) => {
    e.preventDefault();
    if (!tableForm.tableNumber) {
      return toast.error('Please enter a table number');
    }

    try {
      setSaving(true);
      const payload = {
        tableNumber: Number(tableForm.tableNumber),
        capacity: Number(tableForm.capacity),
        location: tableForm.location,
        status: tableForm.status
      };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/tables`, payload);
      setTables(prev => [...prev, data.data].sort((a, b) => a.tableNumber - b.tableNumber));
      setIsAddModalOpen(false);
      setTableForm({ tableNumber: '', capacity: 4, location: 'Main Floor', status: 'Available' });
      toast.success(`Table #${payload.tableNumber} added successfully!`);
    } catch (error) {
      console.error('Error adding table:', error);
      toast.error(error.response?.data?.message || 'Failed to add table');
    } finally {
      setSaving(false);
    }
  };

  // Section & Status filtering
  const sections = ['All', 'Main Floor', 'Patio', 'Window View', 'Bar'];
  const statuses = ['All', 'Available', 'Occupied', 'Reserved'];

  const filteredTables = tables.filter(t => {
    const matchesSection = selectedSection === 'All' || t.location === selectedSection;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesSection && matchesStatus;
  });

  const availableCount = tables.filter(t => t.status === 'Available').length;
  const occupiedCount = tables.filter(t => t.status === 'Occupied').length;
  const reservedCount = tables.filter(t => t.status === 'Reserved').length;
  const totalSeats = tables.reduce((sum, t) => sum + (t.capacity || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        );
      case 'Occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FF5A0A]/10 text-[#FF5A0A] border border-[#FF5A0A]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A] animate-pulse" />
            Occupied
          </span>
        );
      case 'Reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F9EAF5] text-[#400849] dark:bg-[#2E1E33] dark:text-[#E7B0DE] border border-[#EADFE8] dark:border-[#3D2C42]">
            <Clock size={12} />
            Reserved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242026] dark:text-[#F9F4F8]">
            Floor Seating & Tables
          </h2>
          <p className="text-sm text-[#817985] dark:text-[#B4A9B8] mt-1">
            Real-time visual table statuses, section allocation, and immediate POS order dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchTables} 
            className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826]"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {['Admin', 'Manager'].includes(user?.role) && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-xl bg-[#400849] hover:bg-[#570b63] text-white font-bold shadow-md"
            >
              <Plus size={18} className="mr-2" />
              Add Dining Table
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#231826] border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">Total Tables</p>
          <p className="text-2xl font-black text-[#242026] dark:text-[#F9F4F8] mt-1">{tables.length}</p>
          <span className="text-[11px] text-[#817985] dark:text-[#B4A9B8]">{totalSeats} guest capacity</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Ready to Seat</p>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{availableCount}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-500">Available tables</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#FF5A0A]/5 border border-[#FF5A0A]/20 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF5A0A]">Dining In</p>
          <p className="text-2xl font-black text-[#FF5A0A] mt-1">{occupiedCount}</p>
          <span className="text-[11px] text-[#817985] dark:text-[#B4A9B8]">Currently occupied</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#F9EAF5] dark:bg-[#2E1E33] border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#400849] dark:text-[#E7B0DE]">Reserved Ahead</p>
          <p className="text-2xl font-black text-[#400849] dark:text-[#E7B0DE] mt-1">{reservedCount}</p>
          <span className="text-[11px] text-[#817985] dark:text-[#B4A9B8]">Booked tables</span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white dark:bg-[#231826] rounded-2xl border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm">
        {/* Section Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-[#817985] dark:text-[#B4A9B8] px-2 flex items-center gap-1">
            <MapPin size={13} /> Section:
          </span>
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSection === section
                  ? 'bg-[#400849] text-white shadow-sm'
                  : 'text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33]'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-[#817985] dark:text-[#B4A9B8] px-2 flex items-center gap-1">
            <Filter size={13} /> Status:
          </span>
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === status
                  ? 'bg-[#FF5A0A] text-white shadow-sm'
                  : 'text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tables Grid */}
      {loading ? (
        <div className="p-12 text-center text-[#817985]">Loading floor layout...</div>
      ) : filteredTables.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-[#231826] rounded-2xl border border-[#EADFE8] dark:border-[#3D2C42]">
          <p className="text-base font-bold text-[#242026] dark:text-[#F9F4F8]">No tables match this filter</p>
          <p className="text-xs text-[#817985] mt-1">Try selecting another section or status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredTables.map(table => {
            const isOccupied = table.status === 'Occupied';
            const isAvailable = table.status === 'Available';

            return (
              <Card 
                key={table._id}
                className={`rounded-2xl transition-all duration-200 border-2 shadow-sm hover:shadow-md relative overflow-hidden group ${
                  isOccupied
                    ? 'border-[#FF5A0A]/40 bg-gradient-to-b from-white to-[#FF5A0A]/5 dark:from-[#231826] dark:to-[#FF5A0A]/10'
                    : isAvailable
                    ? 'border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-[#231826] hover:border-emerald-400'
                    : 'border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826]'
                }`}
              >
                <CardContent className="p-5 flex flex-col justify-between h-56">
                  {/* Top Bar with Number & Menu */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-black tracking-tight text-[#242026] dark:text-[#F9F4F8]">
                          T-{table.tableNumber}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#817985] dark:text-[#B4A9B8] flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-[#FF5A0A]" /> {table.location}
                      </span>
                    </div>

                    {/* Table Status Quick Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-8 h-8 rounded-lg text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33] flex items-center justify-center transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] rounded-xl shadow-lg">
                        <DropdownMenuLabel className="text-xs font-bold text-[#817985]">Set Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(table._id, 'Available')} className="cursor-pointer text-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" /> Set Available
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(table._id, 'Occupied')} className="cursor-pointer text-xs">
                          <span className="w-2 h-2 rounded-full bg-[#FF5A0A] mr-2" /> Set Occupied
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(table._id, 'Reserved')} className="cursor-pointer text-xs">
                          <span className="w-2 h-2 rounded-full bg-[#E7B0DE] mr-2" /> Set Reserved
                        </DropdownMenuItem>
                        
                        {['Admin', 'Manager'].includes(user?.role) && (
                          <>
                            <DropdownMenuSeparator className="bg-[#EADFE8] dark:bg-[#3D2C42]" />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTable(table._id, table.tableNumber)}
                              className="cursor-pointer text-xs text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
                            >
                              <Trash2 size={14} className="mr-2" /> Delete Table
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Middle: Capacity & Status */}
                  <div className="space-y-2.5">
                    <div>{getStatusBadge(table.status)}</div>
                    <div className="flex items-center gap-1.5 text-xs text-[#817985] dark:text-[#B4A9B8]">
                      <Users size={14} className="text-[#400849] dark:text-[#E7B0DE]" />
                      <span className="font-semibold text-[#242026] dark:text-[#F9F4F8]">{table.capacity} Seats</span>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-2">
                    {isAvailable ? (
                      <Button
                        onClick={() => navigate(`/orders/new?table=${table._id}`)}
                        className="w-full h-9 rounded-xl bg-[#400849] hover:bg-[#5b0c67] text-white text-xs font-bold shadow-sm"
                      >
                        <UtensilsCrossed size={14} className="mr-1.5 text-[#FF5A0A]" />
                        Take Order
                      </Button>
                    ) : isOccupied ? (
                      <Button
                        onClick={() => navigate('/orders')}
                        variant="outline"
                        className="w-full h-9 rounded-xl border-[#FF5A0A]/40 text-[#FF5A0A] hover:bg-[#FF5A0A]/10 text-xs font-bold"
                      >
                        View Ticket
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStatusChange(table._id, 'Available')}
                        variant="outline"
                        className="w-full h-9 rounded-xl border-[#EADFE8] dark:border-[#3D2C42] text-xs font-semibold"
                      >
                        Release Table
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Table Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#242026] dark:text-[#F9F4F8]">
              Add New Dining Table
            </DialogTitle>
            <DialogDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              Configure a new table and assign it to a dining zone.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddTableSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                Table Number *
              </label>
              <Input
                type="number"
                required
                placeholder="e.g. 11"
                value={tableForm.tableNumber}
                onChange={e => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Seating Capacity
                </label>
                <select
                  value={tableForm.capacity}
                  onChange={e => setTableForm({ ...tableForm, capacity: Number(e.target.value) })}
                  className="w-full h-10 px-3 rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs font-medium focus:ring-1 focus:ring-[#400849]"
                >
                  <option value={2}>2 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6 Guests</option>
                  <option value={8}>8 Guests</option>
                  <option value={10}>10+ Guests</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Floor Section
                </label>
                <select
                  value={tableForm.location}
                  onChange={e => setTableForm({ ...tableForm, location: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs font-medium focus:ring-1 focus:ring-[#400849]"
                >
                  <option value="Main Floor">Main Floor</option>
                  <option value="Patio">Patio</option>
                  <option value="Window View">Window View</option>
                  <option value="Bar">Bar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                Initial Status
              </label>
              <select
                value={tableForm.status}
                onChange={e => setTableForm({ ...tableForm, status: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs font-medium focus:ring-1 focus:ring-[#400849]"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#400849] hover:bg-[#5b0c67] text-white font-bold"
              >
                {saving ? 'Creating Table...' : 'Create Table'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tables;
