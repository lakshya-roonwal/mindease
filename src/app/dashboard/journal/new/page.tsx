"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save, Smile, Meh, Frown, Angry, Laugh } from "lucide-react";
import Link from "next/link";

const MOODS = [
  { icon: Angry, label: "Stressed", value: "stressed" },
  { icon: Frown, label: "Anxious", value: "anxious" },
  { icon: Meh, label: "Okay", value: "okay" },
  { icon: Smile, label: "Calm", value: "calm" },
  { icon: Laugh, label: "Great", value: "great" },
];

export default function NewJournalEntry() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "okay",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save entry");

      router.push("/dashboard/journal");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error saving journal entry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/journal"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Journal</span>
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !formData.content.trim()}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span className="font-bold">Save Reflection</span>
        </button>
      </div>

      <div className="bg-surface border border-border/50 rounded-3xl p-8 shadow-sm space-y-8">
        <div>
          <label htmlFor="mood" className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 text-center">
            How are you feeling right now?
          </label>
          <div className="flex justify-between max-w-md mx-auto">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                type="button"
                onClick={() => setFormData({ ...formData, mood: mood.value })}
                className={`flex flex-col items-center gap-2 group focus:outline-none`}
                aria-label={`Select mood: ${mood.label}`}
              >
                <div
                  className={`p-3 rounded-xl transition-all ${
                    formData.mood === mood.value
                      ? "bg-primary text-white scale-110 shadow-md ring-2 ring-primary/20 ring-offset-2"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <mood.icon size={24} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  formData.mood === mood.value ? "text-primary" : "text-muted-foreground"
                }`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Give your reflection a title (optional)..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full text-2xl font-bold bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/30 outline-none"
            aria-label="Reflection title"
          />
          <textarea
            placeholder="Start typing your thoughts here... What's on your mind? How's the prep going?"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={12}
            className="w-full bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/30 outline-none resize-none text-lg leading-relaxed"
            aria-label="Reflection content"
            required
          />
        </div>
      </div>
    </motion.div>
  );
}
