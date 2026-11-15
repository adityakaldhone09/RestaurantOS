import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  UtensilsCrossed, 
  Clock, 
  Check, 
  Sparkles,
  ArrowLeft,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const NewOrder = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(location.search);
    const tableId = params.get('table');
    if (tableId) setSelectedTable(tableId);
  }, [location]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, menuRes, tableRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/menu/categories`).catch(() => ({ data: { data: [] } })),
        axios.get(`${import.meta.env.VITE_API_URL}/menu/items`).catch(() => ({ data: { data: [] } })),
        axios.get(`${import.meta.env.VITE_API_URL}/tables`).catch(() => ({ data: { data: [] } }))
      ]);

      setCategories(catRes.data?.data || []);
      setMenuItems(menuRes.data?.data || []);
      setTables(tableRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching POS catalog:', error);
      toast.error('Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem === item._id);
      if (existing) {
        return prev.map(i => i.menuItem === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        specialInstructions: ''
      }];
    });
    toast.success(`Added ${item.name}`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.menuItem === id) {
        const newQ = i.quantity + delta;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.menuItem !== id));
  };

  const updateInstructions = (id, instructions) => {
    setCart(prev => prev.map(i => i.menuItem === id ? { ...i, specialInstructions: instructions } : i));
  };

  // Pricing
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const placeOrder = async () => {
    if (!selectedTable) {
      return toast.error('Please assign a table for this order');
    }
    if (cart.length === 0) {
      return toast.error('Your order cart is empty');
    }

    try {
      setSubmitting(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        table: selectedTable,
        items: cart,
        subtotal,
        tax,
        total
      });

      toast.success(`Order ${res.data?.data?.orderId || 'placed'} dispatched to Kitchen!`);
      navigate('/orders');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category?._id === selectedCategory || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesVeg = !onlyVeg || item.isVegetarian;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/orders">
            <Button variant="outline" size="icon" className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42]">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-extrabold text-[#242026] dark:text-[#F9F4F8] tracking-tight">
              Point of Sale (POS) Terminal
            </h2>
            <p className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              Select items from the catalog to build an active table ticket.
            </p>
          </div>
        </div>
      </div>

      {/* POS Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Menu Catalog (7 or 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Dietary Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 p-3 bg-white dark:bg-[#231826] rounded-2xl border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#817985]" />
              <Input
                placeholder="Search food, beverages, appetizers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
              />
            </div>

            <button
              onClick={() => setOnlyVeg(!onlyVeg)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                onlyVeg 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300' 
                  : 'border-[#EADFE8] dark:border-[#3D2C42] text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8]'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${onlyVeg ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              Vegetarian Only
            </button>
          </div>

          {/* Categories Tab Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#400849] text-white shadow-sm'
                  : 'bg-white dark:bg-[#231826] text-[#817985] dark:text-[#B4A9B8] hover:text-[#242026] border border-[#EADFE8] dark:border-[#3D2C42]'
              }`}
            >
              All Segments
            </button>
            {categories.map(c => (
              <button
                key={c._id}
                onClick={() => setSelectedCategory(c._id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c._id
                    ? 'bg-[#400849] text-white shadow-sm'
                    : 'bg-white dark:bg-[#231826] text-[#817985] dark:text-[#B4A9B8] hover:text-[#242026] border border-[#EADFE8] dark:border-[#3D2C42]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="p-12 text-center text-[#817985]">Loading menu...</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#231826] rounded-2xl border border-[#EADFE8] dark:border-[#3D2C42]">
              <p className="text-sm font-bold text-[#242026] dark:text-[#F9F4F8]">No items found</p>
              <p className="text-xs text-[#817985]">Try clearing search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map(item => {
                const inCartItem = cart.find(i => i.menuItem === item._id);

                return (
                  <Card
                    key={item._id}
                    onClick={() => addToCart(item)}
                    className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] hover:border-[#400849] dark:hover:border-[#E7B0DE] shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 group flex flex-col justify-between"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span 
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                item.isVegetarian ? 'bg-emerald-500' : 'bg-rose-500'
                              }`} 
                              title={item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                            />
                            <h4 className="font-bold text-sm text-[#242026] dark:text-[#F9F4F8] group-hover:text-[#400849] dark:group-hover:text-[#E7B0DE] transition-colors line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                          <p className="text-xs text-[#817985] dark:text-[#B4A9B8] line-clamp-2">
                            {item.description || 'Delicious freshly prepared specialty.'}
                          </p>
                        </div>

                        {inCartItem && (
                          <Badge className="bg-[#FF5A0A] text-white font-extrabold text-xs px-2 py-0.5 rounded-full shrink-0">
                            {inCartItem.quantity}x
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#EADFE8]/60 dark:border-[#3D2C42]/60 text-xs">
                        <span className="font-extrabold text-base text-[#400849] dark:text-[#E7B0DE]">
                          ${item.price.toFixed(2)}
                        </span>

                        <span className="text-[11px] text-[#817985] dark:text-[#B4A9B8] flex items-center gap-1">
                          <Clock size={12} className="text-[#FF5A0A]" /> {item.preparationTime || 12}m prep
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Order Ticket / Cart (4 cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-xl overflow-hidden">
            {/* Ticket Header */}
            <div className="p-4 bg-[#400849] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <FileText size={16} className="text-[#FF5A0A]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight">Active Dining Ticket</h3>
                    <p className="text-[11px] text-[#E7B0DE]/80">{cart.length} item kinds</p>
                  </div>
                </div>

                {cart.length > 0 && (
                  <button 
                    onClick={() => setCart([])}
                    className="text-[11px] text-white/70 hover:text-white underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Table Picker */}
              <div className="mt-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#E7B0DE] block mb-1">
                  Assign Dining Table *
                </label>
                <select
                  value={selectedTable}
                  onChange={e => setSelectedTable(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF5A0A]"
                >
                  <option value="" className="text-gray-900">Select Table for Order...</option>
                  {tables.map(t => (
                    <option key={t._id} value={t._id} className="text-gray-900">
                      Table #{t.tableNumber} ({t.capacity} Seats · {t.location}) - {t.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="p-4 max-h-[360px] overflow-y-auto divide-y divide-[#EADFE8] dark:divide-[#3D2C42]">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-[#817985] dark:text-[#B4A9B8]">
                  <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8]">Ticket is currently empty</p>
                  <p className="text-[11px] text-[#817985] mt-0.5">Click any food item on the left to add.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.menuItem} className="py-3 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-[#242026] dark:text-[#F9F4F8] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#817985] font-semibold">${item.price.toFixed(2)} each</p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-[#FFF9F5] dark:bg-[#18111B] p-1 rounded-lg border border-[#EADFE8] dark:border-[#3D2C42]">
                        <button
                          onClick={() => updateQuantity(item.menuItem, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE]"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE]"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-xs text-[#242026] dark:text-[#F9F4F8]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.menuItem)}
                          className="block text-rose-500 hover:text-rose-700 ml-auto mt-1"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Kitchen Special Note Input */}
                    <div className="flex items-center gap-1.5">
                      <MessageSquare size={12} className="text-[#817985] shrink-0" />
                      <input
                        type="text"
                        placeholder="Add cooking note (e.g. less salt, extra dressing)..."
                        value={item.specialInstructions}
                        onChange={e => updateInstructions(item.menuItem, e.target.value)}
                        className="w-full text-[11px] bg-transparent border-b border-[#EADFE8] dark:border-[#3D2C42] focus:border-[#400849] focus:outline-none py-0.5 text-[#242026] dark:text-[#F9F4F8]"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Submit */}
            <div className="p-4 bg-[#FFF9F5] dark:bg-[#18111B] border-t border-[#EADFE8] dark:border-[#3D2C42] space-y-2.5">
              <div className="flex justify-between text-xs text-[#817985] dark:text-[#B4A9B8]">
                <span>Food & Beverage Subtotal</span>
                <span className="font-semibold text-[#242026] dark:text-[#F9F4F8]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#817985] dark:text-[#B4A9B8]">
                <span>State & Local Tax (5%)</span>
                <span className="font-semibold text-[#242026] dark:text-[#F9F4F8]">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#242026] dark:text-[#F9F4F8] pt-2 border-t border-[#EADFE8] dark:border-[#3D2C42]">
                <span>Total Due</span>
                <span className="text-[#FF5A0A]">${total.toFixed(2)}</span>
              </div>

              <Button
                onClick={placeOrder}
                disabled={submitting || cart.length === 0}
                className="w-full h-12 rounded-xl bg-[#FF5A0A] hover:bg-[#e04e06] text-white font-extrabold text-sm shadow-lg shadow-[#FF5A0A]/25 transition-all mt-3"
              >
                {submitting ? 'Dispatching...' : 'Dispatch Ticket to Kitchen'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
