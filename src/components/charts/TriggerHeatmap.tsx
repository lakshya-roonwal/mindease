"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AlertCircle } from "lucide-react";

interface TriggerHeatmapProps {
  triggerMap: Record<string, number>;
}

export default function TriggerHeatmap({ triggerMap }: TriggerHeatmapProps) {
  const data = useMemo(() => {
    return Object.entries(triggerMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [triggerMap]);

  const total = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  const topTrigger = data[0]?.name;

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-start gap-4">
        <div className="bg-red-500 p-2 rounded-xl text-white">
          <AlertCircle size={24} />
        </div>
        <div>
          <p className="text-red-800 font-bold uppercase tracking-widest text-[10px]">Top Stressor This Month</p>
          <h4 className="text-2xl font-black text-red-900 mt-1">{topTrigger}</h4>
          <p className="text-red-700/70 text-sm mt-1">Found in {((data[0].count / total) * 100).toFixed(0)}% of stressful check-ins.</p>
        </div>
      </div>

      <div className="bg-surface border border-border/50 rounded-3xl p-6 h-[300px]" role="img" aria-label="Trigger frequency chart showing top stress factors.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              fontSize={12} 
              width={80}
              stroke="var(--foreground)"
              fontWeight={600}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface border border-border/50 p-3 rounded-xl shadow-lg">
                      <p className="font-bold text-sm">{payload[0].payload.name}</p>
                      <p className="text-primary font-black">{payload[0].value} check-ins</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? "var(--primary)" : "var(--primary)"} 
                  opacity={1 - (index * 0.15)} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
