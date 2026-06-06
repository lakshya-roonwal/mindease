"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, Save, BookOpen, Smile, Meh, Frown, Angry, Laugh } from "lucide-react";

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood: string | null;
  createdAt: string;
}

const MOODS = [
  { icon: Angry, label: "Stressed", value: "Stressed" },
  { icon: Frown, label: "Anxious", value: "Anxious" },
  { icon: Meh, label: "Okay", value: "Okay" },
  { icon: Smile, label: "Calm", value: "Calm" },
  { icon: Laugh, label: "Great", value: "Great" },
];

export default function JournalView({ initialEntries }: { initialEntries: JournalEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [isCreating, setIsCreating] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "", mood: "Okay" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.content.trim()) return;
    
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      const savedEntry = await res.json();
      setEntries([savedEntry, ...entries]);
      setIsCreating(false);
      setNewEntry({ title: "", content: "", mood: "Okay" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving your reflection.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Reflection Journal</h1>
          <p className="text-muted-foreground mt-1">Your private space to vent, dream, and track your growth.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium active:scale-95"
          aria-label="New Journal Entry"
        >
          <Plus size={20} />
          <span>New Reflection</span>
        </button>
      </header>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface border border-border/50 p-8 rounded-3xl shadow-xl relative"
          >
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-6 right-6 p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest text-center">
                  How are you feeling right now?
                </label>
                <div className="flex justify-between max-w-md mx-auto">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setNewEntry({ ...newEntry, mood: mood.value })}
                      className={`flex flex-col items-center gap-2 group focus:outline-none transition-all ${
                        newEntry.mood === mood.value ? "scale-110" : "opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Select mood: ${mood.label}`}
                    >
                      <div
                        className={`p-3 rounded-2xl transition-all ${
                          newEntry.mood === mood.value
                            ? "bg-primary text-white shadow-md ring-4 ring-primary/10"
                            : "bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <mood.icon size={24} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        newEntry.mood === mood.value ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <input
                  id="title"
                  type="text"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/30 outline-none"
                  placeholder="Reflection Title (Optional)"
                  aria-label="Reflection title"
                />
                <textarea
                  id="content"
                  required
                  rows={8}
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  className="w-full bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/30 outline-none resize-none text-lg leading-relaxed"
                  placeholder="Start typing your thoughts here... What's on your mind today?"
                  aria-label="Reflection content"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !newEntry.content.trim()}
                  className="bg-primary text-white px-8 py-3 rounded-2xl flex items-center gap-2 disabled:opacity-50 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save to My Space
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
        role="list"
      >
        {entries.length === 0 ? (
          <motion.div variants={item} className="text-center py-24 border-2 border-dashed rounded-[2rem] border-border/50 bg-accent/5">
            <BookOpen className="h-16 w-12 text-primary/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">A blank page is a fresh start</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              Regular journaling can lower stress and help you process exam pressure.
            </p>
            <button 
              onClick={() => setIsCreating(true)}
              className="mt-6 text-primary font-bold hover:underline underline-offset-4"
            >
              Write my first entry
            </button>
          </motion.div>
        ) : (
          entries.map((entry) => (
            <motion.div
              key={entry.id}
              variants={item}
              whileHover={{ y: -4 }}
              className="bg-surface border border-border/50 p-8 rounded-[2rem] shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-default group"
              role="listitem"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {entry.title || "Untitled Reflection"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <span className="capitalize">{new Date(entry.createdAt).toLocaleDateString(undefined, { 
                      weekday: 'short',
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span>•</span>
                    <span>{new Date(entry.createdAt).toLocaleTimeString(undefined, { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}</span>
                  </div>
                </div>
                {entry.mood && (
                  <span className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-primary/10">
                    {entry.mood}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                {entry.content}
              </p>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
