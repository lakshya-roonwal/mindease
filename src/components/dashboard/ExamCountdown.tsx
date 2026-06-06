"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface ExamCountdownProps {
  examDate: string | Date | null | undefined;
  examType: string | null | undefined;
}

export default function ExamCountdown({
  examDate,
  examType,
}: ExamCountdownProps) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!examDate) return;

    const calculateDays = () => {
      const target = new Date(examDate);
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, [examDate]);

  if (!examDate) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-surface p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between overflow-hidden relative"
    >
      <div className="z-10">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {examType || "Exam"} Countdown
        </p>
        <h3 className="text-3xl font-bold text-foreground mt-1">
          {daysLeft} Days to go
        </h3>
        <p className="text-xs text-primary font-medium mt-1">
          Focus on progress, not perfection.
        </p>
      </div>
      <div className="bg-primary/10 p-4 rounded-full z-10">
        <Calendar className="h-10 w-10 text-primary" />
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
    </motion.div>
  );
}
