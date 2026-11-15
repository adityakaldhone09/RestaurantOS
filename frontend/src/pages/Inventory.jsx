import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  Package, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingDown,
  RefreshCw,
  PlusCircle
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
import { toast } from 'sonner';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Produce',
    currentQuantity: '',
    minimumStockLevel: '',
    unit: 'kg'
  });
  const [saving, setSaving] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/inventory`);
      setItems(data.data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Produce',
      currentQuantity: '',
      minimumStockLevel: '',
      unit: 'kg'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category || 'Produce',
      currentQuantity: item.currentQuantity,
      minimumStockLevel: item.minimumStockLevel,
      unit: item.unit || 'kg'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.currentQuantity === '') {
      return toast.error('Please complete all required fields');
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        category: formData.category,
        currentQuantity: Number(formData.currentQuantity),
        minimumStockLevel: Number(formData.minimumStockLevel || 10),
        unit: formData.unit
      };

      if (editingItem) {
        const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/inventory/${editingItem._id}`, payload);
        setItems(prev => prev.map(i => i._id === editingItem._id ? data.data : i));
        toast.success(`Updated ${formData.name}`);
      } else {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/inventory`, payload);
        setItems(prev => [...prev, data.data]);
        toast.success(`Added ${formData.name} to stock list`);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast.error('Failed to save inventory item');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickRestock = async (item, amount = 10) => {
    try {
      const newQty = item.currentQuantity + amount;
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, currentQuantity: newQty } : i));
      await axios.put(`${import.meta.env.VITE_API_URL}/inventory/${item._id}`, { currentQuantity: newQty });
      toast.success(`Restocked +${amount} ${item.unit} of ${item.name}!`);
    } catch (error) {
      console.error('Error restocking:', error);
      toast.error('Failed to restock item');
      fetchInventory();
    }
  };

  const handleDeleteItem = async (itemId, name) => {
    if (!window.confirm(`Delete ${name} from inventory?`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/inventory/${itemId}`);
      setItems(prev => prev.filter(i => i._id !== itemId));
      toast.success(`${name} removed`);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast.error('Failed to delete item');
    }
  };

  const categories = ['All', 'Produce', 'Dairy', 'Seafood', 'Meat', 'Pantry', 'Beverages'];

  const filteredItems = items.filter(item => {
    const isLow = item.currentQuantity <= item.minimumStockLevel;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLowFilter = !onlyLowStock || isLow;
    return matchesCategory && matchesSearch && matchesLowFilter;
  });

  const lowStockCount = items.filter(i => i.currentQuantity <= i.minimumStockLevel).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242026] dark:text-[#F9F4F8]">
            Stock & Inventory Control
          </h2>
          <p className="text-sm text-[#817985] dark:text-[#B4A9B8] mt-1">
            Ingredient stocks, supplier reorders, and minimum threshold safety triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchInventory} 
            className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826]"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {['Admin', 'Manager'].includes(user?.role) && (
            <Button
              onClick={openAddModal}
              className="rounded-xl bg-[#400849] hover:bg-[#5b0c67] text-white font-bold shadow-md"
            >
              <Plus size={18} className="mr-2" />
              Add Inventory Item
            </Button>
          )}
        </div>
      </div>

      {/* Low Stock Warning Callout */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {lowStockCount} critical ingredient{lowStockCount > 1 ? 's' : ''} below safety thresholds
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Replenish stock to prevent 86ing menu items during active dinner rushes.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0"
          >
            {onlyLowStock ? 'Show All Items' : 'Filter Low Stock Only'}
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-white dark:bg-[#231826] rounded-2xl border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#817985]" />
          <Input
            placeholder="Search raw ingredients or supplies..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-[#400849] text-white shadow-sm'
                  : 'text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F5] dark:bg-[#18111B] text-[#817985] dark:text-[#B4A9B8] border-b border-[#EADFE8] dark:border-[#3D2C42] uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Min. Threshold</th>
                  <th className="px-6 py-4">Stock Health</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFE8] dark:divide-[#3D2C42]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#817985]">
                      Loading stock items...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-[#817985]">
                      No inventory records found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    const isLow = item.currentQuantity <= item.minimumStockLevel;
                    const percent = Math.min(Math.round((item.currentQuantity / (item.minimumStockLevel * 2 || 20)) * 100), 100);

                    return (
                      <tr key={item._id} className="hover:bg-[#FFF9F5] dark:hover:bg-[#18111B]/60 transition-colors">
                        <td className="px-6 py-4 font-extrabold text-sm text-[#242026] dark:text-[#F9F4F8]">
                          {item.name}
                        </td>

                        <td className="px-6 py-4 font-semibold text-[#817985] dark:text-[#B4A9B8]">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F9EAF5] dark:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] border border-[#EADFE8] dark:border-[#3D2C42]">
                            {item.category || 'Produce'}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-bold text-sm text-[#242026] dark:text-[#F9F4F8]">
                          {item.currentQuantity} <span className="text-xs text-[#817985] font-normal">{item.unit}</span>
                        </td>

                        <td className="px-6 py-4 text-[#817985] dark:text-[#B4A9B8] font-mono">
                          {item.minimumStockLevel} {item.unit}
                        </td>

                        {/* Progress Bar */}
                        <td className="px-6 py-4 w-40">
                          <div className="w-full bg-[#EADFE8] dark:bg-[#3D2C42] h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                isLow ? 'bg-rose-500' : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-[#817985] mt-1 block font-mono">
                            {percent}% buffer
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                              <AlertTriangle size={12} /> Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 size={12} /> In Stock
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickRestock(item, 10)}
                              className="h-8 px-2.5 rounded-lg border-[#EADFE8] dark:border-[#3D2C42] text-xs font-bold text-[#400849] dark:text-[#E7B0DE]"
                              title="Restock +10 units"
                            >
                              <PlusCircle size={13} className="mr-1 text-[#FF5A0A]" /> +10
                            </Button>

                            {['Admin', 'Manager'].includes(user?.role) && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditModal(item)}
                                  className="h-8 w-8 p-0 rounded-lg text-[#400849] dark:text-[#E7B0DE] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33]"
                                >
                                  <Edit2 size={14} />
                                </Button>
                                {user?.role === 'Admin' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteItem(item._id, item.name)}
                                    className="h-8 w-8 p-0 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Inventory Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#242026] dark:text-[#F9F4F8]">
              {editingItem ? 'Edit Ingredient Record' : 'Add Stock Item'}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              Track raw food ingredients and set critical low-stock safety triggers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                Item Name *
              </label>
              <Input
                required
                placeholder="e.g. San Marzano Tomatoes"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs font-medium focus:ring-1 focus:ring-[#400849]"
                >
                  <option value="Produce">Produce</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Meat">Meat</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Unit Measurement
                </label>
                <select
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs font-medium focus:ring-1 focus:ring-[#400849]"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="liters">liters</option>
                  <option value="pieces">pieces</option>
                  <option value="packs">packs</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Current In-House Qty *
                </label>
                <Input
                  type="number"
                  required
                  placeholder="40"
                  value={formData.currentQuantity}
                  onChange={e => setFormData({ ...formData, currentQuantity: e.target.value })}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Low Stock Trigger *
                </label>
                <Input
                  type="number"
                  required
                  placeholder="10"
                  value={formData.minimumStockLevel}
                  onChange={e => setFormData({ ...formData, minimumStockLevel: e.target.value })}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B]"
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#400849] hover:bg-[#5b0c67] text-white font-bold"
              >
                {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
