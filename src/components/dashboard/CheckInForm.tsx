"use client";

import React, { useState } from "react";
import MoodSlider from "./MoodSlider";
import TriggerTags from "./TriggerTags";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckInForm() {
  const [step, setStep] = useState(1);
  const [moodScore, setMoodScore] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/insights/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moodScore,
          energyLevel,
          triggers: selectedTags.join(", "),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit check-in");
      
      setIsSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-border/50 rounded-[2.5rem] p-8 shadow-sm">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-4"
          >
            <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Logged!</h3>
            <p className="text-muted-foreground">Your patterns are being analysed. Keep it up!</p>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {step === 1 && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold">Step 1: Mood & Energy</h3>
                <MoodSlider value={moodScore} onChange={setMoodScore} />
                <div className="space-y-4">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
                    Energy Level: {energyLevel} / 10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  Next <ArrowRight size={20} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold">Step 2: Triggers</h3>
                <TriggerTags selectedTags={selectedTags} onChange={setSelectedTags} />
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-bold active:scale-95 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                    {isSubmitting ? "Submitting..." : "Finish Check-in"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
