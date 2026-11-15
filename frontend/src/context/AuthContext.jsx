import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed && parsed.token) {
          setUser(parsed);
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        } else {
          localStorage.removeItem('userInfo');
        }
      }
    } catch (e) {
      console.warn('Invalid user session in localStorage, clearing...', e);
      localStorage.removeItem('userInfo');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      if (data.success) {
        setUser(data.data);
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-[#FFF9F5] dark:bg-[#18111B] text-[#400849] dark:text-[#E7B0DE]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#400849] border-t-transparent dark:border-[#E7B0DE] dark:border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold tracking-wider uppercase opacity-80">Loading RestaurantOS...</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
