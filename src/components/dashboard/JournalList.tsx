"use client";

import { motion } from "framer-motion";
import { Plus, Book, Calendar as CalendarIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood: string | null;
  createdAt: string;
}

interface JournalListProps {
  entries: JournalEntry[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function JournalList({ entries }: JournalListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Your Reflections</h2>
        <Link
          href="/dashboard/journal/new"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
          aria-label="Create new journal entry"
        >
          <Plus size={20} />
          <span className="font-medium">New Entry</span>
        </Link>
      </div>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-dashed border-border rounded-3xl p-12 text-center"
        >
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="text-primary h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No reflections yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Journaling helps clarify your thoughts and reduce exam anxiety. Start your first entry today.
          </p>
          <Link
            href="/dashboard/journal/new"
            className="mt-6 inline-block text-primary font-semibold hover:underline"
          >
            Create my first entry
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4"
          role="list"
        >
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              variants={item}
              whileHover={{ x: 4 }}
              className="group bg-surface border border-border/50 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
              role="listitem"
            >
              <div className="bg-accent/10 p-3 rounded-xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                <Book size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground truncate">
                  {entry.title || "Untitled Reflection"}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarIcon size={14} />
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {entry.mood && (
                    <span className="bg-primary/5 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {entry.mood}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
