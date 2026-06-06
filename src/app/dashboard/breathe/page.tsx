"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Play, Pause, RotateCcw, Info } from "lucide-react";

const PHASES = [
  { label: "Inhale", duration: 4, color: "text-primary", scale: 1.5 },
  { label: "Hold", duration: 4, color: "text-accent", scale: 1.5 },
  { label: "Exhale", duration: 4, color: "text-secondary", scale: 1 },
  { label: "Hold", duration: 4, color: "text-muted-foreground", scale: 1 },
];

export default function BreathePage() {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PHASES[0].duration);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const nextIndex = (phaseIndex + 1) % PHASES.length;
            setPhaseIndex(nextIndex);
            return PHASES[nextIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phaseIndex]);

  const reset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setTimeLeft(PHASES[0].duration);
  };

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-10 text-center">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-3">
          <Wind className="text-primary h-10 w-10" />
          Calm Corner
        </h1>
        <p className="text-lg text-muted-foreground">
          Take a moment to center yourself with box breathing.
        </p>
      </header>

      <div className="relative flex items-center justify-center py-20">
        {/* Breathing Circle */}
        <motion.div
          animate={{
            scale: isActive ? currentPhase.scale : 1,
          }}
          transition={{
            duration: currentPhase.duration,
            ease: "easeInOut",
          }}
          className={`w-64 h-64 rounded-full border-8 border-primary/20 bg-primary/5 flex items-center justify-center relative transition-colors duration-500 shadow-[0_0_50px_-12px_rgba(13,148,136,0.3)]`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-center"
            >
              <p className={`text-4xl font-black uppercase tracking-widest ${currentPhase.color}`}>
                {isActive ? currentPhase.label : "Ready?"}
              </p>
              {isActive && (
                <p className="text-2xl font-bold text-muted-foreground mt-2">
                  {timeLeft}s
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Decorative Outer Rings */}
          <div className="absolute inset-0 -m-8 border border-primary/10 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-0 -m-12 border border-accent/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 ${
            isActive 
              ? "bg-surface text-foreground border border-border hover:bg-muted" 
              : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
          }`}
          aria-label={isActive ? "Pause breathing exercise" : "Start breathing exercise"}
        >
          {isActive ? (
            <><Pause size={24} fill="currentColor" /> Pause</>
          ) : (
            <><Play size={24} fill="currentColor" className="ml-1" /> Start</>
          )}
        </button>

        <button
          onClick={reset}
          className="p-4 rounded-2xl bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95"
          aria-label="Reset exercise"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-accent/5 border border-accent/10 rounded-3xl p-6 text-left max-w-md mx-auto"
      >
        <div className="flex gap-4 items-start">
          <div className="bg-accent/20 p-2 rounded-lg mt-1">
            <Info className="text-accent h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-foreground">Why Box Breathing?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Box breathing is a powerful stress management technique used by athletes and students alike to clear the mind and improve focus.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
