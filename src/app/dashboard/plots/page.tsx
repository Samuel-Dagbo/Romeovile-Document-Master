"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  MapPin,
  Home,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const demoPlots = [
  { id: "1", plot_number: "PL-001", acreage: 2.5, status: "sold", location: "Obuasi Municipal", client: "Kwame Asante", plot_picked: true, site_plan_done: true },
  { id: "2", plot_number: "PL-002", acreage: 1.8, status: "sold", location: "Obuasi Municipal", client: "Akosua Mensah", plot_picked: true, site_plan_done: false },
  { id: "3", plot_number: "PL-003", acreage: 3.0, status: "sold", location: "Obuasi East", client: "Yaw Boateng", plot_picked: false, site_plan_done: false },
  { id: "4", plot_number: "PL-004", acreage: 1.5, status: "sold", location: "Obuasi West", client: "Abena Kwarteng", plot_picked: true, site_plan_done: true },
  { id: "5", plot_number: "PL-005", acreage: 2.2, status: "available", location: "Bogoso", client: null, plot_picked: false, site_plan_done: false },
  { id: "6", plot_number: "PL-006", acreage: 1.0, status: "reserved", location: "Anglo", client: "Kofi Osei", plot_picked: true, site_plan_done: false },
];

export default function PlotsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPlots = demoPlots.filter((plot) => {
    const matchesSearch = plot.plot_number.toLowerCase().includes(searchQuery.toLowerCase()) || plot.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || plot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Plots", value: demoPlots.length, color: "text-blue-600" },
    { label: "Sold", value: demoPlots.filter((p) => p.status === "sold").length, color: "text-emerald-600" },
    { label: "Available", value: demoPlots.filter((p) => p.status === "available").length, color: "text-amber-600" },
    { label: "Reserved", value: demoPlots.filter((p) => p.status === "reserved").length, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Plots</h1>
          <p className="text-muted-foreground mt-1">Manage land plots and allocations</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Add Plot
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-premium p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search plots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 outline-none"
        >
          <option value="all">All Status</option>
          <option value="sold">Sold</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlots.map((plot, index) => (
          <motion.div
            key={plot.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="card-premium p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{plot.plot_number}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {plot.location}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  plot.status === "sold"
                    ? "bg-emerald-50 text-emerald-600"
                    : plot.status === "available"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-purple-50 text-purple-600"
                }`}
              >
                {plot.status.charAt(0).toUpperCase() + plot.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Acreage</span>
                <span className="font-medium">{plot.acreage} acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client</span>
                <span className="font-medium">{plot.client || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plot Picked</span>
                <span className={plot.plot_picked ? "text-emerald-600" : "text-amber-600"}>
                  {plot.plot_picked ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Site Plan</span>
                <span className={plot.site_plan_done ? "text-emerald-600" : "text-amber-600"}>
                  {plot.site_plan_done ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}