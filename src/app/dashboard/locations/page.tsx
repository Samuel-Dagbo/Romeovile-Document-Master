"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, MapPin, X, Check } from "lucide-react";
import toast from "react-hot-toast";

const demoLocations = [
  { id: "1", name: "Obuasi Municipal", code: "OBM", description: "Main municipal area", plots: 320, clients: 450 },
  { id: "2", name: "Obuasi East", code: "OBE", description: "Eastern district", plots: 210, clients: 280 },
  { id: "3", name: "Obuasi West", code: "OBW", description: "Western district", plots: 180, clients: 320 },
  { id: "4", name: "Anglo", code: "ANG", description: "Anglogold area", plots: 90, clients: 134 },
  { id: "5", name: "Bogoso", code: "BGS", description: "Bogoso township", plots: 56, clients: 100 },
  { id: "6", name: "Prestea", code: "PST", description: "Prestea area", plots: 45, clients: 80 },
];

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredLocations = demoLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Locations</h1>
          <p className="text-muted-foreground mt-1">Manage project locations and areas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-premium p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">Code: {location.code}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{location.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <p className="text-muted-foreground">Plots</p>
                <p className="font-semibold text-lg">{location.plots}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <p className="text-muted-foreground">Clients</p>
                <p className="font-semibold text-lg">{location.clients}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Add New Location</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location Name *</label>
                <input className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Obuasi Central" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">3-Letter Code *</label>
                <input maxLength={3} className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500 uppercase" placeholder="e.g., OBC" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Brief description..." />
              </div>
            </div>
            <div className="p-6 border-t dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success("Location created successfully!");
                  setShowModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Create Location
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}