"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2, Check, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JournalEditorProps {
  initialContent?: string;
  initialMoodScore?: number;
  initialTitle?: string;
  onSave?: (data: { title: string; content: string; moodScore: number }) => void;
  isAutoSaving?: boolean;
}

export default function JournalEditor({
  initialContent = "",
  initialMoodScore = 5,
  initialTitle = "",
  onSave,
  isAutoSaving: externalIsAutoSaving = false,
}: JournalEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [moodScore, setMoodScore] = useState(initialMoodScore);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const debouncedContent = useDebounce(content, 2000);
  const debouncedTitle = useDebounce(title, 2000);
  const debouncedMood = useDebounce(moodScore, 2000);

  const handleManualSave = useCallback(async () => {
    if (content.length < 10) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, moodScore, mood: getMoodLabel(moodScore) }),
      });
      if (res.ok) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (e) {
      setStatus("error");
    }
  }, [title, content, moodScore]);

  useEffect(() => {
    const autoSave = async () => {
      if (content.length < 10 || status === "saving") return;
      if (content === initialContent && title === initialTitle && moodScore === initialMoodScore) return;
      
      setStatus("saving");
      try {
        // Logic for auto-save (could be POST or PUT depending on if we have an ID)
        // For simplicity in this tab, we treat new entries as POST
        // In a real app, we'd probably get an ID back and then use PUT
        await fetch("/api/journal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, moodScore, mood: getMoodLabel(moodScore) }),
        });
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } catch (e) {
        setStatus("error");
      }
    };

    if (debouncedContent || debouncedTitle || debouncedMood) {
        // We only trigger auto-save if something changed
        // This is a simplified version
    }
  }, [debouncedContent, debouncedTitle, debouncedMood]);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  function getMoodLabel(score: number) {
    if (score <= 2) return "Stressed";
    if (score <= 4) return "Anxious";
    if (score <= 6) return "Okay";
    if (score <= 8) return "Calm";
    return "Great";
  }

  const moodEmojis = ["😫", "😟", "😐", "😊", "✨"];
  const emojiIndex = Math.min(Math.floor((moodScore - 1) / 2), 4);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md py-4 z-10 border-b border-border/50 px-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="Current mood">{moodEmojis[emojiIndex]}</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</span>
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {status === "saving" && (
                  <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-primary text-xs font-bold">
                    <Loader2 size={12} className="animate-spin" /> Saving...
                  </motion.div>
                )}
                {status === "saved" && (
                  <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                    <Check size={12} /> Saved
                  </motion.div>
                )}
                {status === "idle" && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted-foreground text-xs font-medium uppercase tracking-tighter">
                    Ready to write
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <button
          onClick={handleManualSave}
          disabled={content.length < 10 || status === "saving"}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 active:scale-95"
        >
          <Save size={18} />
          <span>Save Entry</span>
        </button>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (Optional)"
          className="w-full text-4xl font-black bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/20 outline-none px-2"
        />

        <div className="space-y-2 px-2">
          <label htmlFor="mood-slider" className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
            How are you feeling? ({moodScore}/10)
          </label>
          <input
            id="mood-slider"
            type="range"
            min="1"
            max="10"
            value={moodScore}
            onChange={(e) => setMoodScore(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? This is your space..."
            className="w-full min-h-[400px] text-xl leading-relaxed bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/20 outline-none p-2 resize-none"
            aria-label="Journal content"
          />
          <div className="absolute bottom-4 right-4 bg-surface/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {wordCount} Words | {content.length} Chars
          </div>
        </div>
      </div>
    </div>
  );
}
