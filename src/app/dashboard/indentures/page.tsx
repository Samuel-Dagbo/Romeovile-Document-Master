"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Calendar, CheckCircle, XCircle, FileText, User, MapPin } from "lucide-react";

const demoIndentures = [
  { id: "1", client: "Kwame Asante", plot: "PL-001", location: "Obuasi Municipal", court_oath_date: "2026-02-15", copies_released: true, verification_photo: true },
  { id: "2", client: "Akosua Mensah", plot: "PL-002", location: "Obuasi Municipal", court_oath_date: "2026-02-20", copies_released: false, verification_photo: false },
  { id: "3", client: "Yaw Boateng", plot: "PL-003", location: "Obuasi East", court_oath_date: null, copies_released: false, verification_photo: false },
  { id: "4", client: "Abena Kwarteng", plot: "PL-004", location: "Obuasi West", court_oath_date: "2026-03-01", copies_released: true, verification_photo: true },
  { id: "5", client: "Kofi Osei", plot: "PL-006", location: "Anglo", court_oath_date: "2026-03-05", copies_released: true, verification_photo: false },
];

export default function IndenturesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredIndentures = demoIndentures.filter((indenture) => {
    const matchesSearch = indenture.client.toLowerCase().includes(searchQuery.toLowerCase()) || indenture.plot.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || (statusFilter === "completed" ? indenture.copies_released : !indenture.copies_released);
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Indentures", value: demoIndentures.length },
    { label: "Court Oath Done", value: demoIndentures.filter((i) => i.court_oath_date).length },
    { label: "Copies Released", value: demoIndentures.filter((i) => i.copies_released).length },
    { label: "Pending", value: demoIndentures.filter((i) => !i.court_oath_date).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Indentures</h1>
          <p className="text-muted-foreground mt-1">Manage land indentures and legal documents</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Create Indenture
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-premium p-4 text-center">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search indentures..."
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
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Client</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Plot</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Location</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Court Oath Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {filteredIndentures.map((indenture, index) => (
                <motion.tr
                  key={indenture.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center text-sm font-medium">
                        {indenture.client.charAt(0)}
                      </div>
                      <span className="font-medium">{indenture.client}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium">
                      {indenture.plot}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{indenture.location}</td>
                  <td className="px-6 py-4">
                    {indenture.court_oath_date ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {indenture.court_oath_date}
                      </div>
                    ) : (
                      <span className="text-amber-600 text-sm flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        indenture.copies_released
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                          : "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                      }`}
                    >
                      {indenture.copies_released ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {indenture.copies_released ? "Completed" : "In Progress"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-sm font-medium text-blue-600 hover:underline">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}