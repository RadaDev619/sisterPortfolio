"use client";

import React from "react";
import {
  PlusCircle,
  FileText,
  GraduationCap,
  Clock,
  ChevronRight,
  TrendingUp,
  Calendar as CalendarIcon,
  Layout,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getLatestPostsAction,
  getTotalBlogEntriesAction,
  getEventsAndActivitiesCountAction,
} from "@/actions/blog-actions";
import { getTotalTeachingClassesAction } from "@/actions/teaching-actions";

type Stat = {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

type RecentActivity = {
  title: string;
  date: string;
  status: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([
    {
      label: "Blog Entries",
      count: 0,
      icon: <FileText size={20} />,
      color: "text-sky-500",
      bgColor: "bg-sky-50",
    },
    {
      label: "Teaching Classes",
      count: 0,
      icon: <GraduationCap size={20} />,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
    {
      label: "Events & Activities",
      count: 0,
      icon: <TrendingUp size={20} />,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
    },
  ]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all counts and recent posts in parallel
        const [blogCount, teachingCount, eventsActivitiesCount, posts] =
          await Promise.all([
            getTotalBlogEntriesAction(),
            getTotalTeachingClassesAction(),
            getEventsAndActivitiesCountAction(),
            getLatestPostsAction(),
          ]);

        // Update stats
        setStats([
          {
            label: "Blog Entries",
            count: blogCount,
            icon: <FileText size={20} />,
            color: "text-sky-500",
            bgColor: "bg-sky-50",
          },
          {
            label: "Teaching Classes",
            count: teachingCount,
            icon: <GraduationCap size={20} />,
            color: "text-indigo-500",
            bgColor: "bg-indigo-50",
          },
          {
            label: "Events & Activities",
            count: eventsActivitiesCount,
            icon: <TrendingUp size={20} />,
            color: "text-rose-500",
            bgColor: "bg-rose-50",
          },
        ]);

        // Process recent posts
        const recent = posts.slice(0, 3).map((post) => ({
          title: post.title,
          date: (() => {
            try {
              return new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
            } catch {
              return post.date;
            }
          })(),
          status: "Live", // No status column yet
        }));
        setRecentActivities(recent);
        setError(null);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Failed to load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 py-8 space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              <Layout size={14} /> Workspace Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-800 tracking-tight">
              Welcome back, <span className="text-indigo-600">Sonam</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 flex items-center gap-2 font-medium">
              <Clock size={14} className="text-indigo-300" /> {today}
            </p>
          </div>

          <Link
            href="/admin/blogAdmin"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 flex items-center justify-center md:justify-start gap-2 group"
          >
            <PlusCircle
              size={18}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            Create New Entry
          </Link>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 animate-pulse"
              >
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-slate-200 w-12 h-12"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-slate-200 rounded"></div>
                    <div className="h-6 w-12 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md flex items-center gap-5 group hover:border-indigo-100 transition-all"
              >
                <div
                  className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-800 tracking-tight">
                    {stat.count}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent Entries */}
        <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-serif text-slate-800 flex items-center gap-3">
              <CalendarIcon className="text-indigo-400" size={22} />
              Recent Journal
            </h3>
            <Link
              href="/admin/blogAdmin"
              className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] hover:text-indigo-700 transition-all border-b border-transparent hover:border-indigo-200 pb-0.5"
            >
              View Blogs
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-3xl border border-slate-100 animate-pulse"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                      <div className="h-3 w-1/4 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No recent entries found.
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((item) => (
                <div
                  key={item.title}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-500 group-hover:shadow-sm transition-all border border-slate-100">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 sm:mt-0 pl-[4.25rem] sm:pl-0">
                    <span
                      className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                        item.status === "Live"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.status}
                    </span>
                    <ChevronRight
                      size={18}
                      className="text-slate-200 group-hover:text-indigo-400 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
}
