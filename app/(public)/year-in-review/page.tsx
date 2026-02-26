"use client";

import React from "react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Trophy,
  Users,
  School,
  Globe,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { getPostsByCategoriesAction } from "@/actions/blog-actions"; // adjust path

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

type Milestone = {
  title: string;
  month: string;
  description: string;
  icon: React.ReactNode;
};

type YearData = {
  year: string;
  summary: string;
  stats: { label: string; value: string }[];
  milestones: Milestone[];
};

// Helper to map category to an icon
const getIconForCategory = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("activities"))
    return <Trophy className="text-amber-500" size={20} />;
  if (cat.includes("events"))
    return <Globe className="text-indigo-500" size={20} />;
  return <Sparkles className="text-stone-500" size={20} />; // fallback
};

export default function YearInReviewPage() {
  const [yearData, setYearData] = useState<YearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch posts with categories "Activities" and "Events"
        const posts = await getPostsByCategoriesAction([
          "Activities",
          "Events",
        ]);

        // Group posts by year
        const grouped: Record<string, Activity[]> = {};
        posts.forEach((post) => {
          // Extract year from date
          let year = "Unknown";
          try {
            year = new Date(post.date).getFullYear().toString();
          } catch {
            // fallback: try to get last part of date string if it's like "15 Oct 2025"
            const parts = post.date.split(" ");
            if (parts.length >= 3) year = parts[2];
          }
          if (!grouped[year]) grouped[year] = [];
          grouped[year].push(post);
        });

        // Convert grouped data into YearData array
        const years = Object.keys(grouped).sort(
          (a, b) => parseInt(b) - parseInt(a),
        ); // descending
        const data: YearData[] = years.map((year) => {
          const postsInYear = grouped[year];
          const stats = [
            {
              label: "Posts",
              value:
                postsInYear.length.toString() +
                (postsInYear.length > 1 ? "+" : ""),
            },
            {
              label: "Categories",
              value: Array.from(
                new Set(postsInYear.map((p) => p.category)),
              ).length.toString(),
            },
            {
              label: "Highlights",
              value:
                postsInYear.length > 5 ? "5+" : postsInYear.length.toString(),
            },
          ];

          // Create milestones from posts
          const milestones: Milestone[] = postsInYear.map((post) => {
            // Extract month from date
            let month = "Unknown";
            try {
              month = new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
              });
            } catch {
              const parts = post.date.split(" ");
              if (parts.length >= 2) month = parts[1];
            }
            return {
              title: post.title,
              month,
              description: post.content.substring(0, 120) + "...", // truncate
              icon: getIconForCategory(post.category),
            };
          });

          // Generate a summary (can be customized)
          const summary = `A year of ${milestones.length} milestone${
            milestones.length !== 1 ? "s" : ""
          } in ${postsInYear
            .map((p) => p.category)
            .filter((v, i, a) => a.indexOf(v) === i)
            .join(" & ")}.`;

          return {
            year,
            summary,
            stats,
            milestones,
          };
        });

        setYearData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch year in review data:", err);
        setError("Unable to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 pb-32">
      {/* --- HERO SECTION --- */}
      <section className="pt-24 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
              The Journey
            </span>
            <h1 className="text-5xl md:text-8xl font-serif text-stone-900 mb-8 tracking-tighter">
              Year in <span className="italic">Review</span>
              <span className="text-indigo-600">.</span>
            </h1>
            <p className="text-stone-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Reflecting on a journey of education, leadership, and the pursuit
              of STEM excellence in Bhutan.
            </p>
          </motion.div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/40 via-transparent to-transparent -z-10" />
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section className="container mx-auto px-6 max-w-5xl">
        {loading ? (
          <div className="space-y-32">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-center mb-16">
                  <div className="h-12 w-24 bg-stone-200 rounded-full"></div>
                </div>
                <div className="bg-white border border-stone-100 p-12 rounded-[3rem] mb-16 max-w-3xl mx-auto">
                  <div className="h-6 w-3/4 bg-stone-200 rounded mx-auto mb-8"></div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="text-center">
                        <div className="h-8 w-16 bg-stone-200 rounded mx-auto mb-2"></div>
                        <div className="h-3 w-20 bg-stone-200 rounded mx-auto"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-12">
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      className="flex flex-col md:flex-row items-center gap-8"
                    >
                      <div className="md:w-1/2 w-full">
                        <div className="p-8 bg-white border border-stone-100 rounded-[2rem]">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="h-4 w-20 bg-stone-200 rounded"></div>
                            <div className="h-8 w-8 bg-stone-200 rounded-lg"></div>
                          </div>
                          <div className="h-5 w-3/4 bg-stone-200 rounded mb-2"></div>
                          <div className="h-4 w-full bg-stone-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
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
        ) : yearData.length === 0 ? (
          <div className="text-center py-20 text-stone-500">
            No milestone entries found.
          </div>
        ) : (
          <div className="relative">
            {/* Vertical Line (Desktop Only) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-200 hidden md:block" />

            <div className="space-y-32">
              {yearData.map((data, yearIndex) => (
                <div key={data.year} className="relative">
                  {/* Year Badge */}
                  <div className="flex justify-center mb-16 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-stone-900 text-white px-8 py-3 rounded-full text-2xl font-serif shadow-xl"
                    >
                      {data.year}
                    </motion.div>
                  </div>

                  {/* Summary Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white border border-stone-100 p-8 md:p-12 rounded-[3rem] shadow-sm mb-16 text-center max-w-3xl mx-auto ring-1 ring-stone-100"
                  >
                    <p className="text-xl text-stone-700 italic font-light mb-8">
                      "{data.summary}"
                    </p>
                    <div className="grid grid-cols-3 gap-4 border-t border-stone-50 pt-8">
                      {data.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-2xl font-bold text-indigo-600">
                            {stat.value}
                          </div>
                          <div className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Milestone Branching */}
                  <div className="space-y-12">
                    {data.milestones.map((milestone, mIndex) => {
                      const isEven = mIndex % 2 === 0;
                      return (
                        <motion.div
                          key={milestone.title}
                          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className={`flex flex-col md:flex-row items-center gap-8 ${
                            isEven ? "md:flex-row" : "md:flex-row-reverse"
                          }`}
                        >
                          {/* Milestone Card */}
                          <div className="md:w-1/2 w-full">
                            <div
                              className={`p-8 bg-white border border-stone-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all ${
                                isEven ? "md:text-right" : "md:text-left"
                              }`}
                            >
                              <div
                                className={`flex items-center gap-4 mb-4 ${
                                  isEven ? "md:justify-end" : "md:justify-start"
                                }`}
                              >
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                                  {milestone.month}
                                </span>
                                <div className="p-2 bg-stone-50 rounded-lg">
                                  {milestone.icon}
                                </div>
                              </div>
                              <h3 className="text-xl font-bold text-stone-900 mb-2">
                                {milestone.title}
                              </h3>
                              <p className="text-stone-500 text-sm leading-relaxed font-light">
                                {milestone.description}
                              </p>
                            </div>
                          </div>

                          {/* Spacer for Desktop Timeline */}
                          <div className="md:w-1/2 hidden md:block" />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- CLOSING SECTION --- */}
      <section className="container mx-auto px-6 max-w-3xl mt-48 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-3xl font-serif text-stone-900 italic">
            "And the journey continues..."
          </h2>
          <p className="text-stone-400 font-light max-w-md mx-auto">
            Every day is an opportunity to learn something new and inspire the
            next generation of changemakers.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
