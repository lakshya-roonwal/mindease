"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface MoodDistributionProps {
  checkIns: any[];
}

const COLORS = ["#f43f5e", "#f59e0b", "#0d9488", "#8b5cf6"];
const CATEGORIES = ["Low", "Moderate", "Good", "Great"];

export default function MoodDistribution({ checkIns }: MoodDistributionProps) {
  const data = useMemo(() => {
    const counts = [0, 0, 0, 0];
    checkIns.forEach((c) => {
      if (c.moodScore <= 3) counts[0]++;
      else if (c.moodScore <= 6) counts[1]++;
      else if (c.moodScore <= 8) counts[2]++;
      else counts[3]++;
    });

    const total = checkIns.length;
    return counts.map((count, i) => ({
      name: CATEGORIES[i],
      value: count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(0) : 0,
    })).filter(d => d.value > 0);
  }, [checkIns]);

  return (
    <div className="bg-surface border border-border/50 rounded-3xl p-6 h-[400px] flex flex-col" role="img" aria-label="Mood distribution donut chart showing breakdown of mood categories.">
      <h4 className="font-bold text-lg mb-4">Mood Breakdown</h4>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[CATEGORIES.indexOf(entry.name)]} 
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface border border-border/50 p-3 rounded-xl shadow-lg">
                      <p className="font-bold text-sm">{payload[0].name}</p>
                      <p className="text-primary font-black">{payload[0].value} days ({payload[0].payload.percentage}%)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-2">
                  {value} <span className="text-foreground ml-1">{entry.payload.percentage}%</span>
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
