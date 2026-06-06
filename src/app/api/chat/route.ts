import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: "You are MindEase AI, a supportive and calming companion for students preparing for high-stakes exams like NEET, JEE, and UPSC. Your goal is to provide emotional support, stress-relief techniques, and a listening ear. Be empathetic, encouraging, and concise. Avoid giving medical advice; instead, focus on mindfulness and healthy study habits.",
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "I'm here for you, but I'm having trouble processing that right now.";

    return NextResponse.json({ role: "assistant", content: reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
