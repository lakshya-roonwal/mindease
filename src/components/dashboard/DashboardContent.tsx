"use client";

import { motion } from "framer-motion";
import StreakTracker from "./StreakTracker";
import ExamCountdown from "./ExamCountdown";
import MoodCheckIn from "./MoodCheckIn";
import DailyTip from "@/components/coach/DailyTip";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DashboardContentProps {
  userName: string;
  streakCount: number;
  examDate: Date | null | undefined;
  examType: string | null | undefined;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardContent({
  userName,
  streakCount,
  examDate,
  examType,
}: DashboardContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-10">
          <header>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
              Welcome back, {userName} <span className="text-primary">✨</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Take a deep breath. Let's make today a calm and productive one.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StreakTracker count={streakCount} />
            <ExamCountdown examDate={examDate} examType={examType} />
          </div>

          <MoodCheckIn />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <DailyTip />
          
          <section className="bg-surface border border-border/50 rounded-3xl p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Recommended Actions</h2>
            <div className="space-y-3">
              {[
                { title: "Box Breathing", href: "/dashboard/breathe", color: "bg-primary/10 text-primary" },
                { title: "Reflect in Journal", href: "/dashboard/journal", color: "bg-accent/10 text-accent" },
                { title: "Talk to Coach", href: "/dashboard/coach", color: "bg-secondary/10 text-secondary" },
              ].map((a) => (
                <Link 
                  key={a.title}
                  href={a.href}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${a.color} p-2 rounded-lg`}>
                      <ArrowRight size={16} />
                    </div>
                    <span className="font-bold text-sm">{a.title}</span>
                  </div>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>
        </motion.div>
      </div>

      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Your Progress</h2>
        </div>
        {/* Additional widgets can go here */}
      </motion.section>
    </motion.div>
  );
}
