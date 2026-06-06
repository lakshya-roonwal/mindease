"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

const PHASES = [
  { label: "Inhale", duration: 4, x: 0, y: 0, nextX: 100, nextY: 0 },
  { label: "Hold", duration: 4, x: 100, y: 0, nextX: 100, nextY: 100 },
  { label: "Exhale", duration: 4, x: 100, y: 100, nextX: 0, nextY: 100 },
  { label: "Hold", duration: 4, x: 0, y: 100, nextX: 0, nextY: 0 },
];

export default function BoxBreathing() {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setPhaseIndex((p) => (p + 1) % PHASES.length);
            return 0;
          }
          return prev + (100 / (PHASES[phaseIndex].duration * 10));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive, phaseIndex]);

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="space-y-8 text-center" role="timer" aria-label="Box Breathing Exercise">
      <div className="relative w-64 h-64 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Background Square */}
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2"
            rx="8"
          />
          
          {/* Animated Progress Path */}
          <motion.rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="4"
            rx="8"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: (phaseIndex / 4) + (progress / 400)
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          />

          {/* Corner Highlights */}
          {[
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
          ].map((pos, i) => (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r="4"
              fill={phaseIndex === i ? "var(--primary)" : "var(--border)"}
              className="transition-colors duration-300"
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={currentPhase.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-black text-primary uppercase tracking-tighter"
          >
            {isActive ? currentPhase.label : "Box Breath"}
          </motion.span>
          <span className="text-sm font-bold text-muted-foreground mt-1">4s - 4s - 4s - 4s</span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => { setIsActive(false); setPhaseIndex(0); setProgress(0); }}
          className="p-3 rounded-2xl bg-surface border border-border text-muted-foreground hover:text-foreground transition-all"
          aria-label="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="sr-only" role="alert" aria-live="polite">
        {isActive ? `Current phase: ${currentPhase.label}` : "Ready to start"}
      </div>
    </div>
  );
}
