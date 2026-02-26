"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  X,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Save,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
// Import the server actions
import {
  createPostAction,
  getPostsAction,
  deletePostAction,
} from "@/actions/blog-actions";

export default function AdminBlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // New State for Delete Modal
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Form States
  const [imageUrl, setImageUrl] = useState("");
  const [posts, setPosts] = useState<any[]>([]);

  // Load posts on page load
  useEffect(() => {
    loadPosts();
  }, []);

  // Helper to show notifications
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  async function loadPosts() {
    setFetching(true);
    const data = await getPostsAction();
    setPosts(data || []);
    setFetching(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("imageUrl", imageUrl);

    const result = await createPostAction(formData);

    if (result.success) {
      await loadPosts();
      setIsModalOpen(false);
      setImageUrl("");
      (e.target as HTMLFormElement).reset();
      showToast("Journal entry published successfully!", "success");
    } else {
      showToast(result.message || "Error saving post", "error");
    }
    setLoading(false);
  }

  // 1. Opens the confirmation modal
  function promptDelete(id: number) {
    setPostToDelete(id);
  }

  // 2. Actually deletes the post
  async function executeDelete() {
    if (!postToDelete) return;

    setIsDeleting(true);
    const result = await deletePostAction(postToDelete);

    if (result && result.success) {
      showToast("Entry deleted successfully", "success");
      await loadPosts();
    } else {
      showToast("Failed to delete entry", "error");
    }

    setIsDeleting(false);
    setPostToDelete(null); // Close modal
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] pb-20 px-4 pt-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 bg-indigo-50 w-fit px-3 py-1 rounded-full">
              <Globe size={12} /> Journal Management
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-800 tracking-tight">
              Manage <span className="text-indigo-600 italic">Journal</span>
            </h1>
          </div>
          <button
            onClick={() => {
              setImageUrl("");
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <Plus size={18} /> New Activity
          </button>
        </div>

        {/* --- POSTS LIST --- */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Recent Entries
            </h3>
            <span className="text-[10px] bg-slate-50 px-3 py-1 rounded-full text-slate-400 font-bold">
              {posts.length} Total
            </span>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center h-40 text-slate-400 gap-2">
              <Loader2 className="animate-spin" /> Loading data...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center p-10 text-slate-400 italic">
              No journal entries found. Click "New Activity" to add one.
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-slate-50/50 transition-all group gap-4"
                >
                  <div className="flex items-center gap-6">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        className="w-16 h-12 object-cover rounded-xl border border-slate-100 shadow-sm"
                        alt=""
                      />
                    ) : (
                      <div className="w-16 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300">
                        <ImageIcon size={16} />
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        {post.date} • {post.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all self-end md:self-auto">
                    <button
                      onClick={() => promptDelete(post.id)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Entry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* --- NOTIFICATION TOAST UI --- */}
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
              className={`p-2 rounded-full ${
                toast.type === "success" ? "bg-emerald-100" : "bg-rose-100"
              }`}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#FAFBFC] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl border border-white p-8 md:p-12"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10 text-center">
                <h2 className="text-3xl font-serif text-slate-800">
                  Post Activity
                </h2>
                <p className="text-slate-400 text-sm italic mt-1">
                  Fill in the details to share your school initiative.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-8"
              >
                {/* Left Side: Text Details */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Activity Title
                    </label>
                    <input
                      name="title"
                      required
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
                      placeholder="e.g. National Girls STEM Camp"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Date
                      </label>
                      <input
                        name="date"
                        required
                        type="date"
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Category
                      </label>
                      <select
                        name="category"
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 font-medium outline-none appearance-none cursor-pointer"
                      >
                        <option value="Activities">Activities</option>
                        <option value="Events">Events</option>
                        <option value="News">News</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Full Story
                    </label>
                    <textarea
                      name="content"
                      required
                      rows={6}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-indigo-100 resize-none placeholder:text-slate-400 leading-relaxed"
                      placeholder="Write the details here..."
                    />
                  </div>
                </div>

                {/* Right Side: Media & Links */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                      Cover Picture
                    </label>
                    <CldUploadWidget
                      uploadPreset="sisPortfolio"
                      onSuccess={(result: any) =>
                        setImageUrl(result.info.secure_url)
                      }
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="w-full aspect-video border-2 border-dashed border-indigo-100 bg-white rounded-3xl flex flex-col items-center justify-center text-indigo-400 hover:bg-indigo-50 transition-all overflow-hidden relative"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              className="w-full h-full object-cover"
                              alt="Uploaded cover"
                            />
                          ) : (
                            <>
                              <ImageIcon size={32} className="mb-2" />{" "}
                              <span className="text-xs font-bold">
                                Upload from Cloudinary
                              </span>
                            </>
                          )}
                        </button>
                      )}
                    </CldUploadWidget>
                    <input type="hidden" name="imageUrl" value={imageUrl} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Video size={12} /> Google Drive Video URL
                    </label>
                    <input
                      name="videoUrl"
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <LinkIcon size={12} /> Google Drive Album (Gallery)
                    </label>
                    <input
                      name="galleryUrl"
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-900 font-medium outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {loading ? "Publishing..." : "Publish to Journal"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {postToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPostToDelete(null)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            {/* Delete Card */}
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
                Delete Entry?
              </h3>
              <p className="text-slate-500 text-sm mb-8">
                Are you sure you want to remove this journal entry? This action
                cannot be undone.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setPostToDelete(null)}
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
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
