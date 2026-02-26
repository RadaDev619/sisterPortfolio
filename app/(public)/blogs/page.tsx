"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, PlayCircle, Images, X, ArrowUpRight } from "lucide-react";
import { getPostsAction } from "@/actions/blog-actions"; // adjust path

type Activity = {
  id: number;
  title: string;
  date: string;
  category: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  galleryUrl: string | null;
  createdAt: Date | null;
};

export default function BlogPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedPost, setSelectedPost] = useState<Activity | null>(null);

  // Static filter tabs
  const categories = ["All", "Activities", "Events", "News"];

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPostsAction();
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Unable to load journal entries. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = activities.filter(
    (a) => activeTab === "All" || a.category === activeTab,
  );

  // Helper to extract year from date string
  const getYear = (dateStr: string) => {
    try {
      return new Date(dateStr).getFullYear().toString();
    } catch {
      return dateStr.split(" ").pop() || "Unknown";
    }
  };

  // Format date for display (e.g., "15 Oct 2025")
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 pb-20">
      {/* --- PAGE HEADER --- */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tight mb-4">
                Journal<span className="text-indigo-600">.</span>
              </h1>
              <p className="text-stone-500 font-medium max-w-md italic">
                A collection of initiatives and school activities aimed at
                fostering innovation and leadership.
              </p>
            </div>

            {/* Category Filter */}
            {!loading && !error && (
              <div className="flex bg-stone-100/50 p-1.5 rounded-2xl border border-stone-200/50 w-fit">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === cat
                        ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* --- POSTS GRID --- */}
      <section className="container mx-auto px-6 max-w-5xl">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden animate-pulse"
              >
                <div className="aspect-[16/10] bg-stone-200"></div>
                <div className="p-8 space-y-4">
                  <div className="h-4 w-1/4 bg-stone-200 rounded"></div>
                  <div className="h-6 w-3/4 bg-stone-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-stone-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-stone-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-rose-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-indigo-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-500">
            No journal entries found for this category.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPost(post)}
                  className="group cursor-pointer bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-500"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={post.imageUrl || "/placeholder.jpg"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={post.title}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-indigo-600 shadow-sm">
                      {getYear(post.date)}
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                      <Calendar size={12} /> {formatDate(post.date)}
                    </div>
                    <h3 className="text-2xl font-serif text-stone-900 mb-4 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-6">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                      Read Story{" "}
                      <ArrowUpRight size={14} className="text-indigo-500" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* --- CONTENT OVERLAY (VIEW DETAIL) --- */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#FDFCFB] w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[3rem] shadow-2xl ring-1 ring-stone-200"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 z-10 bg-white border border-stone-100 p-2 rounded-full hover:bg-stone-50 shadow-sm transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col lg:flex-row">
                {/* Visual Side */}
                <div className="lg:w-2/5 h-64 lg:h-auto overflow-hidden">
                  <img
                    src={selectedPost.imageUrl || "/placeholder.jpg"}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>

                {/* Content Side */}
                <div className="lg:w-3/5 p-8 lg:p-14">
                  <div className="text-indigo-600 text-xs font-bold tracking-widest uppercase mb-4">
                    {selectedPost.category} • {getYear(selectedPost.date)}
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-6 leading-tight">
                    {selectedPost.title}
                  </h2>
                  <div className="prose prose-stone text-stone-600 text-lg leading-relaxed mb-12 font-light italic">
                    {selectedPost.content}
                  </div>

                  {/* Media Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedPost.videoUrl && (
                      <a
                        href={selectedPost.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl text-xs font-bold hover:shadow-lg hover:shadow-indigo-200 transition-all"
                      >
                        <PlayCircle size={18} /> Watch Video
                      </a>
                    )}
                    {selectedPost.galleryUrl && (
                      <a
                        href={selectedPost.galleryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-stone-900 text-white py-4 rounded-2xl text-xs font-bold hover:bg-stone-800 transition-all shadow-sm"
                      >
                        <Images size={18} /> Photo Gallery
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
