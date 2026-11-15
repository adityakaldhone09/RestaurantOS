import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Clock, 
  UtensilsCrossed, 
  Filter, 
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { toast } from 'sonner';

const Menu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('All'); // 'All', 'Veg', 'Non-Veg'

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    preparationTime: 15,
    isVegetarian: true,
    isAvailable: true
  });
  const [saving, setSaving] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const [itemsRes, catRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/menu/items`),
        axios.get(`${import.meta.env.VITE_API_URL}/menu/categories`)
      ]);
      setItems(itemsRes.data?.data || []);
      setCategories(catRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu catalog');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      category: categories[0]?._id || '',
      price: '',
      preparationTime: 15,
      isVegetarian: true,
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category?._id || item.category || '',
      price: item.price,
      preparationTime: item.preparationTime || 15,
      isVegetarian: Boolean(item.isVegetarian),
      isAvailable: item.isAvailable !== false
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      return toast.error('Please enter name and price');
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category || categories[0]?._id,
        price: Number(formData.price),
        preparationTime: Number(formData.preparationTime),
        isVegetarian: formData.isVegetarian,
        isAvailable: formData.isAvailable
      };

      if (editingItem) {
        const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/menu/items/${editingItem._id}`, payload);
        setItems(prev => prev.map(i => i._id === editingItem._id ? data.data : i));
        toast.success(`Updated ${formData.name}`);
      } else {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/menu/items`, payload);
        setItems(prev => [...prev, data.data]);
        toast.success(`Added ${formData.name} to menu!`);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to save menu item');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/menu/items/${itemId}`);
      setItems(prev => prev.filter(i => i._id !== itemId));
      toast.success(`${name} deleted from catalog`);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const newAvail = !(item.isAvailable !== false);
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isAvailable: newAvail } : i));
      await axios.put(`${import.meta.env.VITE_API_URL}/menu/items/${item._id}`, { isAvailable: newAvail });
      toast.success(`${item.name} is now ${newAvail ? 'Available' : 'Unavailable (86ed)'}`);
    } catch (error) {
      console.error('Error toggling availability:', error);
      toast.error('Failed to update availability');
      fetchMenuData();
    }
  };

  // Filtering
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category?._id === selectedCategory || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiet = 
      dietaryFilter === 'All' || 
      (dietaryFilter === 'Veg' && item.isVegetarian) || 
      (dietaryFilter === 'Non-Veg' && !item.isVegetarian);

    return matchesCategory && matchesSearch && matchesDiet;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242026] dark:text-[#F9F4F8]">
            Menu Catalog & Recipes
          </h2>
          <p className="text-sm text-[#817985] dark:text-[#B4A9B8] mt-1">
            Manage culinary offerings, pricing, preparation standards, and ingredient tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchMenuData} 
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
              Add Menu Item
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-white dark:bg-[#231826] rounded-2xl border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#817985]" />
          <Input
            placeholder="Search items by title or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
          />
        </div>

        {/* Categories Tab Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#400849] text-white shadow-sm'
                : 'text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33]'
            }`}
          >
            All ({items.length})
          </button>
          {categories.map(c => (
            <button
              key={c._id}
              onClick={() => setSelectedCategory(c._id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c._id
                  ? 'bg-[#400849] text-white shadow-sm'
                  : 'text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-1 shrink-0 border-t lg:border-t-0 lg:border-l border-[#EADFE8] dark:border-[#3D2C42] pt-2 lg:pt-0 lg:pl-3">
          <button
            onClick={() => setDietaryFilter('All')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${dietaryFilter === 'All' ? 'bg-[#FF5A0A] text-white' : 'text-[#817985]'}`}
          >
            All
          </button>
          <button
            onClick={() => setDietaryFilter('Veg')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${dietaryFilter === 'Veg' ? 'bg-emerald-600 text-white' : 'text-[#817985]'}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Veg
          </button>
          <button
            onClick={() => setDietaryFilter('Non-Veg')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${dietaryFilter === 'Non-Veg' ? 'bg-rose-600 text-white' : 'text-[#817985]'}`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Non-Veg
          </button>
        </div>
      </div>

      {/* Menu Table Card */}
      <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F5] dark:bg-[#18111B] text-[#817985] dark:text-[#B4A9B8] border-b border-[#EADFE8] dark:border-[#3D2C42] uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Dish & Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Dietary</th>
                  <th className="px-6 py-4">Prep Time</th>
                  <th className="px-6 py-4">Available</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFE8] dark:divide-[#3D2C42]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#817985]">
                      Loading culinary menu...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-[#817985]">
                      No items matched your filters.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => (
                    <tr key={item._id} className="hover:bg-[#FFF9F5] dark:hover:bg-[#18111B]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-extrabold text-sm text-[#242026] dark:text-[#F9F4F8]">{item.name}</p>
                          <p className="text-xs text-[#817985] dark:text-[#B4A9B8] max-w-sm truncate mt-0.5">
                            {item.description || 'Signature specialty item.'}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-[#242026] dark:text-[#F9F4F8]">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F9EAF5] dark:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] border border-[#EADFE8] dark:border-[#3D2C42]">
                          {item.category?.name || 'Main Course'}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-black text-sm text-[#400849] dark:text-[#E7B0DE]">
                        ${item.price.toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.isVegetarian 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' 
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isVegetarian ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {item.isVegetarian ? 'Vegetarian' : 'Non-Veg'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[#817985] dark:text-[#B4A9B8] font-mono">
                        {item.preparationTime || 12} mins
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            item.isAvailable !== false
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {item.isAvailable !== false ? (
                            <>
                              <CheckCircle2 size={12} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> 86'd
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {['Admin', 'Manager'].includes(user?.role) && (
                          <div className="flex items-center justify-end gap-1.5">
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
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Menu Item Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#242026] dark:text-[#F9F4F8]">
              {editingItem ? 'Edit Menu Item' : 'Add New Culinary Offering'}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              Configure dish information, pricing, dietary flags, and kitchen prep time.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                Dish Name *
              </label>
              <Input
                required
                placeholder="e.g. Truffle Mushroom Risotto"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                Description & Ingredients
              </label>
              <textarea
                rows={2}
                placeholder="Arborio rice with black truffle paste, wild chanterelles, and parmigiano reggiano..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-[#242026] dark:text-[#F9F4F8] focus:outline-none focus:ring-1 focus:ring-[#400849]"
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
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Price ($ USD) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  placeholder="24.50"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Prep Time (Minutes)
                </label>
                <Input
                  type="number"
                  placeholder="15"
                  value={formData.preparationTime}
                  onChange={e => setFormData({ ...formData, preparationTime: e.target.value })}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B]"
                />
              </div>

              <div className="flex flex-col justify-center">
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-2">
                  Dietary Category
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={e => setFormData({ ...formData, isVegetarian: e.target.checked })}
                    className="w-4 h-4 rounded text-[#400849]"
                  />
                  <span>Is Vegetarian Dish</span>
                </label>
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

export default Menu;
