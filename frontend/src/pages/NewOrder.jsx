import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

const NewOrder = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTable, setSelectedTable] = useState('');
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
    // If navigated from a specific table
    const params = new URLSearchParams(location.search);
    const tableId = params.get('table');
    if (tableId) setSelectedTable(tableId);
  }, [location]);

  const fetchData = async () => {
    try {
      const [catRes, menuRes, tableRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/menu/categories`),
        axios.get(`${import.meta.env.VITE_API_URL}/menu/items`),
        axios.get(`${import.meta.env.VITE_API_URL}/tables`)
      ]);
      setCategories(catRes.data.data);
      setMenuItems(menuRes.data.data);
      setTables(tableRes.data.data.filter(t => t.status === 'Available'));
    } catch (error) {
      console.error('Error fetching data:', error);
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
      return [...prev, { menuItem: item._id, name: item.name, price: item.price, quantity: 1, specialInstructions: '' }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.menuItem === id) {
        const newQ = i.quantity + delta;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.menuItem !== id));
  };

  const updateInstructions = (id, instructions) => {
    setCart(prev => prev.map(i => i.menuItem === id ? { ...i, specialInstructions: instructions } : i));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const placeOrder = async () => {
    if (!selectedTable) return alert('Please select a table');
    if (cart.length === 0) return alert('Cart is empty');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        table: selectedTable,
        items: cart,
        subtotal,
        tax,
        total
      });
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category?._id === selectedCategory);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Menu Section */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          <button 
            className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map(c => (
            <button 
              key={c._id}
              className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === c._id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setSelectedCategory(c._id)}
            >
              {c.name}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item._id} 
                onClick={() => addToCart(item)}
                className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition bg-gray-50 flex flex-col justify-between h-32"
              >
                <div>
                  <div className="font-semibold text-gray-800 line-clamp-1">{item.name}</div>
                  <div className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-blue-600">${item.price.toFixed(2)}</span>
                  <div className={`w-3 h-3 rounded-full ${item.isVegetarian ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 bg-white rounded-lg shadow flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h3 className="text-lg font-bold flex items-center"><ShoppingCart className="mr-2" size={20}/> Current Order</h3>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Table</label>
          <select 
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">-- Choose Table --</option>
            {tables.map(t => (
              <option key={t._id} value={t._id}>{t.tableNumber} (Cap: {t.capacity})</option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 my-8">Cart is empty</div>
          ) : (
            cart.map(item => (
              <div key={item.menuItem} className="flex flex-col pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium flex-1 pr-2">{item.name}</div>
                  <div className="font-semibold w-16 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center border rounded-md">
                    <button className="px-2 py-1 text-gray-500 hover:bg-gray-100" onClick={() => updateQuantity(item.menuItem, -1)}><Minus size={14}/></button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button className="px-2 py-1 text-gray-500 hover:bg-gray-100" onClick={() => updateQuantity(item.menuItem, 1)}><Plus size={14}/></button>
                  </div>
                  <button className="text-red-500 p-1 rounded hover:bg-red-50" onClick={() => removeFromCart(item.menuItem)}>
                    <X size={16}/>
                  </button>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Special instructions..." 
                  className="mt-2 text-xs p-1 border rounded w-full focus:ring-blue-500 focus:border-blue-500"
                  value={item.specialInstructions}
                  onChange={(e) => updateInstructions(item.menuItem, e.target.value)}
                />
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600">Tax (5%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
          <button 
            className={`w-full py-3 rounded-lg font-bold text-white transition ${cart.length > 0 && selectedTable ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={cart.length === 0 || !selectedTable}
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
