"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Map, FileText, FolderOpen,
  MapPin, BarChart3, Settings, UserCircle, LogOut,
  Menu, X, ChevronLeft, ChevronRight, Bell, Search,
  Moon, Sun, ChevronDown, Building2, ClipboardList
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", section: "main" },
  { href: "/dashboard/clients", icon: Users, label: "Clients", section: "main" },
  { href: "/dashboard/plots", icon: Map, label: "Plots", section: "main" },
  { href: "/dashboard/indentures", icon: FileText, label: "Indentures", section: "main" },
  { href: "/dashboard/documents", icon: FolderOpen, label: "Documents", section: "main" },
  { href: "/dashboard/locations", icon: MapPin, label: "Locations", section: "management" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics", section: "reports" },
  { href: "/dashboard/users", icon: UserCircle, label: "Users", section: "management" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileOpen(false)}>
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <span className="text-white font-bold">R</span>
                  </div>
                  <span className="text-lg font-bold">RomeoVille</span>
                </Link>
                <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent pathname={pathname} onNavigate={() => setIsMobileOpen(false)} isCollapsed={false} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 hidden lg:flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0">
                <span className="text-white font-bold">R</span>
              </div>
              {!isCollapsed && <span className="text-lg font-bold">RomeoVille</span>}
            </Link>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <SidebarContent pathname={pathname} isCollapsed={isCollapsed} />
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileOpen(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
              <button className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{user?.full_name?.charAt(0) || 'A'}</span>
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.full_name || 'Admin'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, onNavigate, isCollapsed }: { pathname: string | null; onNavigate?: () => void; isCollapsed: boolean }) {
  const groupedLinks = sidebarLinks.reduce((acc, link) => {
    if (!acc[link.section]) acc[link.section] = [];
    acc[link.section].push(link);
    return acc;
  }, {} as Record<string, typeof sidebarLinks>);

  const sectionLabels: Record<string, string> = {
    main: "Main Menu",
    management: "Management",
    reports: "Reports"
  };

  return (
    <nav className="space-y-6">
      {Object.entries(groupedLinks).map(([section, links]) => (
        <div key={section}>
          {!isCollapsed && <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{sectionLabels[section]}</p>}
          <div className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href || (pathname && pathname.startsWith(`${link.href}/`));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? link.label : undefined}
                >
                  <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  {!isCollapsed && <span className="font-medium text-sm">{link.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
      {!isCollapsed && (
        <Link href="/dashboard/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>
      )}
    </nav>
  );
}