"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Calculator,
  FunctionSquare,
  Binary,
  Compass,
  MessageCircle,
  GraduationCap,
} from "lucide-react";
import { getClassesAction } from "@/actions/teaching-actions"; // Adjust path if needed

type TeachingClass = {
  id: number;
  code: string;
  title: string;
  level: string;
  year: string;
  description: string;
  createdAt: Date | null;
};

// Map level to an icon
const getIconForLevel = (level: string) => {
  const levelLower = level.toLowerCase();
  if (levelLower.includes("ix"))
    return <Calculator className="text-indigo-500" size={24} />;
  if (levelLower.includes("x") && !levelLower.includes("xi"))
    return <Binary className="text-indigo-500" size={24} />;
  if (levelLower.includes("xi"))
    return <FunctionSquare className="text-indigo-500" size={24} />;
  if (levelLower.includes("xii"))
    return <Compass className="text-indigo-500" size={24} />;
  return <BookOpen className="text-indigo-500" size={24} />; // default
};

const TeachingPage = () => {
  const [courses, setCourses] = useState<TeachingClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getClassesAction();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch teaching classes:", err);
        setError("Unable to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      {/* --- HEADER SECTION --- */}
      <div className="bg-stone-50 border-b border-stone-200 py-16 mb-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif text-stone-900 mb-4">
              Teaching<span className="text-indigo-600">.</span>
            </h1>
            <p className="text-stone-500 uppercase tracking-widest text-sm font-bold flex items-center gap-2">
              <BookOpen size={16} /> Mathematics Department
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl">
        {/* --- TEACHING PHILOSOPHY --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 bg-white border border-stone-200 rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <GraduationCap size={120} />
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl font-serif text-stone-900">
              Teaching Philosophy
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed italic">
              "I am currently teaching{" "}
              <strong className="text-stone-900">
                Mathematics from Standard IX to XII
              </strong>{" "}
              at
              <strong> Yangchenphug Higher Secondary School</strong>. My
              philosophy is centered on building a strong foundation and
              fostering curiosity through inquiry-based learning."
            </p>
            <div className="flex flex-col md:flex-row md:items-center gap-6 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-3 text-indigo-600 font-medium">
                <MessageCircle size={20} />
                <span>Need help with course topics?</span>
              </div>
              <p className="text-stone-500 text-sm">
                Feel free to reach out through social forums or office hours.
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- COURSES GRID --- */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-stone-200 p-8 rounded-2xl animate-pulse"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-stone-100 rounded-xl w-12 h-12"></div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-5 w-20 bg-stone-100 rounded-full"></div>
                    <div className="h-4 w-16 bg-stone-100 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-3/4 bg-stone-100 rounded mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-stone-100 rounded"></div>
                  <div className="h-4 w-5/6 bg-stone-100 rounded"></div>
                </div>
                <div className="w-12 h-1 bg-stone-100 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-rose-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-indigo-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            No teaching classes found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white border border-stone-200 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-stone-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                    {getIconForLevel(course.level)}
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                      {course.level}
                    </span>
                    <span className="text-[10px] text-stone-400 mt-1 font-medium uppercase tracking-widest">
                      {course.year} {/* You can add semester if you have it */}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {course.code}: {course.title}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {course.description}
                </p>

                <div className="w-12 h-1 bg-stone-100 group-hover:w-full group-hover:bg-indigo-200 transition-all duration-500 rounded-full" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachingPage;
