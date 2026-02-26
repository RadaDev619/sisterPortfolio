"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  X,
  GraduationCap,
  Calendar,
  Save,
  Layout,
  Loader2,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

// Import Server Actions
import {
  createClassAction,
  getClassesAction,
  deleteClassAction,
} from "@/actions/teaching-actions";

export default function AdminTeachingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data States
  const [classes, setClasses] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  // Delete Modal States
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  } | null>(null);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    setFetching(true);
    const data = await getClassesAction();
    setClasses(data || []);
    setFetching(false);
  }

  // --- HANDLERS ---
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createClassAction(formData);

    if (result.success) {
      await loadClasses();
      setIsModalOpen(false);
      (e.target as HTMLFormElement).reset();
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }
    setLoading(false);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const result = await deleteClassAction(deleteId);

    if (result.success) {
      await loadClasses();
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }

    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-800 pb-20 px-4 pt-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 bg-indigo-50 w-fit px-3 py-1 rounded-full">
              <GraduationCap size={12} /> Academic Management
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-800 tracking-tight">
              Active <span className="text-indigo-600">Classes</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium italic">
              Currently teaching {classes.length} classes.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <Plus size={18} /> Add New Class
          </button>
        </div>

        {/* --- CLASS LIST GRID --- */}
        {fetching ? (
          <div className="flex justify-center py-20 text-slate-400 gap-2 items-center">
            <Loader2 className="animate-spin" /> Loading classes...
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-20 text-slate-400 italic bg-white rounded-[2.5rem] border border-slate-100">
            No classes found. Click "Add New Class" to start.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  {/* CLASS CODE BOX */}
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner font-bold text-lg">
                    {course.code}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setDeleteId(course.id)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                      title="Delete Class"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>

                {/* META INFO */}
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">
                  <span className="flex items-center gap-1.5">
                    <Layout size={12} /> {course.level}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> {course.year}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 italic">
                  {course.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* --- TOAST NOTIFICATION --- */}
      <AnimatePresence>
        {toast && toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              toast.type === "success"
                ? "bg-white border-emerald-100 text-emerald-800"
                : "bg-white border-rose-100 text-rose-800"
            }`}
          >
            <div
              className={`p-2 rounded-full ${toast.type === "success" ? "bg-emerald-100" : "bg-rose-100"}`}
            >
              {toast.type === "success" ? (
                <CheckCircle size={20} className="text-emerald-600" />
              ) : (
                <AlertCircle size={20} className="text-rose-600" />
              )}
            </div>
            <div>
              <p className="font-bold text-sm">
                {toast.type === "success" ? "Success" : "Error"}
              </p>
              <p className="text-xs opacity-80 font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-4 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-serif text-slate-800 mb-2">
                Remove Class?
              </h3>
              <p className="text-slate-500 text-sm mb-8">
                Are you sure you want to delete this class? This cannot be
                undone.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="px-6 py-3 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-100 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  {isDeleting ? "Deleting..." : "Delete Class"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <h2 className="text-2xl font-serif text-slate-800">
                  Create New Class
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Fill in the details for the class card.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">
                      Class Code (e.g. IX)
                    </label>
                    <input
                      name="code"
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">
                      Academic Year
                    </label>
                    <input
                      name="year"
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">
                    Grade Level (e.g. Standard IX)
                  </label>
                  <input
                    name="level"
                    required
                    type="text"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">
                    Full Class Title
                  </label>
                  <input
                    name="title"
                    required
                    type="text"
                    placeholder="e.g. Understanding Mathematics for Class X"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {loading ? "Publishing..." : "Publish Class"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
