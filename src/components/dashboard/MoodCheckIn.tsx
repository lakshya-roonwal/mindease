"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Frown, Meh, Laugh, Angry, Loader2, Check } from "lucide-react";

const MOODS = [
  { icon: Angry, label: "Stressed", color: "text-red-500", bg: "bg-red-50", score: 2 },
  { icon: Frown, label: "Anxious", color: "text-amber-500", bg: "bg-amber-50", score: 4 },
  { icon: Meh, label: "Okay", color: "text-blue-500", bg: "bg-blue-50", score: 6 },
  { icon: Smile, label: "Calm", color: "text-primary", bg: "bg-primary/10", score: 8 },
  { icon: Laugh, label: "Great", color: "text-green-500", bg: "bg-green-50", score: 10 },
];

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleMoodSelect = async (index: number) => {
    setSelectedMood(index);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/insights/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodScore: MOODS[index].score,
          energyLevel: 5, // Default for now
          triggers: "Study, Exams", // Placeholder
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to check in:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface p-8 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">How are you feeling today?</h2>
        <p className="text-muted-foreground mt-1">Check in with yourself to track your emotional well-being.</p>
      </div>

      <div className="flex justify-between items-center max-w-md mx-auto relative z-10">
        {MOODS.map((mood, index) => (
          <button
            key={mood.label}
            onClick={() => handleMoodSelect(index)}
            disabled={isSubmitting || isSuccess}
            className="flex flex-col items-center gap-3 group focus:outline-none disabled:opacity-50"
            aria-label={`Mood: ${mood.label}`}
          >
            <div
              className={`p-4 rounded-2xl transition-all duration-300 ${
                selectedMood === index
                  ? `${mood.bg} ${mood.color} scale-110 shadow-md ring-2 ring-offset-2 ring-current`
                  : "bg-background text-muted-foreground hover:bg-muted group-hover:scale-105"
              }`}
            >
              <mood.icon className="h-8 w-8" />
            </div>
            <span
              className={`text-xs font-semibold tracking-wide uppercase transition-colors ${
                selectedMood === index ? mood.color : "text-muted-foreground"
              }`}
            >
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {(isSubmitting || isSuccess) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-20"
          >
            {isSubmitting ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="font-bold text-primary uppercase tracking-widest text-[10px]">Saving...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-green-500 text-white p-2 rounded-full">
                  <Check size={24} />
                </div>
                <p className="font-bold text-green-600 uppercase tracking-widest text-[10px]">Logged!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
