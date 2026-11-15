import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2,
  RefreshCw,
  Sparkles
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

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'Waiter',
    phone: '',
    status: 'Active'
  });
  const [saving, setSaving] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      setStaffMembers(data.data || []);
    } catch (error) {
      console.error('Error fetching staff list:', error);
      toast.error('Failed to load team directory');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return toast.error('Please enter name and email');
    }

    try {
      setSaving(true);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      setStaffMembers(prev => [data.data, ...prev]);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        role: 'Waiter',
        phone: '',
        status: 'Active'
      });
      toast.success(`Account created for ${formData.name}!`);
    } catch (error) {
      console.error('Error creating staff account:', error);
      toast.error(error.response?.data?.message || 'Failed to create employee');
    } finally {
      setSaving(false);
    }
  };

  const roles = ['All', 'Admin', 'Manager', 'Waiter', 'Chef', 'Cashier'];

  const filteredStaff = staffMembers.filter(member => {
    const matchesRole = selectedRole === 'All' || member.role === selectedRole;
    const matchesSearch = 
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return <Badge className="bg-[#400849] text-white">Admin</Badge>;
      case 'Manager':
        return <Badge className="bg-[#FF5A0A] text-white">Manager</Badge>;
      case 'Waiter':
        return <Badge className="bg-purple-100 text-[#400849] dark:bg-purple-950 dark:text-[#E7B0DE]">Waiter</Badge>;
      case 'Chef':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Chef</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#242026] dark:text-[#F9F4F8]">
            Staff & Team Operations
          </h2>
          <p className="text-sm text-[#817985] dark:text-[#B4A9B8] mt-1">
            Manage employee access, role authorizations, and contact records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={fetchStaff} 
            className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826]"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {user?.role === 'Admin' && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-[#400849] hover:bg-[#5b0c67] text-white font-bold shadow-md"
            >
              <Plus size={18} className="mr-2" />
              Add Team Member
            </Button>
          )}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#231826] border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">Total Staff</p>
            <p className="text-2xl font-black text-[#242026] dark:text-[#F9F4F8] mt-1">{staffMembers.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F9EAF5] dark:bg-[#2E1E33] text-[#400849] dark:text-[#E7B0DE] flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#231826] border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">Active Accounts</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {staffMembers.filter(s => s.status !== 'Inactive').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#231826] border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#817985] dark:text-[#B4A9B8]">Administrative Roles</p>
            <p className="text-2xl font-black text-[#FF5A0A] mt-1">
              {staffMembers.filter(s => ['Admin', 'Manager'].includes(s.role)).length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF5A0A]/10 text-[#FF5A0A] flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#231826] rounded-2xl border border-[#EADFE8] dark:border-[#3D2C42] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#817985]" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedRole === role
                  ? 'bg-[#400849] text-white shadow-sm'
                  : 'text-[#817985] hover:text-[#242026] dark:hover:text-[#F9F4F8] hover:bg-[#F9EAF5] dark:hover:bg-[#2E1E33]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table Card */}
      <Card className="rounded-2xl border-[#EADFE8] dark:border-[#3D2C42] bg-white dark:bg-[#231826] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F5] dark:bg-[#18111B] text-[#817985] dark:text-[#B4A9B8] border-b border-[#EADFE8] dark:border-[#3D2C42] uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role Access</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4">Contact Phone</th>
                  <th className="px-6 py-4">Onboarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFE8] dark:divide-[#3D2C42]">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#817985]">
                      Loading team directory...
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-[#817985]">
                      No staff members found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map(member => (
                    <tr key={member._id} className="hover:bg-[#FFF9F5] dark:hover:bg-[#18111B]/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#400849] to-[#FF5A0A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {member.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-extrabold text-sm text-[#242026] dark:text-[#F9F4F8]">{member.name}</p>
                            <p className="text-xs text-[#817985] dark:text-[#B4A9B8] flex items-center gap-1">
                              <Mail size={11} /> {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {getRoleBadge(member.role)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {member.status || 'Active'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[#817985] dark:text-[#B4A9B8] font-mono">
                        {member.phone || '+1 (555) 0100'}
                      </td>

                      <td className="px-6 py-4 text-[#817985] dark:text-[#B4A9B8]">
                        {new Date(member.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Staff Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#231826] border-[#EADFE8] dark:border-[#3D2C42] rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#242026] dark:text-[#F9F4F8]">
              Onboard Team Member
            </DialogTitle>
            <DialogDescription className="text-xs text-[#817985] dark:text-[#B4A9B8]">
              Create employee account with assigned permissions and role access.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStaffSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                Full Name *
              </label>
              <Input
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                Work Email *
              </label>
              <Input
                type="email"
                required
                placeholder="john@restaurant.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  System Role
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#EADFE8] dark:border-[#3D2C42] bg-[#FFF9F5] dark:bg-[#18111B] text-xs font-medium focus:ring-1 focus:ring-[#400849]"
                >
                  <option value="Waiter">Waiter</option>
                  <option value="Manager">Manager</option>
                  <option value="Chef">Chef</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#242026] dark:text-[#F9F4F8] block mb-1">
                  Phone Number
                </label>
                <Input
                  placeholder="+1 (555) 0123"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
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
                {saving ? 'Creating...' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
