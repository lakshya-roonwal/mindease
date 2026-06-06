"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Eye, Fingerprint, Music, Wind, Coffee } from "lucide-react";

const STEPS = [
  { id: 1, label: "5 things you see", icon: Eye, count: 5, bg: "bg-blue-50", color: "text-blue-600" },
  { id: 2, label: "4 things you feel", icon: Fingerprint, count: 4, bg: "bg-purple-50", color: "text-purple-600" },
  { id: 3, label: "3 things you hear", icon: Music, count: 3, bg: "bg-pink-50", color: "text-pink-600" },
  { id: 4, label: "2 things you smell", icon: Wind, count: 2, bg: "bg-amber-50", color: "text-amber-600" },
  { id: 5, label: "1 thing you taste", icon: Coffee, count: 1, bg: "bg-green-50", color: "text-green-600" },
];

export default function GroundingExercise() {
  const [stepIndex, setStepIndex] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + (checkedCount / currentStep.count)) / STEPS.length) * 100;

  const handleCheck = () => {
    if (checkedCount + 1 >= currentStep.count) {
      if (stepIndex + 1 >= STEPS.length) {
        setIsDone(true);
      } else {
        setStepIndex(stepIndex + 1);
        setCheckedCount(0);
      }
    } else {
      setCheckedCount(checkedCount + 1);
    }
  };

  const reset = () => {
    setStepIndex(0);
    setCheckedCount(0);
    setIsDone(false);
  };

  return (
    <div className="space-y-8 py-4">
      {!isDone ? (
        <>
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-foreground">5-4-3-2-1 Grounding</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Step {stepIndex + 1} of 5</span>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-10 rounded-[2.5rem] ${currentStep.bg} text-center space-y-6 border border-white/50`}
            >
              <div className={`${currentStep.color} bg-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-sm`}>
                <currentStep.icon size={32} />
              </div>
              <div className="space-y-2">
                <h4 className={`text-2xl font-black ${currentStep.color}`}>{currentStep.label}</h4>
                <p className="text-muted-foreground text-sm">Focus your attention and identify them one by one.</p>
              </div>

              <div className="flex justify-center gap-2">
                {Array.from({ length: currentStep.count }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      i < checkedCount 
                        ? "bg-primary text-white scale-90" 
                        : "bg-white text-muted-foreground/30"
                    }`}
                  >
                    <Check size={20} className={i < checkedCount ? "opacity-100" : "opacity-0"} />
                  </div>
                ))}
              </div>

              <button
                onClick={handleCheck}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                  currentStep.color.replace('text', 'bg')
                } opacity-90 hover:opacity-100`}
              >
                I found one
              </button>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/5 border-2 border-primary/10 p-12 rounded-[2.5rem] text-center space-y-6"
        >
          <div className="bg-primary text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl">
            <Check size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-primary">Fully Grounded</h3>
            <p className="text-muted-foreground">You've successfully anchored yourself to the present moment. Take a deep breath.</p>
          </div>
          <button 
            onClick={reset}
            className="text-primary font-bold hover:underline"
          >
            Start again?
          </button>
        </motion.div>
      )}
    </div>
  );
}
