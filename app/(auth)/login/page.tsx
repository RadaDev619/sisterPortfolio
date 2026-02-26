"use client";

import { useState } from "react";
import {
  User,
  Lock,
  ArrowRight,
  Layout,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUserAction } from "@/actions/auth-actions"; // adjust path if needed

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create FormData from state
      const formDataObj = new FormData();
      formDataObj.append("username", formData.username);
      formDataObj.append("password", formData.password);

      // Call server action
      const result = await loginUserAction(formDataObj);

      if (result.success) {
        // Redirect to admin dashboard on success
        router.push("/admin");
      } else {
        // Show error message from server
        setError(result.message || "Invalid credentials.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    // 1. OUTER WRAPPER: Full screen white background
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[26rem]"
      >
        {/* --- BRAND HEADER --- */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100 shadow-sm">
            <Layout size={28} />
          </div>
          <h1 className="text-3xl font-serif text-slate-900 tracking-tight text-center">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-2 text-center">
            Enter your workspace credentials to continue.
          </p>
        </div>

        {/* --- LOGIN CARD --- */}
        <div className="bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-50 p-3 rounded-xl border border-rose-100 overflow-hidden"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-3">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
