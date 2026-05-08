"use client";

import { motion } from "framer-motion";
import { Clock, Mail, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PendingPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-lg">
        <div className="glass rounded-3xl p-10 shadow-2xl text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-amber-600" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-4">Pending Approval</h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Your account is pending administrator approval. Please contact an administrator.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="font-medium">What happens next?</span>
            </div>
            <ul className="text-left text-sm text-muted-foreground space-y-2 ml-8">
              <li>• An administrator will review your application</li>
              <li>• You'll receive an email notification once approved</li>
            </ul>
          </div>

          <button onClick={handleLogout} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}