"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  BarChart2,
  MoreVertical
} from "lucide-react";
import { format } from "date-fns";

interface EntryCardProps {
  entry: {
    id: string;
    title: string | null;
    content: string;
    mood: string | null;
    moodScore: number | null;
    createdAt: string;
  };
  onDelete: (id: string) => void;
  onEdit: (entry: any) => void;
}

export default function EntryCard({ entry, onDelete, onEdit }: EntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const getMoodEmoji = (score: number | null) => {
    if (!score) return "😐";
    if (score <= 2) return "😫";
    if (score <= 4) return "😟";
    if (score <= 6) return "😐";
    if (score <= 8) return "😊";
    return "✨";
  };

  const wordCount = entry.content.trim().split(/\s+/).length;

  return (
    <motion.div
      layout
      className="bg-surface border border-border/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center text-xl">
              {getMoodEmoji(entry.moodScore)}
            </div>
            <div>
              <h3 className="font-bold text-foreground truncate max-w-[200px] md:max-w-md">
                {entry.title || "Untitled Reflection"}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Calendar size={12} />
                {format(new Date(entry.createdAt), "EEEE, d MMM yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="hidden md:flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <BarChart2 size={12} />
                {wordCount} Words
             </div>
             <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
                aria-label={isExpanded ? "Collapse entry" : "Expand entry"}
             >
               {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
             </button>
          </div>
        </div>

        <div className="mt-4">
          <p className={`text-muted-foreground leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
            {entry.content}
          </p>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-border/50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  {entry.mood && (
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Mood</span>
                       <span className="text-sm font-bold text-primary">{entry.mood}</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Score</span>
                     <span className="text-sm font-bold text-foreground">{entry.moodScore}/10</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(entry)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all font-bold text-xs"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-surface/95 backdrop-blur-sm flex items-center justify-center p-6 z-20"
          >
            <div className="text-center space-y-4">
              <div className="bg-red-100 text-red-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-lg">Delete this reflection?</h4>
                <p className="text-muted-foreground text-sm">This action can be undone later from trash.</p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-6 py-2 rounded-xl bg-muted text-foreground font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(entry.id);
                    setShowConfirmDelete(false);
                  }}
                  className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold text-xs"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
