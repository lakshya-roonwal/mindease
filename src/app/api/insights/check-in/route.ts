import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const checkInSchema = z.object({
  moodScore: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(10),
  triggers: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const result = checkInSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { moodScore, energyLevel, triggers } = result.data;

    const checkIn = await prisma.moodCheckIn.create({
      data: {
        userId: session.user.id,
        moodScore,
        energyLevel,
        triggers,
      },
    });

    // Update streak if it's a new day
    const streak = await prisma.streak.findUnique({
      where: { userId: session.user.id },
    });

    if (streak) {
      const lastUpdated = new Date(streak.lastUpdated);
      const today = new Date();
      
      const isSameDay = lastUpdated.toDateString() === today.toDateString();
      const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === lastUpdated.toDateString();
      
      if (!isSameDay) {
        await prisma.streak.update({
          where: { userId: session.user.id },
          data: {
            count: isYesterday ? streak.count + 1 : 1,
            lastUpdated: new Date(),
          },
        });
      }
    }

    return NextResponse.json(checkIn, { status: 201 });
  } catch (error) {
    console.error("Check-in Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
