"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, CreditCard, Map, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const stats = [
  { title: "Total Clients", value: "1,284", change: "+12.5%", trend: "up", icon: Users, color: "blue" },
  { title: "Total Revenue", value: "₵2.4M", change: "+8.2%", trend: "up", icon: DollarSign, color: "emerald" },
  { title: "Outstanding", value: "₵450K", change: "-2.4%", trend: "down", icon: CreditCard, color: "amber" },
  { title: "Active Plots", value: "856", change: "+5.1%", trend: "up", icon: Map, color: "purple" },
];

const revenueData = [
  { name: "Jan", value: 180000 }, { name: "Feb", value: 220000 }, { name: "Mar", value: 195000 },
  { name: "Apr", value: 280000 }, { name: "May", value: 250000 }, { name: "Jun", value: 320000 },
];

const plotStatusData = [
  { name: "Sold", value: 425, color: "#10b981" },
  { name: "Available", value: 310, color: "#3b82f6" },
  { name: "Reserved", value: 121, color: "#f59e0b" },
];

const recentActivity = [
  { action: "New client registered", user: "Kwame Asante", time: "2 min ago", type: "client" },
  { action: "Payment received", user: "Akosua Mensah", time: "15 min ago", type: "payment" },
  { action: "Document uploaded", user: "Yaw Boateng", time: "1 hour ago", type: "document" },
  { action: "Plot reserved", user: "Abena Kwarteng", time: "2 hours ago", type: "plot" },
  { action: "Indenture completed", user: "Kofi Osei", time: "3 hours ago", type: "indenture" },
];

const colorMap: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
  purple: "from-purple-500 to-purple-600",
};

const iconColorMap: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
};

export default function DashboardPage() {
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
        {stats.map((stat, index) => (
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
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
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
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
        </div>
        <div className="space-y-4">
          {recentActivity.map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className={`w-2 h-2 rounded-full ${item.type === 'payment' ? 'bg-emerald-500' : item.type === 'client' ? 'bg-blue-500' : 'bg-amber-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{item.action}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.user}</p>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}