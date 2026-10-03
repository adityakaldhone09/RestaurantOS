import React, { useState } from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    restaurantName: 'RestaurantOS',
    address: '123 Tech Street, SF, CA 94105',
    phone: '+1 (555) 123-4567',
    email: 'contact@restaurant.com',
    gstNumber: 'GSTIN123456789',
    defaultTaxRate: 5,
    currency: 'USD',
    billFooterMessage: 'Thank you for dining with us!'
  });

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Restaurant Settings</h2>
      
      <form onSubmit={handleSave} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
            <input type="text" name="restaurantName" value={settings.restaurantName} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GST / Tax Number</label>
            <input type="text" name="gstNumber" value={settings.gstNumber} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" value={settings.email} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Physical Address</label>
            <textarea name="address" value={settings.address} onChange={handleChange} rows="2" className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency (Symbol/Code)</label>
            <input type="text" name="currency" value={settings.currency} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Tax Rate (%)</label>
            <input type="number" name="defaultTaxRate" value={settings.defaultTaxRate} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Bill Footer Message</label>
            <input type="text" name="billFooterMessage" value={settings.billFooterMessage} onChange={handleChange} className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center hover:bg-blue-700 font-medium">
            <Save size={18} className="mr-2" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
