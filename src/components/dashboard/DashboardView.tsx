"use client";

import { motion } from "framer-motion";
import StreakTracker from "./StreakTracker";
import ExamCountdown from "./ExamCountdown";
import MoodCheckIn from "./MoodCheckIn";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DashboardViewProps {
  user: {
    name: string | null;
    examType: string | null;
    examDate: Date | null;
  };
  streakCount: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function DashboardView({ user, streakCount }: DashboardViewProps) {
  const firstName = user.name?.split(" ")[0] || "there";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      <motion.header variants={item}>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          Welcome back, {firstName} <span className="text-primary" aria-hidden="true">✨</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Take a deep breath. Let's make today a calm and productive one.
        </p>
      </motion.header>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakTracker count={streakCount} />
        <ExamCountdown 
          examDate={user.examDate} 
          examType={user.examType} 
        />
      </motion.div>

      <motion.div variants={item}>
        <MoodCheckIn />
      </motion.div>

      <motion.section variants={item}>
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
              href: "/dashboard/breathe"
            },
            {
              title: "Reflective Journal",
              desc: "Write down three things you're grateful for.",
              icon: ArrowRight,
              color: "bg-accent/10 text-accent",
              href: "/dashboard/journal"
            },
            {
              title: "AI Support",
              desc: "Feeling overwhelmed? Talk to your AI guide.",
              icon: Sparkles,
              color: "bg-secondary/10 text-secondary",
              href: "/dashboard/chat"
            }
          ].map((action) => (
            <Link 
              key={action.title}
              href={action.href}
              className="group bg-surface p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all hover:border-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label={`Go to ${action.title}: ${action.desc}`}
            >
              <div className={`${action.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {action.desc}
              </p>
            </Link>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
