"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";

const AFFIRMATIONS = [
  "I am capable of handling this challenge.",
  "Progress over perfection, every single day.",
  "Every revision session builds my strength.",
  "My worth is not defined by a single exam result.",
  "I have prepared well, and I trust my knowledge.",
  "I am calm, focused, and ready.",
  "I breathe in confidence and breathe out doubt.",
  "I am doing my best, and that is enough.",
  "Challenges are opportunities for growth.",
  "I choose to be kind to myself today.",
  "My mind is sharp and my memory is strong.",
  "I am the architect of my own future.",
  "One step at a time, one page at a time.",
  "I deserve rest as much as I deserve success.",
  "I am resilient and can overcome any obstacle.",
  "I am proud of how far I have come.",
  "My intelligence is not static; it grows every day.",
  "I have the power to stay focused and productive.",
  "I will approach this exam with a clear mind.",
  "I am more than a score."
];

export default function Affirmation() {
  const [index, setIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % AFFIRMATIONS.length);
      setIsLiked(false);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MindEase Affirmation',
          text: AFFIRMATIONS[index],
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const next = () => {
    setIndex((i) => (i + 1) % AFFIRMATIONS.length);
    setIsLiked(false);
  };
  const prev = () => {
    setIndex((i) => (i === 0 ? AFFIRMATIONS.length - 1 : i - 1));
    setIsLiked(false);
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-[2.5rem] p-10 text-center space-y-8 relative overflow-hidden group">
      <div className="flex justify-between items-center relative z-10">
        <button onClick={prev} className="p-2 hover:bg-white rounded-full transition-colors text-muted-foreground"><ChevronLeft size={20}/></button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Daily Inspiration</span>
        <button onClick={next} className="p-2 hover:bg-white rounded-full transition-colors text-muted-foreground"><ChevronRight size={20}/></button>
      </div>

      <div className="min-h-[120px] flex items-center justify-center relative z-10 px-4">
        <AnimatePresence mode="wait">
          <motion.h3
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="text-3xl font-black text-foreground leading-tight tracking-tight"
          >
            {AFFIRMATIONS[index]}
          </motion.h3>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 relative z-10">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`p-4 rounded-2xl transition-all ${isLiked ? 'bg-red-50 text-red-500 scale-110' : 'bg-white text-muted-foreground hover:bg-red-50 hover:text-red-400'}`}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <button 
          onClick={handleShare}
          className="p-4 rounded-2xl bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Decorative BG element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] font-black text-primary/5 select-none pointer-events-none">
        "
      </div>
    </div>
  );
}
