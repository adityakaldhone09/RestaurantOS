import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Save, 
  Store, 
  DollarSign, 
  Percent, 
  Receipt, 
  Moon, 
  Sun, 
  Sparkles,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('restaurantos_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      restaurantName: 'RestaurantOS Bistro',
      tagline: 'Artisan Dining & Gastronomy',
      address: '100 Market Street, San Francisco, CA 94105',
      phone: '+1 (555) 234-5678',
      email: 'contact@restaurantos.com',
      gstNumber: 'GSTIN88294719',
      defaultTaxRate: 5,
      currency: '$ USD',
      billFooterMessage: 'Thank you for dining with us! Service was our pleasure.'
    };
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem('restaurantos_settings', JSON.stringify(settings));
      setSaving(false);
      toast.success('Restaurant settings saved successfully!');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242026] dark:text-[#F9F4F8]">
          Restaurant Configuration
        </h2>
        <p className="text-sm text-[#817985] dark:text-[#B4A9B8] mt-1">
          Customize establishment identity, billing calculations, and interface theme.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Establishment Profile Card */}
        <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm">
          <CardHeader className="border-b border-[#EADFE8] dark:border-[#3D2C42] pb-4">
            <CardTitle className="text-base font-bold text-[#242026] dark:text-[#F9F4F8] flex items-center gap-2">
              <Store size={18} className="text-[#400849] dark:text-[#E7B0DE]" />
              Establishment Identity
            </CardTitle>
            <CardDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              General business details displayed on invoices and guest receipts.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Restaurant Name
                </label>
                <Input
                  type="text"
                  name="restaurantName"
                  value={settings.restaurantName}
                  onChange={handleChange}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Tagline / Brand Motto
                </label>
                <Input
                  type="text"
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleChange}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Contact Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Phone Number
                </label>
                <Input
                  type="text"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Street Address
                </label>
                <Input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taxes & Financials */}
        <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm">
          <CardHeader className="border-b border-[#EADFE8] dark:border-[#3D2C42] pb-4">
            <CardTitle className="text-base font-bold text-[#242026] dark:text-[#F9F4F8] flex items-center gap-2">
              <DollarSign size={18} className="text-[#FF5A0A]" />
              Billing & Taxation Rules
            </CardTitle>
            <CardDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              Automated calculations applied to POS tickets and checkout receipts.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  GST / Tax Registration
                </label>
                <Input
                  type="text"
                  name="gstNumber"
                  value={settings.gstNumber}
                  onChange={handleChange}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Default Tax Rate (%)
                </label>
                <Input
                  type="number"
                  name="defaultTaxRate"
                  value={settings.defaultTaxRate}
                  onChange={handleChange}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Currency Symbol
                </label>
                <Input
                  type="text"
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Receipt Footer Message
                </label>
                <Input
                  type="text"
                  name="billFooterMessage"
                  value={settings.billFooterMessage}
                  onChange={handleChange}
                  className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm">
          <CardHeader className="border-b border-[#EADFE8] dark:border-[#3D2C42] pb-4">
            <CardTitle className="text-base font-bold text-[#242026] dark:text-[#F9F4F8] flex items-center gap-2">
              <Sparkles size={18} className="text-[#E7B0DE]" />
              Appearance & Themes
            </CardTitle>
            <CardDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              Switch between Light Mode (Warm Ivory) and Dark Mode (Plum Charcoal).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  theme === 'light'
                    ? 'border-[#400849] bg-[#FFF9F5] ring-2 ring-[#400849]/20'
                    : 'border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#18111B]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Sun size={20} className="text-amber-500" />
                  {theme === 'light' && <CheckCircle2 size={16} className="text-[#400849]" />}
                </div>
                <p className="text-sm font-bold text-[#242026]">Warm Ivory (Light)</p>
                <p className="text-xs text-[#817985] mt-0.5">Classic daytime dining ambiance</p>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  theme === 'dark'
                    ? 'border-[#E7B0DE] bg-[#231826] ring-2 ring-[#E7B0DE]/20'
                    : 'border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#18111B]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Moon size={20} className="text-[#E7B0DE]" />
                  {theme === 'dark' && <CheckCircle2 size={16} className="text-[#E7B0DE]" />}
                </div>
                <p className="text-sm font-bold text-white">Plum Charcoal (Dark)</p>
                <p className="text-xs text-[#B4A9B8] mt-0.5">Low-light service & KDS line comfort</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="h-11 px-8 rounded-xl bg-[#400849] hover:bg-[#5b0c67] text-white font-bold text-sm shadow-md"
          >
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
