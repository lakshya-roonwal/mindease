import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import anthropic, { SYSTEM_PROMPT, buildUserContext } from "@/lib/ai";
import { NextResponse } from "next/server";
import { subDays } from "date-fns";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { messages } = await req.json();
    const userId = session.user.id;

    // Load recent check-ins for context
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentCheckIns = await prisma.moodCheckIn.findMany({
      where: {
        userId,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    // Aggregate stressors
    const triggerMap: Record<string, number> = {};
    recentCheckIns.forEach(c => {
      if (c.triggers) {
        c.triggers.split(",").forEach(t => {
          const trimmed = t.trim();
          if (trimmed) triggerMap[trimmed] = (triggerMap[trimmed] || 0) + 1;
        });
      }
    });
    const topTriggers = Object.entries(triggerMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    const moodAvg = recentCheckIns.length > 0
      ? recentCheckIns.reduce((acc, c) => acc + c.moodScore, 0) / recentCheckIns.length
      : 5;

    let daysToExam = null;
    if (session.user.examDate) {
      const diff = new Date(session.user.examDate).getTime() - new Date().getTime();
      daysToExam = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    const userContext = buildUserContext({
      name: session.user.name || "Student",
      examType: (session.user as any).examType || "Competitive Exams",
      daysToExam,
      recentMoodAvg: moodAvg,
      topTriggers,
    });

    const stream = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: `${SYSTEM_PROMPT}\n\nUSER CONTEXT:\n${userContext}`,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    const encoder = new TextEncoder();
    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            const text = chunk.delta.text;
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("AI Coach API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
