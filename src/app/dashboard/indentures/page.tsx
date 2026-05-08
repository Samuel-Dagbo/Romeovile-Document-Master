"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  User,
  Building2,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  ScrollText,
} from "lucide-react";

interface Client {
  id: string;
  full_name: string;
  file_number: string;
  plot_number: string;
  number_of_indentures: number;
  indenture_done: boolean;
  indenture_date: string;
  site_plan_signed: boolean;
  indenture_signed: boolean;
  boss_signed: boolean;
  court_signed: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function IndenturesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Get all clients - show all
      const res = await fetch(`${API_URL}/rest/v1/clients?select=id,full_name,file_number,plot_number,plot_size,number_of_indentures,indenture_done,indenture_date,indenture_signed,boss_signed,court_signed`, {
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}` }
      });
      const data = await res.json();
      console.log('Clients data:', data);
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
           (client.plot_number && client.plot_number.toLowerCase().includes(search));
  });

  const stats = [
    { label: "Total Clients", value: clients.length },
    { label: "Indentures Done", value: clients.filter((c) => c.indenture_done).length },
    { label: "All Signed", value: clients.filter((c) => c.indenture_signed && c.boss_signed && c.court_signed).length },
    { label: "Pending", value: clients.filter((c) => !c.indenture_done || !c.indenture_signed || !c.boss_signed || !c.court_signed).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Indentures</h1>
          <p className="text-muted-foreground mt-1">Client indenture status</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-premium p-4 text-center">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by client name, file number, or plot..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : filteredClients.length === 0 ? (
        <p className="text-muted-foreground">No clients found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <ScrollText className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{client.full_name}</h3>
                  <p className="text-xs text-muted-foreground">{client.file_number}</p>
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
                  <span className="text-muted-foreground">No. of Indentures</span>
                  <span className="font-medium">{client.number_of_indentures || 1}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Date
                  </span>
                  <span className="font-medium">{client.indenture_date || "—"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-medium ${client.indenture_done ? "text-emerald-600" : "text-amber-600"}`}>
                    {client.indenture_done ? "Complete" : "Pending"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <div className={`text-center p-2 rounded-lg ${client.site_plan_signed ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-slate-50 dark:bg-slate-800"}`}>
                    {client.site_plan_signed ? <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-400 mx-auto" />}
                    <p className="text-xs mt-1">SP</p>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${client.indenture_signed ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-slate-50 dark:bg-slate-800"}`}>
                    {client.indenture_signed ? <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-400 mx-auto" />}
                    <p className="text-xs mt-1">DP</p>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${client.boss_signed ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-slate-50 dark:bg-slate-800"}`}>
                    {client.boss_signed ? <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-400 mx-auto" />}
                    <p className="text-xs mt-1">BS</p>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${client.court_signed ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-slate-50 dark:bg-slate-800"}`}>
                    {client.court_signed ? <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-400 mx-auto" />}
                    <p className="text-xs mt-1">CT</p>
                  </div>
                </div>
                <Link 
                  href={`/dashboard/clients/${client.id}`}
                  className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:underline mt-2 pt-2 border-t"
                >
                  <FileText className="w-3.5 h-3.5" /> View Full Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}