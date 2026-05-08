"use client";

import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Map,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const monthlyData = [
  { month: "Jan", clients: 45, revenue: 180000 },
  { month: "Feb", clients: 62, revenue: 220000 },
  { month: "Mar", clients: 58, revenue: 195000 },
  { month: "Apr", clients: 78, revenue: 280000 },
  { month: "May", clients: 65, revenue: 250000 },
  { month: "Jun", clients: 89, revenue: 320000 },
  { month: "Jul", clients: 72, revenue: 290000 },
  { month: "Aug", clients: 95, revenue: 350000 },
  { month: "Sep", clients: 82, revenue: 310000 },
  { month: "Oct", clients: 98, revenue: 380000 },
  { month: "Nov", clients: 88, revenue: 340000 },
  { month: "Dec", clients: 105, revenue: 410000 },
];

const clientStatusData = [
  { name: "Active", value: 850, color: "#10b981" },
  { name: "Inactive", value: 320, color: "#64748b" },
  { name: "Suspended", value: 114, color: "#ef4444" },
];

const paymentMethodData = [
  { name: "Bank Transfer", value: 45, color: "#3b82f6" },
  { name: "Cash", value: 30, color: "#10b981" },
  { name: "Mobile Money", value: 20, color: "#8b5cf6" },
  { name: "Cheque", value: 5, color: "#f59e0b" },
];

const locationPerformance = [
  { location: "OBM", clients: 450, revenue: 1200000 },
  { location: "OBE", clients: 280, revenue: 850000 },
  { location: "OBW", clients: 320, revenue: 950000 },
  { location: "ANG", clients: 134, revenue: 420000 },
  { location: "BGS", clients: 100, revenue: 350000 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive insights and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Clients", value: "1,284", change: "+12.5%", trend: "up", icon: Users, color: "from-blue-500 to-blue-600" },
          { title: "Total Revenue", value: "₵3,245,000", change: "+18.2%", trend: "up", icon: DollarSign, color: "from-emerald-500 to-emerald-600" },
          { title: "Active Plots", value: "856", change: "+5.1%", trend: "up", icon: Map, color: "from-purple-500 to-purple-600" },
          { title: "Documents", value: "3,420", change: "+8.7%", trend: "up", icon: FileText, color: "from-amber-500 to-amber-600" },
        ].map((stat) => (
          <div key={stat.title} className="card-premium p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"} flex items-center gap-1`}>
                {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Client Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₵${v / 1000}k`} />
              <Tooltip formatter={(v) => [`₵${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold mb-6">Client Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Bar dataKey="clients" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold mb-6">Client Status Distribution</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={clientStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {clientStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {clientStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold mb-6">Payment Methods</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {paymentMethodData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Performance */}
      <div className="card-premium p-6">
        <h2 className="text-lg font-semibold mb-6">Location Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationPerformance} layout="vertical" barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₵${v / 1000}k`} />
            <YAxis dataKey="location" type="category" stroke="#94a3b8" fontSize={12} width={60} />
            <Tooltip formatter={(v, name) => [name === "revenue" ? `₵${Number(v).toLocaleString()}` : v, name === "revenue" ? "Revenue" : "Clients"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
            <Bar dataKey="clients" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}