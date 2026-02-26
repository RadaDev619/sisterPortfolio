"use client"; // Required for animations

import { motion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function BioPage() {
  const interests = [
    "Mathematics Education",
    "STEM Advocacy",
    "Girls in STEM",
    "Youth Leadership",
    "Sustainability Education",
    "Global Citizenship",
    "Community Engagement",
  ];

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-800 selection:bg-indigo-100">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col items-center text-center">
            {/* Aesthetic Smaller Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-20 -z-10 animate-pulse"></div>
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-white shadow-xl overflow-hidden ring-1 ring-stone-100">
                <img
                  src="/profile.jpg"
                  alt="Sonam Zangmo"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-stone-100"
              >
                <Sparkles className="text-amber-500 w-5 h-5" />
              </motion.div>
            </motion.div>

            {/* Typography with Hierarchy */}
            <motion.div {...fadeInUp}>
              <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-4 tracking-tight">
                Sonam Zangmo
              </h1>
              <p className="flex items-center justify-center gap-2 text-stone-500 font-medium tracking-wide uppercase text-sm mb-8">
                <MapPin size={16} className="text-indigo-500" /> Thimphu, Bhutan
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="container mx-auto px-6 max-w-3xl pb-24">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-6 text-lg leading-relaxed text-stone-600 font-light"
        >
          <p>
            I am{" "}
            <span className="text-stone-900 font-medium">Sonam Zangmo</span>, a
            Mathematics Educator at
            <span className="italic">
              {" "}
              Yangchenphug Higher Secondary School
            </span>
            . Beyond formulas and equations, my mission is to foster a
            generation of innovators and changemakers.
          </p>
          <p>
            As a{" "}
            <span className="text-stone-900 font-medium underline decoration-indigo-200 underline-offset-4">
              Scout Master
            </span>{" "}
            and
            <span className="text-stone-900 font-medium underline decoration-indigo-200 underline-offset-4">
              {" "}
              UNESCO ASPNET Focal Point
            </span>
            , I lead initiatives that blend global sustainability with local
            youth leadership.
          </p>
          <p>
            I believe that{" "}
            <span className="text-indigo-600 font-semibold">
              STEM is for everyone
            </span>
            . By organizing Bhutan’s first National Girls STEM Camp, I’ve seen
            firsthand how providing the right tools can empower young women to
            shape the future of our nation.
          </p>
        </motion.div>
      </section>

      {/* --- EDUCATION & INTERESTS (SIDE BY SIDE) --- */}
      <section className="bg-stone-50 py-24 border-y border-stone-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Education List */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-serif text-stone-900 flex items-center gap-3">
                <GraduationCap className="text-indigo-500" /> Education
              </h2>
              <div className="space-y-6">
                <div className="group">
                  <h3 className="font-bold text-stone-800 group-hover:text-indigo-600 transition-colors">
                    PGDE (Mathematics)
                  </h3>
                  <p className="text-stone-500 text-sm italic">
                    Samtse College of Education
                  </p>
                </div>
                <div className="group">
                  <h3 className="font-bold text-stone-800 group-hover:text-indigo-600 transition-colors">
                    BSc Physical Science
                  </h3>
                  <p className="text-stone-500 text-sm italic">
                    Sherubtse College
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Interest Tags with Staggered Animation */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-serif text-stone-900 flex items-center gap-3">
                <Lightbulb className="text-amber-500" /> Focus Areas
              </h2>
              <motion.div
                variants={staggerContainer}
                className="flex flex-wrap gap-2"
              >
                {interests.map((tag) => (
                  <motion.span
                    key={tag}
                    variants={fadeInUp}
                    whileHover={{ y: -2 }}
                    className="px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold text-stone-600 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="container mx-auto px-6"
        >
          <BookOpen className="mx-auto mb-6 text-indigo-100" size={48} />
          <h2 className="text-2xl font-serif italic text-stone-400">
            "Education is the most powerful weapon which you can use to change
            the world."
          </h2>
        </motion.div>
      </section>
    </div>
  );
}
