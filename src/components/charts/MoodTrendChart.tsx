"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

interface MoodTrendChartProps {
  data: any[];
  days: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border/50 p-4 rounded-xl shadow-xl backdrop-blur-sm">
        <p className="font-bold text-foreground mb-2">
          {format(parseISO(label), "MMM d, yyyy")}
        </p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm font-medium">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground uppercase tracking-tight text-[10px] font-black">
              {entry.name}:
            </span>
            <span className="text-foreground">{entry.value.toFixed(1)}</span>
          </div>
        ))}
        {payload[0]?.payload?.triggers && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Top Triggers:</p>
            <p className="text-xs text-primary font-medium">{payload[0].payload.triggers}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function MoodTrendChart({ data, days }: MoodTrendChartProps) {
  const filteredData = useMemo(() => {
    // Already sorted asc from API
    return data.slice(-days);
  }, [data, days]);

  return (
    <div className="w-full h-[400px] bg-surface border border-border/50 rounded-3xl p-6 shadow-sm overflow-hidden" role="img" aria-label={`Mood trend chart for the last ${days} days showing mood and energy levels.`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="createdAt" 
            tickFormatter={(str) => format(parseISO(str), "MMM d")}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            domain={[0, 10]} 
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={5} stroke="var(--muted-foreground)" strokeDasharray="5 5" label={{ value: 'Neutral', position: 'right', fill: 'var(--muted-foreground)', fontSize: 10 }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: 20, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
          />
          <Line
            type="monotone"
            dataKey="moodScore"
            name="Mood"
            stroke="var(--primary)"
            strokeWidth={4}
            dot={{ r: 4, strokeWidth: 2, fill: "var(--surface)" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="energyLevel"
            name="Energy"
            stroke="var(--secondary)"
            strokeWidth={4}
            dot={{ r: 4, strokeWidth: 2, fill: "var(--surface)" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
