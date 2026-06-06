"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Send, CheckCircle2, Loader2 } from "lucide-react";

const PROMPTS = [
  "What is one thing I can control today?",
  "What am I most afraid of, and is that fear realistic?",
  "Describe a moment this week when you felt proud of yourself.",
  "What would you tell a friend who felt exactly how you do right now?",
  "List 3 things that went well in your studies this week.",
  "How can I be kinder to myself during this exam season?",
  "What does success look like to me beyond my grades?",
  "What is a small win I had today?",
  "Name a stressor you can let go of right now.",
  "What is one thing you are grateful for today?"
];

export default function JournalPrompt() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const shuffle = () => {
    setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
    setIsDone(false);
  };

  const handleSave = async () => {
    if (content.length < 50) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Prompt: ${PROMPTS[promptIndex].substring(0, 30)}...`,
          content: content,
          mood: "Reflective"
        }),
      });
      if (res.ok) {
        setIsDone(true);
        setContent("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <CheckCircle2 size={20} className="text-primary" />
          Guided Reflection
        </h3>
        <button 
          onClick={shuffle}
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-widest"
        >
          <RefreshCw size={14} /> New Prompt
        </button>
      </div>

      <motion.div
        key={promptIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-accent/5 border border-accent/10 p-6 rounded-2xl"
      >
        <p className="text-lg font-medium text-foreground leading-relaxed italic">
          "{PROMPTS[promptIndex]}"
        </p>
      </motion.div>

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your heart out..."
          rows={6}
          className="w-full p-6 bg-surface border border-border/50 rounded-3xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all resize-none text-base"
        />
        <div className="absolute bottom-4 right-6 flex items-center gap-4">
          <span className={`text-[10px] font-black uppercase tracking-widest ${content.length >= 50 ? 'text-green-500' : 'text-muted-foreground'}`}>
            {content.length} / 50 characters
          </span>
          <button
            onClick={handleSave}
            disabled={content.length < 50 || isSubmitting}
            className="bg-primary text-white p-2 rounded-xl disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            aria-label="Save reflection"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-700 font-bold text-sm"
          >
            <CheckCircle2 size={18} />
            Saved to your journal!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
