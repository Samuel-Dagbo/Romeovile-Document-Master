"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, User, Phone, Mail, MapPin, FileText, X, ChevronRight, Building2, Calendar
} from "lucide-react";
import toast from "react-hot-toast";

const demoClients = [
  { id: "1", file_number: "RV-OBM-26-001", full_name: "Kwame Asante", phone: "+233501234567", email: "kwame@email.com", address: "Obuasi Central", status: "active", plots: 2 },
  { id: "2", file_number: "RV-OBM-26-002", full_name: "Akosua Mensah", phone: "+233502345678", email: "akosua@email.com", address: "Anglogold Estate", status: "active", plots: 1 },
  { id: "3", file_number: "RV-OBE-26-001", full_name: "Yaw Boateng", phone: "+233503456789", email: "yaw@email.com", address: "Obuasi East", status: "active", plots: 1 },
  { id: "4", file_number: "RV-OBW-26-001", full_name: "Abena Kwarteng", phone: "+233504567890", email: "abena@email.com", address: "Obuasi West", status: "active", plots: 3 },
  { id: "5", file_number: "RV-ANG-26-001", full_name: "Kofi Osei", phone: "+233505678901", email: "kofi@email.com", address: "Anglo Area", status: "inactive", plots: 1 },
  { id: "6", file_number: "RV-BGS-26-001", full_name: "Efua Darko", phone: "+233506789012", email: "efua@email.com", address: "Bogoso Central", status: "active", plots: 2 },
  { id: "7", file_number: "RV-PST-26-001", full_name: "Kwesi Asamoah", phone: "+233507890123", email: "kwesi@email.com", address: "Prestea Township", status: "active", plots: 1 },
];

export default function ClientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients?order=created_at.desc');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const [newClient, setNewClient] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
    location: "",
    total_amount: "",
    plot_number: "",
    plot_size: "",
    site_plan: false,
    site_plan_signed: false,
  });

  const searchResults = searchQuery.length > 0 
    ? clients.filter(client => 
        (client.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.file_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.phone || '').includes(searchQuery)
      ).slice(0, 5)
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClientClick = (clientId: string) => {
    setShowDropdown(false);
    setSearchQuery("");
    router.push(`/dashboard/clients/${clientId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clients</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your clients and their properties</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Search Bar with Dropdown */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients by name, file number, or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-base"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowDropdown(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showDropdown && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden z-50"
            >
              <div className="p-2">
                <p className="text-xs font-medium text-slate-400 px-3 py-2">
                  {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
                </p>
                {searchResults.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleClientClick(client.id)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {(client.full_name || '?').charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-white truncate">
                          {client.full_name || 'Unknown'}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          client.status === 'active' 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                        }`}>
                          {client.status || 'inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono">{client.file_number || 'N/A'}</span>
                        <span>•</span>
                        <span>{client.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span>{client.address || client.location || 'N/A'}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                <Link 
                  href="/dashboard/clients" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
                  onClick={() => {
                    setShowDropdown(false);
                    setSearchQuery("");
                  }}
                >
                  View all clients
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}

          {showDropdown && searchResults.length === 0 && searchQuery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <p className="font-medium text-slate-900 dark:text-white">No clients found</p>
              <p className="text-sm text-slate-500 mt-1">Try searching with a different term</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Clients</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{clients.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{clients.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Inactive</p>
          <p className="text-2xl font-bold text-slate-600 mt-1">{clients.filter(c => c.status !== 'active').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">With Plots</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{clients.filter(c => c.plot_number).length}</p>
        </div>
      </div>

      {/* All Clients Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">All Clients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">File Number</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Location</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Loading clients...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No clients found</td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/clients/${client.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">{(client.full_name || '?').charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{client.full_name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{client.plot_number ? '1 plot' : 'No plot'}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                        {client.file_number || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm">
                        <p className="text-slate-600 dark:text-slate-400">{client.phone || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-500">
                      {client.address || client.location || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        client.status === 'active' 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {client.status || 'inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/clients/${client.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Client</h2>
                      <p className="text-sm text-slate-500">Create a new client record</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={newClient.full_name}
                      onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
                      placeholder="Enter full name"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                        placeholder="+233501234567"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                      value={newClient.address}
                      onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                      placeholder="Enter full address"
                      rows={2}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={newClient.location}
                        onChange={(e) => setNewClient({ ...newClient, location: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
                      >
                        <option value="">Select location</option>
                        <option value="Obuasi Municipal">Obuasi Municipal</option>
                        <option value="Obuasi East">Obuasi East</option>
                        <option value="Obuasi West">Obuasi West</option>
                        <option value="Anglogold Estate">Anglogold Estate</option>
                        <option value="Bogoso">Bogoso</option>
                        <option value="Prestea">Prestea</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Total Amount (₵)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={newClient.total_amount}
                        onChange={(e) => setNewClient({ ...newClient, total_amount: e.target.value })}
                        placeholder="150000"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Site Plan Details
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Site Plan</label>
                      <select
                        value={newClient.site_plan ? "true" : "false"}
                        onChange={(e) => setNewClient({ ...newClient, site_plan: e.target.value === "true" })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Plot No</label>
                      <input
                        type="text"
                        value={newClient.plot_number}
                        onChange={(e) => setNewClient({ ...newClient, plot_number: e.target.value })}
                        placeholder="PL-001"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Plot Size (acres)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newClient.plot_size}
                        onChange={(e) => setNewClient({ ...newClient, plot_size: e.target.value })}
                        placeholder="2.5"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Site Plan Signed</label>
                      <select
                        value={newClient.site_plan_signed ? "true" : "false"}
                        onChange={(e) => setNewClient({ ...newClient, site_plan_signed: e.target.value === "true" })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!newClient.full_name || !newClient.phone) {
                      toast.error("Please fill in required fields");
                      return;
                    }
                    
                    try {
                      const res = await fetch('/api/clients', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          full_name: newClient.full_name,
                          phone: newClient.phone,
                          email: newClient.email,
                          address: newClient.address,
                          file_number: `RV-${Date.now().toString().slice(-6)}`,
                          total_amount: parseFloat(newClient.total_amount) || 0,
                          balance: parseFloat(newClient.total_amount) || 0,
                          status: 'active',
                          signup_date: new Date().toISOString().split('T')[0],
                          plot_number: newClient.plot_number || null,
                          plot_size: newClient.plot_size ? parseFloat(newClient.plot_size) : null,
                          site_plan_done: newClient.site_plan,
                          site_plan_signed: newClient.site_plan_signed
                        })
                      });
                      
                      if (!res.ok) throw new Error('Failed to create client');
                      
                      toast.success("Client created successfully!");
                      setShowAddModal(false);
                      setNewClient({ full_name: "", phone: "", email: "", address: "", location: "", total_amount: "", plot_number: "", plot_size: "", site_plan: false, site_plan_signed: false });
                      fetchClients();
                    } catch (error) {
                      console.error('Error creating client:', error);
                      toast.error("Failed to create client");
                    }
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Client
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}