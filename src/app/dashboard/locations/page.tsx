"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Phone, Mail, FileText } from "lucide-react";
import Link from "next/link";

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<{id: string; full_name: string; location: string; file_number: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients?order=location.asc');
      if (res.status === 401) {
        window.location.href = '/auth/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      (client.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.file_number || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clientsByLocation = filteredClients.reduce((acc, client) => {
    const loc = client.location || 'Unknown';
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(client);
    return acc;
  }, {} as Record<string, typeof filteredClients>);

  const locations = Object.entries(clientsByLocation).map(([name, clients]) => ({
    name,
    count: clients.length,
    clients
  })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Locations</h1>
        <p className="text-muted-foreground mt-1">View clients by their location</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, location or file number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : locations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No clients found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{location.name}</h3>
                  <p className="text-sm text-slate-500">{location.count} client{location.count !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="space-y-2">
                {location.clients.slice(0, 3).map((client) => (
                  <Link
                    key={client.id}
                    href={`/dashboard/clients/${client.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-medium">
                        {(client.full_name || '?').charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{client.full_name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{client.file_number}</span>
                  </Link>
                ))}
                {location.clients.length > 3 && (
                  <p className="text-xs text-slate-500 text-center pt-2">
                    +{location.clients.length - 3} more
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}