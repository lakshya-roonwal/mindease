"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Info } from "lucide-react";

const PHASES = [
  { label: "Breathe In", duration: 4, color: "text-primary", scale: 1.5, instruction: "Inhale deeply through your nose." },
  { label: "Hold", duration: 7, color: "text-accent", scale: 1.5, instruction: "Keep the breath in comfortably." },
  { label: "Breathe Out", duration: 8, color: "text-secondary", scale: 1, instruction: "Exhale slowly through your mouth." },
];

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [showDone, setShowDone] = useState(false);
  
  const audioCtx = useRef<AudioContext | null>(null);

  const playTone = (freq: number, type: OscillatorType = "sine") => {
    if (!isAudioEnabled) return;
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.5);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !showDone) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const nextIndex = (phaseIndex + 1) % PHASES.length;
            if (nextIndex === 0) {
              setCycles(c => c + 1);
              playTone(880, "triangle"); // Higher tone for cycle completion
            } else {
              playTone(nextIndex === 1 ? 440 : 330);
            }
            setPhaseIndex(nextIndex);
            return PHASES[nextIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phaseIndex, showDone, isAudioEnabled]);

  const reset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setTimeLeft(PHASES[0].duration);
    setCycles(0);
    setShowDone(false);
  };

  const currentPhase = PHASES[phaseIndex];

  return (
    <div className="space-y-8 text-center" role="timer" aria-label="4-7-8 Breathing Exercise">
      <div className="relative flex items-center justify-center py-12">
        <AnimatePresence>
          {showDone ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute z-20 bg-surface border border-border p-8 rounded-[2.5rem] shadow-2xl max-w-sm"
            >
              <h3 className="text-3xl font-black text-primary mb-2">Well done! 🌿</h3>
              <p className="text-muted-foreground leading-relaxed">
                You've completed {cycles} cycles. Notice how your body feels more centered now.
              </p>
              <button 
                onClick={reset}
                className="mt-6 bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg"
              >
                Done
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Visual Guide */}
        <div className="relative w-72 h-72">
          <motion.div
            animate={{
              scale: isActive ? currentPhase.scale : 1,
            }}
            transition={{
              duration: isActive ? currentPhase.duration : 1,
              ease: "easeInOut",
            }}
            className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border-4 border-white/50 shadow-[0_0_60px_-15px_rgba(13,148,136,0.4)] flex items-center justify-center relative z-10"
          >
            <div className="text-center">
              <span className={`text-4xl font-black uppercase tracking-widest ${currentPhase.color}`}>
                {isActive ? currentPhase.label : "4-7-8"}
              </span>
              {isActive && (
                <motion.p 
                  key={timeLeft}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-muted-foreground mt-2"
                >
                  {timeLeft}s
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* ARIA Live region for phase announcements */}
          <div className="sr-only" role="alert" aria-live="assertive">
            {isActive ? `${currentPhase.label}. ${currentPhase.instruction}` : "Ready to begin"}
          </div>

          {/* Decorative Rings */}
          <div className="absolute inset-0 -m-4 border border-primary/10 rounded-full animate-pulse" />
          <div className="absolute inset-0 -m-8 border border-accent/5 rounded-full animate-[spin_30s_linear_infinite]" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <p className="text-muted-foreground font-medium max-w-xs mx-auto italic">
          "{isActive ? currentPhase.instruction : "A natural tranquilizer for the nervous system."}"
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-10 py-4 rounded-[1.5rem] font-black text-lg transition-all active:scale-95 shadow-xl ${
              isActive 
                ? "bg-surface border-2 border-border text-foreground hover:bg-muted" 
                : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
            }`}
          >
            {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            {isActive ? "Pause" : "Start Exercise"}
          </button>

          <button
            onClick={reset}
            className="p-4 rounded-2xl bg-surface border border-border text-muted-foreground hover:text-foreground transition-all active:rotate-180 duration-500"
            aria-label="Reset exercise"
          >
            <RotateCcw size={24} />
          </button>

          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-4 rounded-2xl border transition-all ${
              isAudioEnabled ? "bg-accent/10 border-accent/20 text-accent" : "bg-surface border-border text-muted-foreground"
            }`}
            aria-label={isAudioEnabled ? "Mute audio cues" : "Enable audio cues"}
          >
            {isAudioEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Cycles</span>
            <span className="text-xl font-bold text-foreground">{cycles}</span>
          </div>
          {cycles >= 4 && !showDone && (
            <button 
              onClick={() => setShowDone(true)}
              className="text-primary font-bold hover:underline"
            >
              Finish session?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
