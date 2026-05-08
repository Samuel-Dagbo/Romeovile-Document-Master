"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Shield, Clock, UserCheck, UserX, Edit3, Save, X, Mail } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  approved: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ full_name: string; role: string; approved: boolean } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/rest/v1/users?select=*`, {
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}` }
      });
      const data = await res.json();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditData({ full_name: user.full_name, role: user.role, approved: user.approved });
  };

  const handleSave = async (userId: string) => {
    if (!editData) return;

    try {
      const res = await fetch(`${API_URL}/rest/v1/users?id=eq.${userId}`, {
        method: 'PATCH',
        headers: {
          'apikey': API_KEY,
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          full_name: editData.full_name,
          role: editData.role,
          approved: editData.approved
        })
      });

      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, ...editData } : u));
        setEditingUser(null);
        setEditData(null);
        toast.success("User updated successfully!");
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await fetch(`${API_URL}/rest/v1/users?id=eq.${userId}`, {
        method: 'PATCH',
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', approved: true })
      });
      setUsers(users.map(u => u.id === userId ? { ...u, role: 'admin', approved: true } : u));
      toast.success("User approved and promoted to admin!");
    } catch {
      toast.error("Failed to approve user");
    }
  };

  const handleRevoke = async (userId: string) => {
    try {
      await fetch(`${API_URL}/rest/v1/users?id=eq.${userId}`, {
        method: 'PATCH',
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'pending', approved: false })
      });
      setUsers(users.map(u => u.id === userId ? { ...u, role: 'pending', approved: false } : u));
      toast.success("User access revoked");
    } catch {
      toast.error("Failed to revoke access");
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage user access and approvals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: Shield, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600" },
          { label: "Admins", value: users.filter(u => u.role === 'admin' && u.approved).length, icon: UserCheck, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" },
          { label: "Pending", value: users.filter(u => !u.approved).length, icon: Clock, color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{user.full_name?.charAt(0) || 'U'}</span>
                      </div>
                      <div>
                        {editingUser === user.id ? (
                          <input
                            type="text"
                            value={editData?.full_name || ''}
                            onChange={(e) => setEditData({ ...editData!, full_name: e.target.value })}
                            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                          />
                        ) : (
                          <p className="font-medium text-slate-900 dark:text-white">{user.full_name || 'Unknown'}</p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === user.id ? (
                      <select
                        value={editData?.role || 'pending'}
                        onChange={(e) => setEditData({ ...editData!, role: e.target.value })}
                        className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                      >
                        <option value="admin">Admin</option>
                        <option value="pending">Pending</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingUser === user.id ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData?.approved || false}
                          onChange={(e) => setEditData({ ...editData!, approved: e.target.checked })}
                          className="rounded border-slate-300"
                        />
                        <span className="text-sm">Approved</span>
                      </label>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.approved ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                      }`}>
                        {user.approved ? 'Approved' : 'Pending'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {editingUser === user.id ? (
                        <>
                          <button onClick={() => handleSave(user.id)} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setEditingUser(null); setEditData(null); }} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(user)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {!user.approved ? (
                            <button onClick={() => handleApprove(user.id)} className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600" title="Approve">
                              <UserCheck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button onClick={() => handleRevoke(user.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Revoke">
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}