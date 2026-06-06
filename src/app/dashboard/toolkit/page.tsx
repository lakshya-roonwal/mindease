"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, 
  Square, 
  PenTool, 
  Sparkles, 
  Activity, 
  Timer, 
  ArrowRight,
  X,
  Zap
} from "lucide-react";
import BreathingExercise from "@/components/toolkit/BreathingExercise";
import BoxBreathing from "@/components/toolkit/BoxBreathing";
import JournalPrompt from "@/components/toolkit/JournalPrompt";
import Affirmation from "@/components/toolkit/Affirmation";
import GroundingExercise from "@/components/toolkit/GroundingExercise";

const TOOLS = [
  {
    id: "478",
    title: "4-7-8 Breathing",
    desc: "A natural tranquilizer for the nervous system. Great for sleep.",
    icon: Wind,
    duration: "3 min",
    color: "bg-primary/10 text-primary",
    component: BreathingExercise
  },
  {
    id: "box",
    title: "Box Breathing",
    desc: "Used by elite performers to stay calm under intense pressure.",
    icon: Square,
    duration: "4 min",
    color: "bg-accent/10 text-accent",
    component: BoxBreathing
  },
  {
    id: "grounding",
    title: "5-4-3-2-1 Grounding",
    desc: "A sensory technique to pull you out of an anxiety spiral.",
    icon: Activity,
    duration: "5 min",
    color: "bg-blue-100 text-blue-600",
    component: GroundingExercise
  },
  {
    id: "journal",
    title: "Guided Reflection",
    desc: "Respond to prompts designed to reduce exam-related stress.",
    icon: PenTool,
    duration: "5 min",
    color: "bg-purple-100 text-purple-600",
    component: JournalPrompt
  },
  {
    id: "affirm",
    title: "Daily Affirmations",
    desc: "Build mental resilience with exam-focused positive self-talk.",
    icon: Sparkles,
    duration: "1 min",
    color: "bg-secondary/10 text-secondary",
    component: Affirmation
  }
];

export default function ToolkitPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const ActiveToolComponent = activeTool ? TOOLS.find(t => t.id === activeTool)?.component : null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="flex items-center gap-4 px-4">
        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
          <Sparkles size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Wellness Toolkit</h1>
          <p className="text-muted-foreground mt-1">Science-backed exercises for immediate stress relief.</p>
        </div>
      </header>

      {/* Quick Relief Section */}
      <section className="bg-surface border border-border/50 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Zap size={20} className="fill-current" />
            <h2 className="font-black uppercase tracking-widest text-xs">Quick Relief</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.slice(0, 3).map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="flex items-center gap-4 p-4 bg-background border border-border/50 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all text-left group"
              >
                <div className={`${tool.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                  <tool.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{tool.title}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-black">{tool.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-20 -mt-20" />
      </section>

      {/* All Tools Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4"
      >
        {TOOLS.map((tool) => (
          <motion.div
            key={tool.id}
            variants={item}
            className="group bg-surface border border-border/50 rounded-[2rem] p-8 hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            onClick={() => setActiveTool(tool.id)}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className={`${tool.color} p-4 rounded-3xl group-hover:rotate-6 transition-transform`}>
                  <tool.icon size={28} />
                </div>
                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
                  <Timer size={12} className="text-muted-foreground" />
                  <span className="text-[10px] font-black uppercase text-muted-foreground">{tool.duration}</span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{tool.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{tool.desc}</p>
            </div>
            <div className="mt-8 flex items-center text-primary font-bold text-sm gap-2">
              Start Exercise <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tool Modal */}
      <AnimatePresence>
        {activeTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTool(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-surface w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-border/50"
            >
              <button
                onClick={() => setActiveTool(null)}
                className="absolute top-8 right-8 p-3 bg-muted hover:bg-muted/80 rounded-full transition-colors z-10"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              
              <div className="p-10 md:p-16 max-h-[90vh] overflow-y-auto custom-scrollbar">
                {ActiveToolComponent && <ActiveToolComponent />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="text-center px-4">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">
          These tools are designed to help with acute stress. If you're in crisis, please talk to your AI Coach or use the help links.
        </p>
      </footer>
    </div>
  );
}
