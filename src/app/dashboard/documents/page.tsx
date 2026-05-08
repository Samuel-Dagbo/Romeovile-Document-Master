"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Upload, FileText, Image, Download, Trash2, Eye, FolderOpen, X } from "lucide-react";
import toast from "react-hot-toast";

const demoDocuments = [
  { id: "1", title: "Land Agreement - Kwame Asante", type: "agreement", file_type: "pdf", size: "2.4 MB", client: "Kwame Asante", uploaded: "2026-01-20" },
  { id: "2", title: "Payment Receipt #TRX001", type: "receipt", file_type: "pdf", size: "156 KB", client: "Kwame Asante", uploaded: "2026-01-25" },
  { id: "3", title: "Site Plan - PL-001", type: "site_plan", file_type: "image", size: "4.2 MB", client: "Kwame Asante", uploaded: "2026-02-01" },
  { id: "4", title: "Land Agreement - Akosua Mensah", type: "agreement", file_type: "pdf", size: "1.8 MB", client: "Akosua Mensah", uploaded: "2026-01-22" },
  { id: "5", title: "ID Verification - Yaw Boateng", type: "image", file_type: "image", size: "890 KB", client: "Yaw Boateng", uploaded: "2026-02-05" },
  { id: "6", title: "Payment Receipt #TRX003", type: "receipt", file_type: "pdf", size: "120 KB", client: "Akosua Mensah", uploaded: "2026-02-10" },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dragActive, setDragActive] = useState(false);

  const filteredDocs = demoDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    if (type === "pdf") return <FileText className="w-8 h-8 text-red-500" />;
    if (type === "image") return <Image className="w-8 h-8 text-blue-500" />;
    return <FileText className="w-8 h-8 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground mt-1">Manage all client documents and files</p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
          dragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700 hover:border-blue-400"
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={() => {
          setDragActive(false);
          toast.success("Upload feature coming soon - Cloudinary integration");
        }}
      >
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        <p className="font-medium mb-1">Drop files here to upload</p>
        <p className="text-sm text-muted-foreground">Supports PDF, JPG, PNG (Max 10MB)</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800 outline-none"
        >
          <option value="all">All Types</option>
          <option value="agreement">Agreement</option>
          <option value="receipt">Receipt</option>
          <option value="site_plan">Site Plan</option>
          <option value="image">Image</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc, index) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="card-premium p-4 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                {getIcon(doc.file_type)}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h4 className="font-medium text-sm mb-1 truncate">{doc.title}</h4>
            <p className="text-xs text-muted-foreground mb-2">{doc.client}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{doc.uploaded}</span>
              <span>{doc.size}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}