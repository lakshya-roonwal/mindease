"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Calendar, 
  Flame, 
  Activity, 
  Loader2, 
  ArrowRight,
  Info,
  ChevronDown
} from "lucide-react";
import MoodTrendChart from "@/components/charts/MoodTrendChart";
import TriggerHeatmap from "@/components/charts/TriggerHeatmap";
import MoodDistribution from "@/components/charts/MoodDistribution";
import WeeklyHeatmap from "@/components/charts/WeeklyHeatmap";
import Link from "next/link";

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/insights");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load insights:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Analysing your patterns...</p>
      </div>
    );
  }

  const hasEnoughData = data?.checkIns?.length >= 3;

  if (!hasEnoughData) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <Activity className="text-primary h-12 w-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-foreground tracking-tight">Almost there!</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We need at least <span className="font-bold text-foreground underline decoration-primary decoration-4 underline-offset-4">3 check-ins</span> to generate meaningful insights. Check in today to start your data journey.
          </p>
        </div>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
        >
          Check in Now <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  const bestDayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    data.dowAverages.sort((a: any, b: any) => b.average - a.average)[0].day
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Your Wellness Journey</h1>
          <p className="text-muted-foreground mt-2">Personalized insights based on your recent activity.</p>
        </div>
        
        <div className="flex bg-surface border border-border/50 p-1 rounded-2xl shadow-sm self-start">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                days === d 
                  ? "bg-primary text-white shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Avg Mood", value: data.averages.last30Days.toFixed(1), icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "Best Day", value: bestDayName, icon: Calendar, color: "text-accent", bg: "bg-accent/10" },
          { label: "Streak", value: `${data.streakCount} Days`, icon: Flame, color: "text-secondary", bg: "bg-secondary/10" },
          { label: "Check-ins", value: data.checkIns.length, icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface border border-border/50 p-6 rounded-3xl shadow-sm"
          >
            <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Trend */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <TrendingUp size={20} className="text-primary" />
          <h2 className="text-xl font-bold">Mood & Energy Trend</h2>
        </div>
        <MoodTrendChart data={data.checkIns} days={days} />
      </section>

      {/* AI Insight Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 relative overflow-hidden group"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
          <div className="bg-primary text-white p-4 rounded-3xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Info size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-primary tracking-tight">Weekly Smart Insight</h3>
            <p className="text-primary/80 text-lg leading-relaxed max-w-3xl">
              Based on your data, you tend to feel most stressed on <span className="font-bold text-primary underline decoration-2 underline-offset-4">{bestDayName === "Monday" ? "Tuesday" : "Mondays"}</span> and most energized in the <span className="font-bold text-primary underline decoration-2 underline-offset-4">{data.bestTime.toLowerCase()}s</span>. 
              Consider scheduling heavier revision blocks during your {data.bestTime.toLowerCase()} sessions and taking longer breaks on your low-energy days.
            </p>
          </div>
        </div>
        {/* Background blobs */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <TriggerHeatmap triggerMap={data.triggerMap} />
        <MoodDistribution checkIns={data.checkIns} />
      </div>

      <WeeklyHeatmap checkIns={data.checkIns} />
    </motion.div>
  );
}
