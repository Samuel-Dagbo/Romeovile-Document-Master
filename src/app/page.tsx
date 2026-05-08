"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Map,
  FileText,
  Menu,
  X,
  Moon,
  Sun,
  Building2,
  DollarSign,
  Shield,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold text-gradient">RomeoVille</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#stats" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Statistics</Link>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-700 px-4 py-4 space-y-3"
          >
            <Link href="#features" className="block text-sm font-medium">Features</Link>
            <Link href="#stats" className="block text-sm font-medium">Statistics</Link>
            <Link href="/auth/login" className="block text-sm font-medium">Login</Link>
            <Link href="/auth/signup" className="block text-sm font-medium text-blue-600">Get Started</Link>
          </motion.div>
        )}
      </nav>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Trusted by Industry Leaders</h2>
            <p className="text-blue-100">Join the leading land management platform in Ghana</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Clients Managed" },
              { number: "50+", label: "Locations Covered" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Support Available" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white">{stat.number}</p>
                <p className="text-blue-100 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Enterprise Land Management System
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Streamline your land
              <br />
              <span className="text-gradient">management operations</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The comprehensive platform for managing clients, plots, indentures, and documents. Built for modern real estate operations in Ghana.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transition-all inline-flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-4 border border-slate-200 dark:border-slate-700 font-semibold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose RomeoVille Section */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose RomeoVille?</h2>
            <p className="text-muted-foreground text-lg">The complete solution for modern land management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "Comprehensive Client Management", 
                desc: "Keep all your client information organized in one place. Track contact details, payment history, and plot assignments effortlessly.",
                icon: Users,
                color: "blue"
              },
              { 
                title: "Digital Indenture Tracking", 
                desc: "Never lose track of legal documents again. Monitor every signature status from site plan to court approval in real-time.",
                icon: FileText,
                color: "emerald"
              },
              { 
                title: "Smart Plot Assignment", 
                desc: "Assign and track plots with ease. Know exactly what's available, what's sold, and the status of each plot.",
                icon: Map,
                color: "purple"
              },
              { 
                title: "Secure User Management", 
                desc: "Control who has access to what. Set up different roles for admins, staff, and managers with approval workflows.",
                icon: Shield,
                color: "indigo"
              },
              { 
                title: "Payment Tracking", 
                desc: "Keep track of all payments and outstanding balances. Know exactly where each client stands with their payments.",
                icon: DollarSign,
                color: "amber"
              },
              { 
                title: "Multiple Locations", 
                desc: "Manage plots across different areas and municipalities. Perfect for operations spanning multiple regions.",
                icon: Building2,
                color: "rose"
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-800"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${item.color}-50 dark:bg-${item.color}-900/20`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage your land business efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Client Management", desc: "Comprehensive client profiles with contact details, status tracking, and full history.", color: "blue" },
              { icon: Map, title: "Plot Management", desc: "Track plot assignments, sizes, locations, and site plan statuses.", color: "purple" },
              { icon: FileText, title: "Indenture Tracking", desc: "Monitor indenture progress, signatures, and legal documentation.", color: "emerald" },
              { icon: DollarSign, title: "Payment Tracking", desc: "Monitor payments, outstanding balances, and payment history.", color: "amber" },
              { icon: Building2, title: "Location Management", desc: "Organize plots by locations and municipalities.", color: "rose" },
              { icon: Shield, title: "Role-Based Access", desc: "Secure system with admin approvals and user management.", color: "indigo" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-full bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow">
                  <div className={`w-12 h-12 bg-${feature.color}-50 dark:bg-${feature.color}-900/20 rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to modernize your operations?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Join real estate companies across Ghana who trust RomeoVille for their land management needs.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:shadow-xl transition-all"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t dark:border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-lg font-bold">RomeoVille</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/auth/login" className="hover:text-foreground transition-colors">Login</Link>
              <Link href="/auth/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 RomeoVille Document Master. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}