"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RotateCcw, Loader2, Lightbulb } from "lucide-react";

export default function DailyTip() {
  const [tip, setTip] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTip = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: "Give me today's actionable micro-tip based on my context." }] 
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch tip");

      const reader = response.body?.getReader();
      let fullContent = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullContent += new TextDecoder().decode(value);
        }
      }
      setTip(fullContent.trim());
    } catch (error) {
      console.error(error);
      setTip("Take a 5-minute deep breathing break between your study blocks today. Your mind deserves a reset.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTip();
  }, []);

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Lightbulb size={18} />
          </div>
          <h4 className="font-bold text-primary uppercase tracking-widest text-[10px]">Today's Wellness Tip</h4>
        </div>
        <button 
          onClick={fetchTip}
          disabled={isLoading}
          className="text-primary/60 hover:text-primary transition-colors disabled:opacity-50"
          aria-label="Refresh tip"
        >
          <RotateCcw size={16} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="h-4 bg-primary/10 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-primary/10 rounded-full w-3/4 animate-pulse" />
          </motion.div>
        ) : (
          <motion.p
            key="content"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary/90 font-medium leading-relaxed"
          >
            {tip}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute -right-8 -bottom-8 bg-primary/5 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
    </div>
  );
}
