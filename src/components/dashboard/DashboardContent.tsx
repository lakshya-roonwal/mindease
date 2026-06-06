"use client";

import { motion } from "framer-motion";
import StreakTracker from "./StreakTracker";
import ExamCountdown from "./ExamCountdown";
import MoodCheckIn from "./MoodCheckIn";
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
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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
      <motion.header variants={itemVariants}>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          Welcome back, {userName} <span className="text-primary">✨</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Take a deep breath. Let's make today a calm and productive one.
        </p>
      </motion.header>

      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <StreakTracker count={streakCount} />
        <ExamCountdown examDate={examDate} examType={examType} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <MoodCheckIn />
      </motion.div>

      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Quick Meditation",
              desc: "A 5-minute breathing exercise to reset.",
              icon: Sparkles,
              color: "bg-primary/10 text-primary",
              href: "/dashboard/calm",
            },
            {
              title: "Reflective Journal",
              desc: "Write down three things you're grateful for.",
              icon: ArrowRight,
              color: "bg-accent/10 text-accent",
              href: "/dashboard/journal",
            },
            {
              title: "AI Support",
              desc: "Feeling overwhelmed? Talk to your AI guide.",
              icon: Sparkles,
              color: "bg-secondary/10 text-secondary",
              href: "/dashboard/ai",
            },
          ].map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-surface p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all hover:border-primary/20"
            >
              <div
                className={`${action.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
