import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import Tables from './pages/Tables';
import Orders from './pages/Orders';
import Kitchen from './pages/Kitchen';
import Menu from './pages/Menu';
import NewOrder from './pages/NewOrder';
import Inventory from './pages/Inventory';
import Staff from './pages/Staff';
import Settings from './pages/Settings';
import OrderDetail from './pages/OrderDetail';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tables" element={<Tables />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/new" element={<NewOrder />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="kitchen" element={<Kitchen />} />
                <Route path="menu" element={<Menu />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="staff" element={<Staff />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
