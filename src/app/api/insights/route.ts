import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfDay, subDays } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const thirtyDaysAgo = subDays(new Date(), 30);

    const checkIns = await prisma.moodCheckIn.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    const streak = await prisma.streak.findUnique({
      where: { userId },
    });

    // 1. Averages
    const sevenDaysAgo = subDays(new Date(), 7);
    const last7Days = checkIns.filter(c => c.createdAt >= sevenDaysAgo);
    
    const avg7 = last7Days.length > 0 
      ? last7Days.reduce((acc, c) => acc + c.moodScore, 0) / last7Days.length 
      : 0;
    
    const avg30 = checkIns.length > 0 
      ? checkIns.reduce((acc, c) => acc + c.moodScore, 0) / checkIns.length 
      : 0;

    // 2. Trigger Frequency Map
    const triggerMap: Record<string, number> = {};
    checkIns.forEach(c => {
      if (c.triggers) {
        c.triggers.split(",").forEach(t => {
          const trimmed = t.trim();
          if (trimmed) triggerMap[trimmed] = (triggerMap[trimmed] || 0) + 1;
        });
      }
    });

    // 3. Best Mood Time of Day
    const timeBuckets: Record<string, { sum: number, count: number }> = {
      MORNING: { sum: 0, count: 0 }, // 5am - 12pm
      AFTERNOON: { sum: 0, count: 0 }, // 12pm - 6pm
      NIGHT: { sum: 0, count: 0 }, // 6pm - 5am
    };

    checkIns.forEach(c => {
      const hour = c.createdAt.getHours();
      let bucket = "NIGHT";
      if (hour >= 5 && hour < 12) bucket = "MORNING";
      else if (hour >= 12 && hour < 18) bucket = "AFTERNOON";
      
      timeBuckets[bucket].sum += c.moodScore;
      timeBuckets[bucket].count += 1;
    });

    let bestTime = "NIGHT";
    let maxAvg = -1;
    for (const [bucket, stats] of Object.entries(timeBuckets)) {
      if (stats.count > 0) {
        const avg = stats.sum / stats.count;
        if (avg > maxAvg) {
          maxAvg = avg;
          bestTime = bucket;
        }
      }
    }

    // 4. Mood by Day of Week
    const dowBuckets: Record<number, { sum: number, count: number }> = {};
    for (let i = 0; i < 7; i++) dowBuckets[i] = { sum: 0, count: 0 };

    checkIns.forEach(c => {
      const dow = c.createdAt.getDay();
      dowBuckets[dow].sum += c.moodScore;
      dowBuckets[dow].count += 1;
    });

    const dowAverages = Object.entries(dowBuckets).map(([day, stats]) => ({
      day: parseInt(day),
      average: stats.count > 0 ? stats.sum / stats.count : 0
    }));

    return NextResponse.json({
      checkIns,
      averages: {
        last7Days: avg7,
        last30Days: avg30,
      },
      triggerMap,
      bestTime,
      dowAverages,
      streakCount: streak?.count || 0,
    });
  } catch (error) {
    console.error("Insights API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
