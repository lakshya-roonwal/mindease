"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, AlertCircle, Sparkles } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface Exam {
  id: string;
  type: string;
  date: string | Date;
}

export default function ExamCountdown({ exams }: { exams: Exam[] }) {
  if (!exams || exams.length === 0) return null;

  // Sort by date and get the closest one
  const nextExam = [...exams].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];

  const daysLeft = differenceInDays(new Date(nextExam.date), new Date());
  
  const getUrgencyColor = (days: number) => {
    if (days > 60) return "text-green-600 bg-green-50 border-green-100";
    if (days > 30) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-red-600 bg-red-50 border-red-100";
  };

  const getMotivationalMessage = (days: number) => {
    if (days > 60) return "A marathon, not a sprint. Pace yourself!";
    if (days > 30) return "Solid progress! Focus on your weakest areas now.";
    if (days > 7) return "The home stretch. Your preparation is your power.";
    return "Focus, breathe, and trust your journey. You've got this.";
  };

  const colorClasses = getUrgencyColor(daysLeft);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-6 rounded-[2rem] border-2 ${colorClasses} shadow-sm space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/80 rounded-xl shadow-sm">
            <Calendar size={20} />
          </div>
          <h3 className="font-bold text-sm uppercase tracking-widest">{nextExam.type} Countdown</h3>
        </div>
        <div className="px-3 py-1 bg-white/80 rounded-full text-xs font-black">
          {format(new Date(nextExam.date), "MMM d, yyyy")}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black tabular-nums">{daysLeft}</span>
        <span className="text-xl font-bold opacity-80">days to go</span>
      </div>

      <div className="pt-2 flex items-start gap-2">
        <Sparkles size={16} className="mt-0.5 shrink-0" />
        <p className="text-sm font-medium italic leading-relaxed">
          {getMotivationalMessage(daysLeft)}
        </p>
      </div>
    </motion.div>
  );
}
