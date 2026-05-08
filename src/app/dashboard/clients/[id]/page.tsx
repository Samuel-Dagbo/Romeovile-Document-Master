"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, FileText, CreditCard,
  Activity, Map, Edit3, Upload, Trash2, Download, Eye, CheckCircle2,
  Clock, X, Save, Building2, DollarSign, ClipboardList, Plus, ScrollText
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const tabs = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "siteplan", label: "Site Plan", icon: Map },
  { id: "indenture", label: "Indenture", icon: ScrollText },
  { id: "plots", label: "Plots", icon: Building2 },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "activity", label: "Activity", icon: Activity },
];

const clientData = {
  id: "1",
  file_number: "RV-OBM-26-001",
  full_name: "Kwame Asante",
  phone: "+233501234567",
  email: "kwame@email.com",
  address: "Obuasi Central, Ashanti Region",
  signup_date: "2026-01-15",
  total_amount: 150000,
  balance: 50000,
  status: "active",
  location: "Obuasi Municipal",
};

const defaultIndenture = {
  id: "",
  number_of_indentures: 1,
  site_plan_signed: false,
  site_plan_date: "",
  indenture_done: false,
  indenture_date: "",
  deponent_name: "",
  deponent_signed: false,
  boss_signed: false,
  court_signed: false,
};

