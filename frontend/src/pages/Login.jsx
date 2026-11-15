import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  ChefHat, 
  ShoppingBag, 
  Table as TableIcon,
  Sun,
  Moon,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Login = () => {
  const [email, setEmail] = useState('admin@restaurant.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  const handleQuickLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setLoading(true);
    const res = await login(demoEmail, 'password123');
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Quick login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FFF9F5] dark:bg-[#18111B] text-[#242026] dark:text-[#F9F4F8] transition-colors relative overflow-hidden">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-white/80 dark:bg-[#231826]/80 backdrop-blur"
        >
          {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-[#400849]" />}
        </Button>
      </div>

      {/* Left Feature Showcase Banner (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#400849] via-[#2F0636] to-[#1E0323] p-12 flex-col justify-between relative overflow-hidden text-white">
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FF5A0A]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#E7B0DE]/20 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF5A0A] to-[#E7B0DE] flex items-center justify-center text-white shadow-xl shadow-[#FF5A0A]/30">
            <UtensilsCrossed size={24} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight leading-none text-white">
              Restaurant<span className="text-[#FF5A0A]">OS</span>
            </span>
            <p className="text-xs uppercase font-semibold tracking-widest text-[#E7B0DE]/80 mt-0.5">
              Next-Gen Hospitality OS
            </p>
          </div>
        </div>

        {/* Hero Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#E7B0DE]">
            <Sparkles size={14} className="text-[#FF5A0A]" />
            <span>Powering Intelligent Dining Experiences</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white">
            Where culinary passion meets operational perfection.
          </h1>

          <p className="text-base text-[#F9EAF5]/80 font-normal leading-relaxed">
            Unify point of sale, floor seating, kitchen queue synchronization, and real-time food inventory in one seamless system.
          </p>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShoppingBag size={20} className="text-[#FF5A0A] mb-2" />
              <p className="text-xs font-bold text-white">Fast POS Terminal</p>
              <p className="text-[10px] text-[#E7B0DE]/70 mt-0.5">Instant table billing</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ChefHat size={20} className="text-[#E7B0DE] mb-2" />
              <p className="text-xs font-bold text-white">Live Kitchen KDS</p>
              <p className="text-[10px] text-[#E7B0DE]/70 mt-0.5">Real-time prep sync</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <TableIcon size={20} className="text-amber-400 mb-2" />
              <p className="text-xs font-bold text-white">Floor Seating</p>
              <p className="text-[10px] text-[#E7B0DE]/70 mt-0.5">Dynamic table status</p>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="relative z-10 flex items-center justify-between text-xs text-[#E7B0DE]/60 border-t border-white/10 pt-4">
          <span>Enterprise Hospitality Standard</span>
          <span>© 2026 RestaurantOS Inc.</span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-7">
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5A0A] to-[#E7B0DE] flex items-center justify-center text-white">
              <UtensilsCrossed size={22} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#400849] dark:text-white">
              Restaurant<span className="text-[#FF5A0A]">OS</span>
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242026] dark:text-[#F9F4F8]">
              Welcome back
            </h2>
            <p className="text-sm text-[#817985] dark:text-[#B4A9B8] mt-1.5">
              Enter your credentials or choose a quick demo role to enter.
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">
              Quick Demo Accounts:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@restaurant.com')}
                className="py-2.5 px-3 rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] hover:border-[#400849] dark:hover:border-[#E7B0DE] text-left transition-all hover:scale-[1.02]"
              >
                <span className="block text-xs font-bold text-[#400849] dark:text-[#E7B0DE]">Admin</span>
                <span className="text-[10px] text-[#817985] dark:text-[#B4A9B8] block">Full access</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('manager@restaurant.com')}
                className="py-2.5 px-3 rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] hover:border-[#400849] dark:hover:border-[#E7B0DE] text-left transition-all hover:scale-[1.02]"
              >
                <span className="block text-xs font-bold text-[#400849] dark:text-[#E7B0DE]">Manager</span>
                <span className="text-[10px] text-[#817985] dark:text-[#B4A9B8] block">Operations</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('waiter@restaurant.com')}
                className="py-2.5 px-3 rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] hover:border-[#400849] dark:hover:border-[#E7B0DE] text-left transition-all hover:scale-[1.02]"
              >
                <span className="block text-xs font-bold text-[#400849] dark:text-[#E7B0DE]">Waiter</span>
                <span className="text-[10px] text-[#817985] dark:text-[#B4A9B8] block">Orders & Tables</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#EADFE8] dark:border-[#3D2C42]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#FFF9F5] dark:bg-[#18111B] px-3 text-[#817985] dark:text-[#B4A9B8] font-semibold">
                Or sign in with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#817985]" />
                <Input
                  type="email"
                  required
                  placeholder="admin@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] focus-visible:ring-[#400849] dark:focus-visible:ring-[#E7B0DE]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#817985]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] focus-visible:ring-[#400849] dark:focus-visible:ring-[#E7B0DE]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#400849] hover:bg-[#520c5d] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>{loading ? 'Authenticating...' : 'Sign in to Dashboard'}</span>
              {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
