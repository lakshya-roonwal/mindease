"use client";

import React, { useMemo } from "react";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { motion } from "framer-motion";

interface WeeklyHeatmapProps {
  checkIns: any[];
}

export default function WeeklyHeatmap({ checkIns }: WeeklyHeatmapProps) {
  const gridData = useMemo(() => {
    const data = [];
    // Start from today and go back 27 days (4 weeks total)
    for (let i = 27; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const checkIn = checkIns.find(c => isSameDay(new Date(c.createdAt), date));
      data.push({
        date,
        moodScore: checkIn?.moodScore || null,
      });
    }
    return data;
  }, [checkIns]);

  const getColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 dark:bg-gray-800";
    if (score <= 3) return "bg-red-400";
    if (score <= 6) return "bg-amber-400";
    if (score <= 8) return "bg-primary/60";
    return "bg-primary";
  };

  return (
    <div className="bg-surface border border-border/50 rounded-3xl p-6" role="img" aria-label="A 4-week calendar heatmap showing mood scores. Darker teal indicates better mood.">
      <h4 className="font-bold text-lg mb-6">Mood Heatmap (Last 4 Weeks)</h4>
      <div className="grid grid-cols-7 gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-[10px] font-black text-muted-foreground text-center mb-2">
            {day}
          </div>
        ))}
        {gridData.map((cell, i) => (
          <div key={i} className="group relative aspect-square">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.01 }}
              className={`w-full h-full rounded-md shadow-inner transition-colors ${getColor(cell.moodScore)}`}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 pointer-events-none">
              <div className="bg-black/90 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-xl">
                {format(cell.date, "MMM d")}: {cell.moodScore ? `${cell.moodScore}/10` : "No data"}
              </div>
              <div className="w-2 h-2 bg-black/90 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-end gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Low</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-[2px] bg-red-400" />
          <div className="w-3 h-3 rounded-[2px] bg-amber-400" />
          <div className="w-3 h-3 rounded-[2px] bg-primary/60" />
          <div className="w-3 h-3 rounded-[2px] bg-primary" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">High</span>
      </div>
    </div>
  );
}