interface Plot {
  id: string;
  plot_number: string;
  acreage: number;
  status: string;
  locality_id: string;
  plot_picked: boolean;
  site_plan_done: boolean;
  location_name?: string;
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
  { id: "1", action: "Client created", description: "Kwame Asante added to system", date: "2026-01-15 10:30", type: "create" },
  { id: "2", action: "Payment received", description: "₵50,000 via Bank Transfer", date: "2026-01-25 14:20", type: "payment" },
  { id: "3", action: "Plot assigned", description: "Plot PL-001 assigned", date: "2026-01-26 09:15", type: "plot" },
  { id: "4", action: "Document uploaded", description: "Land Agreement uploaded", date: "2026-01-28 16:45", type: "document" },
];

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(clientData);
  const [indentureData, setIndentureData] = useState(defaultIndenture);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [sitePlanData, setSitePlanData] = useState({
    plot_number: '',
    plot_size: '',
    site_plan_done: false,
    site_plan_signed: false
  });

  useEffect(() => {
    fetchIndenture();
    fetchPlots();
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      const res = await fetch(`${API_URL}/rest/v1/clients?id=eq.${params.id}&select=*`, {
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}` }
      });
      if (!res.ok) throw new Error('Failed to fetch client');
      const data = await res.json();
      if (data && data.length > 0) {
        setSitePlanData({
          plot_number: data[0].plot_number || '',
          plot_size: data[0].plot_size?.toString() || '',
          site_plan_done: data[0].site_plan_done || false,
          site_plan_signed: data[0].site_plan_signed || false
        });
        setEditData({ ...editData, ...data[0] });
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  const fetchPlots = async () => {
    try {
      const res = await fetch(`${API_URL}/rest/v1/plots?client_id=eq.${params.id}&select=*,locations(name)`, {
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}` }
      });
      if (!res.ok) throw new Error('Failed to fetch plots');
      const data = await res.json();
      setPlots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching plots:', error);
      setPlots([]);
    }
  };

  const fetchIndenture = async () => {
    try {
      const res = await fetch(`${API_URL}/rest/v1/indentures?client_id=eq.${params.id}&select=*`, {
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}` }
      });
      if (!res.ok) throw new Error('Failed to fetch indenture');
      const data = await res.json();
      if (data && data.length > 0) {
        setIndentureData(data[0]);
      }
    } catch (error) {
      console.error('Error fetching indenture:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/rest/v1/clients?id=eq.${params.id}`, {
        method: 'PATCH',
        headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plot_number: sitePlanData.plot_number,
          plot_size: sitePlanData.plot_size ? parseFloat(sitePlanData.plot_size) : null,
          site_plan_done: sitePlanData.site_plan_done,
          site_plan_signed: sitePlanData.site_plan_signed
        })
      });
      setIsEditing(false);
      toast.success("Client information updated successfully!");
    } catch (error) {
      console.error('Error saving:', error);
      toast.error("Failed to save");
    }
  };

  const handleIndentureSave = async () => {
    try {
      if (indentureData.id) {
        await fetch(`${API_URL}/rest/v1/indentures?id=eq.${indentureData.id}`, {
          method: 'PATCH',
          headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            number_of_indentures: indentureData.number_of_indentures,
            site_plan_signed: indentureData.site_plan_signed,
            site_plan_date: indentureData.site_plan_date,
            indenture_done: indentureData.indenture_done,
            indenture_date: indentureData.indenture_date,
            deponent_name: indentureData.deponent_name,
            deponent_signed: indentureData.deponent_signed,
            boss_signed: indentureData.boss_signed,
            court_signed: indentureData.court_signed,
            updated_at: new Date().toISOString()
          })
        });
      } else {
        const res = await fetch(`${API_URL}/rest/v1/indentures`, {
          method: 'POST',
          headers: { 'apikey': API_KEY, 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: params.id,
            ...indentureData
          })
        });
        const newIndenture = await res.json();
        setIndentureData({ ...indentureData, id: newIndenture.id });
      }
      setIsEditing(false);
      toast.success("Indenture information saved!");
    } catch (error) {
      toast.error("Failed to save indenture");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link href="/dashboard/clients" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </Link>

      {/* Profile Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setIsEditing(!isEditing)} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-12">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-600/30 border-4 border-white dark:border-slate-900 flex-shrink-0">
              {clientData.full_name.charAt(0)}
            </div>

            <div className="flex-1 pt-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                {isEditing ? (
                  <input type="text" value={editData.full_name} onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} className="text-2xl font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border" />
                ) : (
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{clientData.full_name}</h1>
                )}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${clientData.status === "active" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-amber-50 dark:bg-amber-900/20 text-amber-600"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {clientData.status.charAt(0).toUpperCase() + clientData.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">{clientData.file_number}</span>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-500">{clientData.location}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><Phone className="w-4 h-4 text-slate-500" /></div>
                  <div>
                    {isEditing ? <input type="tel" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="text-sm bg-transparent border-b w-full" /> : <p className="text-sm font-medium">{clientData.phone}</p>}
                    <p className="text-xs text-slate-500">Phone</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><Mail className="w-4 h-4 text-slate-500" /></div>
                  <div>
                    {isEditing ? <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="text-sm bg-transparent border-b w-full" /> : <p className="text-sm font-medium">{clientData.email}</p>}
                    <p className="text-xs text-slate-500">Email</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><MapPin className="w-4 h-4 text-slate-500" /></div>
                  <div>
                    {isEditing ? <input type="text" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} className="text-sm bg-transparent border-b w-full" /> : <p className="text-sm font-medium">{clientData.address}</p>}
                    <p className="text-xs text-slate-500">Address</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800"><Calendar className="w-4 h-4 text-slate-500" /></div>
                  <div><p className="text-sm font-medium">{clientData.signup_date}</p><p className="text-xs text-slate-500">Joined</p></div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-start pt-2">
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-blue-700"><Save className="w-4 h-4" />Save</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Amount", value: `₵${clientData.total_amount.toLocaleString()}`, icon: DollarSign, color: "blue" },
          { label: "Balance Due", value: `₵${clientData.balance.toLocaleString()}`, icon: CreditCard, color: "amber" },
          { label: "Plots", value: plots?.length ? plots.length.toString() : "0", icon: Building2, color: "purple" },
          { label: "Indentures", value: indentureData?.number_of_indentures ? indentureData.number_of_indentures.toString() : "0", icon: ScrollText, color: "emerald" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : stat.color === 'amber' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : stat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-500">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700"}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {activeTab === "overview" && <OverviewTab indenture={indentureData} />}
        {activeTab === "siteplan" && <SitePlanTab sitePlanData={sitePlanData} setSitePlanData={setSitePlanData} isEditing={isEditing} clientId={params.id} />}
        {activeTab === "indenture" && <IndentureTab data={indentureData} isEditing={isEditing} setData={setIndentureData} onSave={handleIndentureSave} />}
        {activeTab === "plots" && <PlotsTab />}
        {activeTab === "documents" && <DocumentsTab documents={documents} />}
        {activeTab === "payments" && <PaymentsTab payments={payments} />}
        {activeTab === "activity" && <ActivityTab activities={activities} />}
      </motion.div>
    </div>
  );
}

function OverviewTab({ indenture }: { indenture: typeof defaultIndenture }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-4">Client Details</h3>
        <div className="space-y-3">
          {[{ label: "Full Name", value: "Kwame Asante" }, { label: "File Number", value: "RV-OBM-26-001" }, { label: "Phone", value: "+233501234567" }, { label: "Email", value: "kwame@email.com" }, { label: "Address", value: "Obuasi Central, Ashanti Region" }, { label: "Location", value: "Obuasi Municipal" }, { label: "Signup Date", value: "January 15, 2026" }, { label: "Status", value: "Active", isStatus: true }].map((item) => (
            <div key={item.label} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-500">{item.label}</span>
              {item.isStatus ? <span className="text-sm font-medium text-emerald-600">Active</span> : <span className="text-sm font-medium">{item.value}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4">Payment Progress</h3>
          <div className="space-y-4">
            <div><div className="flex justify-between mb-2"><span className="text-sm text-slate-500">Paid vs Total</span><span className="text-sm font-semibold">66.7%</span></div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full"><div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "66.7%" }} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl"><p className="text-xs text-emerald-600">Paid</p><p className="text-lg font-bold text-emerald-600">₵100,000</p></div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl"><p className="text-xs text-amber-600">Outstanding</p><p className="text-lg font-bold text-amber-600">₵50,000</p></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <ScrollText className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold">Indenture Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500">Number of Indentures</p>
              <p className="text-lg font-bold">{indenture.number_of_indentures || 0}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500">Site Plan</p>
              <span className={`text-sm font-medium ${indenture.site_plan_signed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {indenture.site_plan_signed ? 'Signed' : 'Not Signed'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500">Indenture</p>
              <span className={`text-sm font-medium ${indenture.indenture_done ? 'text-emerald-600' : 'text-amber-600'}`}>
                {indenture.indenture_done ? 'Done' : 'Pending'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500">Deponent</p>
              <span className={`text-sm font-medium ${indenture.deponent_signed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {indenture.deponent_signed ? 'Signed' : 'Not Signed'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500">Boss Signed</p>
              <span className={`text-sm font-medium ${indenture.boss_signed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {indenture.boss_signed ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500">Court Signed</p>
              <span className={`text-sm font-medium ${indenture.court_signed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {indenture.court_signed ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SitePlanTab({ sitePlanData, setSitePlanData, isEditing, clientId }: { sitePlanData: any; setSitePlanData: any; isEditing: boolean; clientId: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-semibold mb-6">Site Plan Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-slate-500 mb-2">Site Plan</p>
          {isEditing ? (
            <select
              value={sitePlanData.site_plan_done ? "true" : "false"}
              onChange={(e) => setSitePlanData({ ...sitePlanData, site_plan_done: e.target.value === "true" })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          ) : (
            <span className={`px-3 py-2 rounded-lg text-sm font-medium inline-block ${sitePlanData.site_plan_done ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              {sitePlanData.site_plan_done ? "Yes" : "No"}
            </span>
          )}
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-2">Plot No</p>
          {isEditing ? (
            <input
              type="text"
              value={sitePlanData.plot_number || ""}
              onChange={(e) => setSitePlanData({ ...sitePlanData, plot_number: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              placeholder="PL-001"
            />
          ) : (
            <span className="text-sm font-medium">{sitePlanData.plot_number || "-"}</span>
          )}
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-2">Plot Size (acres)</p>
          {isEditing ? (
            <input
              type="number"
              step="0.1"
              value={sitePlanData.plot_size || ""}
              onChange={(e) => setSitePlanData({ ...sitePlanData, plot_size: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              placeholder="2.5"
            />
          ) : (
            <span className="text-sm font-medium">{sitePlanData.plot_size ? `${sitePlanData.plot_size} acres` : "-"}</span>
          )}
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-2">Site Plan Signed</p>
          {isEditing ? (
            <select
              value={sitePlanData.site_plan_signed ? "true" : "false"}
              onChange={(e) => setSitePlanData({ ...sitePlanData, site_plan_signed: e.target.value === "true" })}
              className="w-full px-3 py-2 rounded-lg border text-sm"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          ) : (
            <span className={`px-3 py-2 rounded-lg text-sm font-medium inline-block ${sitePlanData.site_plan_signed ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              {sitePlanData.site_plan_signed ? "Yes" : "No"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function IndentureTab({ data, isEditing, setData, onSave }: { data: any; isEditing: boolean; setData: any; onSave: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Indenture Information</h3>
          {isEditing && <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"><Save className="w-4 h-4" />Save</button>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Number of Indentures */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white border-b pb-2">Details</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Number of Indentures</p>
                {isEditing ? (
                  <input type="number" value={data.number_of_indentures} onChange={(e) => setData({ ...data, number_of_indentures: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 rounded-lg border" min="1" />
                ) : (
                  <p className="text-sm font-medium">{data.number_of_indentures || 1}</p>
                )}
              </div>
            </div>
          </div>

          {/* Site Plan Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white border-b pb-2">Site Plan</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Site Plan Signed</span>
                {isEditing ? (
                  <input type="checkbox" checked={data.site_plan_signed} onChange={(e) => setData({ ...data, site_plan_signed: e.target.checked })} className="rounded" />
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.site_plan_signed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                    {data.site_plan_signed ? "Yes" : "No"}
                  </span>
                )}
              </label>
              <div>
                <p className="text-xs text-slate-500 mb-1">Date</p>
                {isEditing ? <input type="date" value={data.site_plan_date} onChange={(e) => setData({ ...data, site_plan_date: e.target.value })} className="w-full px-3 py-2 rounded-lg border" /> : <p className="text-sm font-medium">{data.site_plan_date}</p>}
              </div>
            </div>
          </div>

          {/* Indenture Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white border-b pb-2">Indenture</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Indenture Done</span>
                {isEditing ? (
                  <input type="checkbox" checked={data.indenture_done} onChange={(e) => setData({ ...data, indenture_done: e.target.checked })} className="rounded" />
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.indenture_done ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                    {data.indenture_done ? "Yes" : "No"}
                  </span>
                )}
              </label>
              <div>
                <p className="text-xs text-slate-500 mb-1">Date</p>
                {isEditing ? <input type="date" value={data.indenture_date} onChange={(e) => setData({ ...data, indenture_date: e.target.value })} className="w-full px-3 py-2 rounded-lg border" /> : <p className="text-sm font-medium">{data.indenture_date}</p>}
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Deponent Name</p>
                {isEditing ? <input type="text" value={data.deponent_name} onChange={(e) => setData({ ...data, deponent_name: e.target.value })} className="w-full px-3 py-2 rounded-lg border" /> : <p className="text-sm font-medium">{data.deponent_name}</p>}
              </div>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white border-b pb-2">Signatures</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Deponent Signed</span>
                {isEditing ? (
                  <input type="checkbox" checked={data.deponent_signed} onChange={(e) => setData({ ...data, deponent_signed: e.target.checked })} className="rounded" />
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.deponent_signed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                    {data.deponent_signed ? "Yes" : "No"}
                  </span>
                )}
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Boss Signed</span>
                {isEditing ? (
                  <input type="checkbox" checked={data.boss_signed} onChange={(e) => setData({ ...data, boss_signed: e.target.checked })} className="rounded" />
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.boss_signed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                    {data.boss_signed ? "Yes" : "No"}
                  </span>
                )}
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Court Signed</span>
                {isEditing ? (
                  <input type="checkbox" checked={data.court_signed} onChange={(e) => setData({ ...data, court_signed: e.target.checked })} className="rounded" />
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.court_signed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                    {data.court_signed ? "Yes" : "No"}
                  </span>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlotsTab({ }: { }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
          <Map className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">Plot Information</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">This client's assigned plot</p>
        </div>
      </div>
      <p className="text-center text-slate-400 py-8">Plot details are shown in the Site Plan tab</p>
    </div>
  );
}

function DocumentsTab({ documents }: { documents: any[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "agreement": return <FileText className="w-5 h-5 text-blue-500" />;
      case "receipt": return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case "site_plan": return <Map className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="font-medium text-slate-700 dark:text-slate-300">Drop files here to upload</p>
        <p className="text-sm text-slate-500">PDF, JPG, PNG (Max 10MB)</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 group">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg">{getIcon(doc.type)}</div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                <button className="p-1.5 rounded-lg hover:bg-slate-100"><Eye className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100"><Download className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h4 className="font-medium text-sm mb-1">{doc.title}</h4>
            <div className="flex justify-between text-xs text-slate-500"><span>{doc.date}</span><span>{doc.size}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsTab({ payments }: { payments: any[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Method</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Reference</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="px-6 py-4 text-sm text-slate-600">{payment.date}</td>
              <td className="px-6 py-4 text-sm font-semibold">₵{payment.amount.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{payment.method}</td>
              <td className="px-6 py-4 text-sm font-mono text-slate-500">{payment.reference}</td>
              <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">Completed</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityTab({ activities }: { activities: any[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "create": return <FileText className="w-4 h-4" />;
      case "payment": return <DollarSign className="w-4 h-4" />;
      case "plot": return <Building2 className="w-4 h-4" />;
      case "document": return <ClipboardList className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };
  const getColor = (type: string) => {
    switch (type) {
      case "create": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30";
      case "payment": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30";
      case "plot": return "bg-purple-100 text-purple-600 dark:bg-purple-900/30";
      case "document": return "bg-amber-100 text-amber-600 dark:bg-amber-900/30";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
      {activities.map((activity, index) => (
        <motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="relative pb-6 last:pb-0">
          <div className={`absolute left-[-1.5rem] w-6 h-6 rounded-full flex items-center justify-center ${getColor(activity.type)}`}>
            {getIcon(activity.type)}
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium">{activity.action}</h4>
              <span className="text-xs text-slate-400">{activity.date}</span>
            </div>
            <p className="text-sm text-slate-500">{activity.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}