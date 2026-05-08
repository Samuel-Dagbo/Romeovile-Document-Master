"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Building2,
  User,
  FileText,
} from "lucide-react";

interface Client {
  id: string;
  full_name: string;
  file_number: string;
  plot_number: string;
  plot_size: number;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function PlotsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_URL}/rest/v1/clients?select=id,full_name,file_number,plot_number,plot_size,status&plot_number=not.is.null`, {
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}` }
      });
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) => {
    const search = searchQuery.toLowerCase();
    return client.full_name?.toLowerCase().includes(search) ||
           client.file_number?.toLowerCase().includes(search) ||
           client.plot_number?.toLowerCase().includes(search);
  });

  const stats = [
    { label: "Total Clients", value: clients.length, color: "text-blue-600" },
    { label: "With Plots", value: clients.filter((c) => c.plot_number).length, color: "text-emerald-600" },
    { label: "No Plots", value: clients.filter((c) => !c.plot_number).length, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Client Plots</h1>
          <p className="text-muted-foreground mt-1">View plot assignments per client</p>
        </div>
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
            placeholder="Search by plot number, location, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : filteredClients.length === 0 ? (
          <p className="text-muted-foreground col-span-3">No clients with plots found</p>
        ) : (
          filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{client.full_name}</h3>
                    <p className="text-xs text-muted-foreground">{client.file_number}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Plot No
                  </span>
                  <span className="font-medium">{client.plot_number || "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Plot Size
                  </span>
                  <span className="font-medium">{client.plot_size ? `${client.plot_size} acres` : "—"}</span>
                </div>
                <Link 
                  href={`/dashboard/clients/${client.id}`}
                  className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:underline mt-2 pt-2 border-t"
                >
                  <FileText className="w-3.5 h-3.5" /> View Full Profile
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}