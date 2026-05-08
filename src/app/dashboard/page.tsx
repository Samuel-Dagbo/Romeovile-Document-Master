"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, CreditCard, Map, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const iconColorMap: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
};

interface Client {
  id: string;
  full_name: string;
  file_number: string;
  total_amount: number;
  balance: number;
  plot_number: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalClients: 0, totalRevenue: 0, outstanding: 0, activePlots: 0 });
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recentRes, allRes] = await Promise.all([
        fetch('/api/clients?limit=5&order=created_at.desc'),
        fetch('/api/clients?limit=1000')
      ]);

      const recentData = await recentRes.json();
      const allClients = await allRes.json();

      const clientList = Array.isArray(allClients) ? allClients : [];

      const totalRevenue = clientList.reduce((sum: number, c: Client) => sum + (c.total_amount || 0), 0);
      const outstanding = clientList.reduce((sum: number, c: Client) => sum + (c.balance || 0), 0);
      const activePlots = clientList.filter((c: Client) => c.plot_number).length;

      setStats({
        totalClients: clientList.length,
        totalRevenue,
        outstanding,
        activePlots
      });

      setRecentClients(Array.isArray(recentData) ? recentData : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { title: "Total Clients", value: stats.totalClients, change: "+12.5%", trend: "up", icon: Users, color: "blue" },
    { title: "Total Revenue", value: stats.totalRevenue, change: "+8.2%", trend: "up", icon: DollarSign, color: "emerald" },
    { title: "Outstanding", value: stats.outstanding, change: "-2.4%", trend: "down", icon: CreditCard, color: "amber" },
    { title: "Active Plots", value: stats.activePlots, change: "+5.1%", trend: "up", icon: Map, color: "purple" },
  ];

  const revenueData = [
    { name: "Jan", value: 180000 }, { name: "Feb", value: 220000 }, { name: "Mar", value: 195000 },
    { name: "Apr", value: 280000 }, { name: "May", value: 250000 }, { name: "Jun", value: 320000 },
  ];

  const plotStatusData = [
    { name: "With Plots", value: stats.activePlots, color: "#10b981" },
    { name: "Without Plots", value: Math.max(0, stats.totalClients - stats.activePlots), color: "#3b82f6" },
  ];

  const formatValue = (val: number, title: string) => {
    if (title === "Total Revenue" || title === "Outstanding") {
      if (val >= 1000000) return `₵${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `₵${(val / 1000).toFixed(0)}K`;
      return `₵${val}`;
    }
    return val.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Activity className="w-4 h-4" />
          Last updated: Just now
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${iconColorMap[stat.color]}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-amber-600"}`}>
                {stat.trend === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatValue(stat.value, stat.title)}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Trend</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monthly revenue overview</p>
            </div>
            <select className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `₵${v/1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }} formatter={(v) => [`₵${Number(v).toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Plot Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Plot Status</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={plotStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {plotStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-4">
            {plotStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Clients</h2>
          <a href="/dashboard/clients" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</a>
        </div>
        <div className="space-y-4">
          {recentClients.length === 0 ? (
            <p className="text-center text-slate-500 py-4">No clients found</p>
          ) : (
            recentClients.map((client, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-medium">
                  {client.full_name?.charAt(0) || '?'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{client.full_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{client.file_number || 'No file number'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${client.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {client.status || 'inactive'}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}