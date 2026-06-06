"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakTrackerProps {
  count: number;
}

export default function StreakTracker({ count }: StreakTrackerProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-surface p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between"
    >
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Current Streak
        </p>
        <h3 className="text-3xl font-bold text-foreground mt-1 flex items-center gap-2">
          {count} {count === 1 ? "Day" : "Days"}
          {count > 7 && <span title="On Fire!" aria-label="On fire">🔥</span>}
        </h3>
        <p className="text-xs text-secondary font-medium mt-1">
          Keep it up! You're doing great.
        </p>
      </div>
      <div className="bg-secondary/10 p-4 rounded-full">
        <Flame className="h-10 w-10 text-secondary fill-secondary/20" />
      </div>
    </motion.div>
  );
}
