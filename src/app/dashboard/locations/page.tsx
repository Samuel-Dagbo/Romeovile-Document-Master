"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, MapPin, X, Check, Save } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface Location {
  id: string;
  name: string;
  code: string;
  description: string;
  plots_count: number;
  clients_count: number;
}

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_URL}/rest/v1/locations?select=*&order=name.asc`, {
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}` }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setLocations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const description = formData.get('description') as string;

    try {
      const res = await fetch(`${API_URL}/rest/v1/locations`, {
        method: 'POST',
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ name, code: code.toUpperCase(), description })
      });
      if (!res.ok) throw new Error('Failed to create');
      toast.success("Location created successfully!");
      setShowModal(false);
      fetchLocations();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to create location");
    }
  };

  const handleUpdateLocation = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/rest/v1/locations?id=eq.${id}`, {
        method: 'PATCH',
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ name: editForm.name, code: editForm.code.toUpperCase(), description: editForm.description })
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success("Location updated!");
      setEditingId(null);
      fetchLocations();
    } catch (error) {
      toast.error("Failed to update location");
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      const res = await fetch(`${API_URL}/rest/v1/locations?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}`, 'Prefer': 'return=minimal' }
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success("Location deleted!");
      fetchLocations();
    } catch (error) {
      toast.error("Failed to delete location");
    }
  };

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.code || '').toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="col-span-3 text-center py-8">Loading...</p>
        ) : filteredLocations.length === 0 ? (
          <p className="col-span-3 text-center py-8 text-muted-foreground">No locations found</p>
        ) : (
          filteredLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-6 group"
            >
              {editingId === location.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 text-sm"
                    placeholder="Location name"
                  />
                  <input
                    type="text"
                    maxLength={3}
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 text-sm uppercase"
                    placeholder="Code"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 text-sm"
                    rows={2}
                    placeholder="Description"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateLocation(location.id)} className="flex-1 p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center gap-1">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                      <button onClick={() => { setEditingId(location.id); setEditForm({ name: location.name, code: location.code, description: location.description }); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteLocation(location.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{location.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <p className="text-muted-foreground">Plots</p>
                      <p className="font-semibold text-lg">{location.plots_count || 0}</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <p className="text-muted-foreground">Clients</p>
                      <p className="font-semibold text-lg">{location.clients_count || 0}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Add Modal */}
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
            <form onSubmit={handleAddLocation} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location Name *</label>
                <input name="name" required className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Obuasi Central" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">3-Letter Code *</label>
                <input name="code" required maxLength={3} className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500 uppercase" placeholder="e.g., OBC" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea name="description" className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Brief description..." />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Create Location
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}