"use client";

import React from "react";
import { motion } from "framer-motion";

const DEFAULT_TAGS = [
  "Study Stress", "Sleep", "Health", "Social", "Finance", 
  "Family", "Exams", "Personal", "Time Management", "Other"
];

interface TriggerTagsProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TriggerTags({ selectedTags, onChange }: TriggerTagsProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 5) {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
        What's influencing your mood? (Max 5)
      </p>
      <div className="flex flex-wrap gap-2">
        {DEFAULT_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                isSelected 
                  ? "bg-primary text-white border-primary shadow-md" 
                  : "bg-background text-muted-foreground border-border/50 hover:border-primary/30"
              }`}
              aria-pressed={isSelected}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
