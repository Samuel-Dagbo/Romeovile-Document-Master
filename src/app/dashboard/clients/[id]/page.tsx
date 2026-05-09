"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, FileText, CreditCard,
  Activity, Map, Edit3, Upload, Trash2, Download, Eye, CheckCircle2,
  Clock, Save, Building2, DollarSign, ScrollText, User, Home, FileCheck,
  ChevronDown, ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";

interface Plot {
  id: string;
  plot_number: string;
  acreage: number;
  status: string;
}

const documents = [
  { id: "1", title: "Land Agreement", type: "agreement", date: "2026-01-20", size: "2.4 MB" },
  { id: "2", title: "Payment Receipt #TRX001", type: "receipt", date: "2026-01-25", size: "156 KB" },
  { id: "3", title: "Site Plan", type: "site_plan", date: "2026-02-01", size: "4.2 MB" },
];

const payments = [
  { id: "1", amount: 50000, method: "Bank Transfer", reference: "TRX001", date: "2026-01-25", status: "completed" },
  { id: "2", amount: 50000, method: "Cash", reference: "CSH001", date: "2026-02-15", status: "completed" },
];

const activities = [
  { id: "1", action: "Client created", description: "Client added to system", date: "2026-01-15 10:30", type: "create" },
  { id: "2", action: "Payment received", description: "₵50,000 via Bank Transfer", date: "2026-01-25 14:20", type: "payment" },
  { id: "3", action: "Plot assigned", description: "Plot PL-001 assigned", date: "2026-01-26 09:15", type: "plot" },
];

