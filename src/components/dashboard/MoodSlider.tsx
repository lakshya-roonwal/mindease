"use client";

import React from "react";

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function MoodSlider({ value, onChange }: MoodSliderProps) {
  return (
    <div className="space-y-4">
      <label htmlFor="mood-slider" className="block text-sm font-bold text-muted-foreground uppercase tracking-widest">
        Mood Score: {value} / 10
      </label>
      <input
        id="mood-slider"
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        aria-label="Mood Score"
        aria-valuemin={1}
        aria-valuemax={10}
        aria-valuenow={value}
      />
      <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
        <span>Low</span>
        <span>Neutral</span>
        <span>High</span>
      </div>
    </div>
  );
}
