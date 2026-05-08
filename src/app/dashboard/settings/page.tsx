"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, Save, Upload, Key } from "lucide-react";
import toast from "react-hot-toast";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card-premium p-2 lg:sticky lg:top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "notifications" && <NotificationSettings />}
            {activeTab === "appearance" && <AppearanceSettings />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="card-premium p-6 space-y-6">
      <h2 className="text-lg font-semibold">Profile Information</h2>

      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
          A
        </div>
        <div>
          <button className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Change Photo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <input className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="System Admin" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="admin@romeoville.com" disabled />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <input className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="+233..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <input className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none" defaultValue="Admin" disabled />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => toast.success("Profile updated successfully!")}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="card-premium p-6 space-y-6">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <input type="password" className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <input type="password" className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <input type="password" className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-700/50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
        </div>
        <button
          onClick={() => toast.success("Password updated successfully!")}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Key className="w-4 h-4" />
          Update Password
        </button>
      </div>

      <div className="card-premium p-6">
        <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication</h2>
        <p className="text-muted-foreground mb-4">Add an extra layer of security to your account</p>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">2FA Status</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-sm font-medium">Not Enabled</span>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    clientUpdates: true,
    paymentAlerts: true,
    documentUpdates: true,
    weeklyDigest: false,
  });

  const toggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
    toast.success("Setting updated");
  };

  return (
    <div className="card-premium p-6 space-y-6">
      <h2 className="text-lg font-semibold">Notification Preferences</h2>
      <div className="space-y-4">
        {[
          { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
          { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications in browser" },
          { key: "clientUpdates", label: "Client Updates", desc: "Get notified when client information changes" },
          { key: "paymentAlerts", label: "Payment Alerts", desc: "Receive alerts for payment activities" },
          { key: "documentUpdates", label: "Document Updates", desc: "Get notified when documents are uploaded" },
          { key: "weeklyDigest", label: "Weekly Digest", desc: "Receive a weekly summary of activities" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings[item.key as keyof typeof settings] ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings[item.key as keyof typeof settings] ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="card-premium p-6 space-y-6">
      <h2 className="text-lg font-semibold">Theme & Display</h2>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <p className="font-medium mb-3">Theme Mode</p>
          <div className="flex gap-3">
            {["Light", "Dark", "System"].map((theme) => (
              <button
                key={theme}
                className="px-4 py-2 rounded-xl border hover:bg-white dark:hover:bg-slate-600 transition-colors"
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <p className="font-medium mb-3">Accent Color</p>
          <div className="flex gap-3">
            {["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"].map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-md"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}