export default function ClientProfilePage() {
  const params = useParams();
  const clientId = params?.id as string || '';
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<any>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    client: true,
    siteplan: true,
    indenture: true,
    payments: true,
    documents: false,
    activity: false
  });

  const [editData, setEditData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    file_number: '',
    location: '',
    signup_date: '',
    total_amount: 0,
    balance: 0,
    status: 'active',
    plot_number: '',
    plot_size: '',
    plot_location: '',
    site_plan_done: false,
    site_plan_signed: false,
    number_of_indentures: 1,
    indenture_done: false,
    indenture_date: '',
    indenture_signed: false,
    deponent_signed: false,
    boss_signed: false,
    court_signed: false
  });

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const fetchClient = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients?id=${clientId}`);
      const data = await res.json();
      
      if (!res.ok || data.error) {
        console.error('API error:', data.error);
        setLoading(false);
        return;
      }
      
      if (data && data.length > 0) {
        const client = data[0];
        setClientData(client);
        setEditData({
          full_name: client.full_name || '',
          phone: client.phone || '',
          email: client.email || '',
          address: client.address || '',
          file_number: client.file_number || '',
          location: client.location || '',
          signup_date: client.signup_date || '',
          total_amount: client.total_amount || 0,
          balance: client.balance || 0,
          status: client.status || 'active',
          plot_number: client.plot_number || '',
          plot_size: client.plot_size?.toString() || '',
          plot_location: client.plot_location || '',
          site_plan_done: client.site_plan_done || false,
          site_plan_signed: client.site_plan_signed || false,
          number_of_indentures: client.number_of_indentures || 1,
          indenture_done: client.indenture_done || false,
          indenture_date: client.indenture_date || '',
          indenture_signed: client.indenture_signed || false,
          deponent_signed: client.deponent_signed || false,
          boss_signed: client.boss_signed || false,
          court_signed: client.court_signed || false
        });
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/clients?id=${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: editData.full_name,
          phone: editData.phone,
          email: editData.email,
          address: editData.address,
          plot_number: editData.plot_number,
          plot_size: editData.plot_size ? parseFloat(editData.plot_size) : null,
          plot_location: editData.plot_location,
          site_plan_done: editData.site_plan_done,
          site_plan_signed: editData.site_plan_signed,
          number_of_indentures: editData.number_of_indentures,
          indenture_done: editData.indenture_done,
          indenture_date: editData.indenture_date || null,
          indenture_signed: editData.indenture_signed,
          deponent_signed: editData.deponent_signed,
          boss_signed: editData.boss_signed,
          court_signed: editData.court_signed
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        console.error('Save error:', data);
        throw new Error(data.error || 'Failed to save');
      }
      
      setIsEditing(false);
      toast.success("All changes saved successfully!");
      fetchClient();
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error(error.message || "Failed to save. Please try again.");
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Link href="/dashboard/clients" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? "Cancel" : "Edit"}
          </button>
          {isEditing && (
            <button 
              onClick={handleSave} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save All
            </button>
          )}
        </div>
      </div>

      {/* Client Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold shadow-lg">
            {(editData.full_name || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              {isEditing ? (
                <input 
                  type="text" 
                  value={editData.full_name} 
                  onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} 
                  className="text-2xl font-bold bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white placeholder-white/50" 
                />
              ) : (
                <h1 className="text-2xl font-bold">{editData.full_name || 'Unknown'}</h1>
              )}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${editData.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {(editData.status || 'inactive').charAt(0).toUpperCase() + (editData.status || 'inactive').slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 bg-white/10 rounded text-sm font-mono">{editData.file_number || 'N/A'}</span>
              <span className="text-white/50">•</span>
              <span className="text-sm text-white/70">{editData.location || 'No location'}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50">Phone</p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    value={editData.phone} 
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })} 
                    className="w-full bg-transparent border-b border-white/20 text-sm pb-1" 
                  />
                ) : (
                  <p className="text-sm font-medium">{editData.phone || 'N/A'}</p>
                )}
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50">Email</p>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={editData.email} 
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })} 
                    className="w-full bg-transparent border-b border-white/20 text-sm pb-1" 
                  />
                ) : (
                  <p className="text-sm font-medium truncate">{editData.email || 'N/A'}</p>
                )}
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50">Joined</p>
                <p className="text-sm font-medium">{editData.signup_date || 'N/A'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-white/50">Address</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={editData.address} 
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })} 
                    className="w-full bg-transparent border-b border-white/20 text-sm pb-1" 
                  />
                ) : (
                  <p className="text-sm font-medium truncate">{editData.address || 'N/A'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">Total Amount</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">₵{(editData.total_amount || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <CreditCard className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm text-slate-500">Balance Due</span>
          </div>
          <p className="text-xl font-bold text-amber-600">₵{(editData.balance || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Map className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm text-slate-500">Plot</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{editData.plot_number || 'Not assigned'}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <ScrollText className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm text-slate-500">Indentures</span>
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{editData.number_of_indentures || 0}</p>
        </div>
      </div>

      {/* Section 1: Site Plan */}
      <SectionCard 
        title="Site Plan Information" 
        icon={<Map className="w-5 h-5" />}
        isExpanded={expandedSections.siteplan}
        onToggle={() => toggleSection('siteplan')}
        badge={editData.site_plan_done ? "Complete" : "Pending"}
        badgeColor={editData.site_plan_done ? "emerald" : "amber"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 uppercase">Plot Number</label>
            {isEditing ? (
              <input type="text" value={editData.plot_number} onChange={(e) => setEditData({ ...editData, plot_number: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" placeholder="PL-001" />
            ) : (
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{editData.plot_number || '-'}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 uppercase">Plot Size (acres)</label>
            {isEditing ? (
              <input type="number" step="0.1" value={editData.plot_size} onChange={(e) => setEditData({ ...editData, plot_size: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" placeholder="2.5" />
            ) : (
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{editData.plot_size || '-'} acres</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 uppercase">Plot Location</label>
            {isEditing ? (
              <input type="text" value={editData.plot_location} onChange={(e) => setEditData({ ...editData, plot_location: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" placeholder="Location" />
            ) : (
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{editData.plot_location || '-'}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 uppercase">Site Plan Status</label>
            {isEditing ? (
              <select value={editData.site_plan_done ? "true" : "false"} onChange={(e) => setEditData({ ...editData, site_plan_done: e.target.value === "true" })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            ) : (
              <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${editData.site_plan_done ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                {editData.site_plan_done ? "Complete" : "Pending"}
              </span>
            )}
          </div>
          <div className="space-y-2 md:col-span-2 lg:col-span-4">
            <label className="text-xs font-medium text-slate-500 uppercase">Site Plan Signed</label>
            {isEditing ? (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editData.site_plan_signed} onChange={(e) => setEditData({ ...editData, site_plan_signed: e.target.checked })} className="w-5 h-5 rounded text-blue-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Signed</span>
                </label>
              </div>
            ) : (
              <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${editData.site_plan_signed ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                {editData.site_plan_signed ? "Signed" : "Not Signed"}
              </span>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Section 2: Indenture */}
      <SectionCard 
        title="Indenture Information" 
        icon={<ScrollText className="w-5 h-5" />}
        isExpanded={expandedSections.indenture}
        onToggle={() => toggleSection('indenture')}
        badge={editData.indenture_done ? "Complete" : "Pending"}
        badgeColor={editData.indenture_done ? "emerald" : "amber"}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase">Number of Indentures</label>
              {isEditing ? (
                <input type="number" min="1" value={editData.number_of_indentures} onChange={(e) => setEditData({ ...editData, number_of_indentures: parseInt(e.target.value) || 1 })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
              ) : (
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{editData.number_of_indentures || 1}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase">Indenture Date</label>
              {isEditing ? (
                <input type="date" value={editData.indenture_date} onChange={(e) => setEditData({ ...editData, indenture_date: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
              ) : (
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{editData.indenture_date || '-'}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase">Indenture Status</label>
              {isEditing ? (
                <select value={editData.indenture_done ? "true" : "false"} onChange={(e) => setEditData({ ...editData, indenture_done: e.target.value === "true" })} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <option value="false">Pending</option>
                  <option value="true">Complete</option>
                </select>
              ) : (
                <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${editData.indenture_done ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                  {editData.indenture_done ? "Complete" : "Pending"}
                </span>
              )}
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Signature Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <SignatureBox label="Indenture" checked={editData.indenture_signed} isEditing={isEditing} onChange={(v) => setEditData({ ...editData, indenture_signed: v })} />
              <SignatureBox label="Deponent" checked={editData.deponent_signed} isEditing={isEditing} onChange={(v) => setEditData({ ...editData, deponent_signed: v })} />
              <SignatureBox label="Boss" checked={editData.boss_signed} isEditing={isEditing} onChange={(v) => setEditData({ ...editData, boss_signed: v })} />
              <SignatureBox label="Court" checked={editData.court_signed} isEditing={isEditing} onChange={(v) => setEditData({ ...editData, court_signed: v })} />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 3: Payments */}
      <SectionCard 
        title="Payment History" 
        icon={<CreditCard className="w-5 h-5" />}
        isExpanded={expandedSections.payments}
        onToggle={() => toggleSection('payments')}
        badge={`${payments.length} payments`}
        badgeColor="blue"
      >
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Method</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Reference</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white dark:hover:bg-slate-800">
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{payment.date}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">₵{payment.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{payment.method}</td>
                  <td className="px-5 py-4 text-sm font-mono text-slate-500">{payment.reference}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Section 4: Documents */}
      <SectionCard 
        title="Documents" 
        icon={<FileText className="w-5 h-5" />}
        isExpanded={expandedSections.documents}
        onToggle={() => toggleSection('documents')}
        badge={`${documents.length} files`}
        badgeColor="purple"
      >
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="font-medium text-slate-700 dark:text-slate-300">Drop files here to upload</p>
          <p className="text-sm text-slate-500">PDF, JPG, PNG (Max 10MB)</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 group">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"><Download className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h4 className="font-medium text-sm text-slate-900 dark:text-white mb-1">{doc.title}</h4>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{doc.date}</span>
                <span>{doc.size}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 5: Activity */}
      <SectionCard 
        title="Activity Log" 
        icon={<Activity className="w-5 h-5" />}
        isExpanded={expandedSections.activity}
        onToggle={() => toggleSection('activity')}
        badge={`${activities.length} events`}
        badgeColor="slate"
      >
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative pb-6 last:pb-0">
              <div className={`absolute left-[-1.5rem] w-6 h-6 rounded-full flex items-center justify-center ${
                activity.type === 'create' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                activity.type === 'payment' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                activity.type === 'plot' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' :
                'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
              }`}>
                {activity.type === 'create' && <FileText className="w-3.5 h-3.5" />}
                {activity.type === 'payment' && <DollarSign className="w-3.5 h-3.5" />}
                {activity.type === 'plot' && <Building2 className="w-3.5 h-3.5" />}
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-slate-900 dark:text-white">{activity.action}</h4>
                  <span className="text-xs text-slate-400">{activity.date}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, icon, children, isExpanded, onToggle, badge, badgeColor }: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  badge?: string;
  badgeColor?: string;
}) {
  const badgeColors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">{icon}</div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          {badge && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColors[badgeColor || 'slate']}`}>
              {badge}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      {isExpanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-5 pb-5">
          {children}
        </motion.div>
      )}
    </div>
  );
}

function SignatureBox({ label, checked, isEditing, onChange }: { 
  label: string; 
  checked: boolean; 
  isEditing: boolean; 
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
      <p className="text-xs text-slate-500 mb-2">{label}</p>
      {isEditing ? (
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
          className="w-5 h-5 rounded text-blue-600" 
        />
      ) : (
        <div className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${checked ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
          {checked ? "Signed" : "Unsigned"}
        </div>
      )}
    </div>
  );
}