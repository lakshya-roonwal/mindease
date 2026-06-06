import { auth } from "@/lib/auth";
import genAI from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are MindEase AI, a supportive and calming companion for students preparing for high-stakes exams like NEET, JEE, and UPSC. Your goal is to provide emotional support, stress-relief techniques, and a listening ear. Be empathetic, encouraging, and concise. Avoid giving medical advice; instead, focus on mindfulness and healthy study habits."
    });

    const formattedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // For a simple chat response without streaming back to the client in this specific route
    // (Wait, the client expects a JSON response with { role: "assistant", content: reply })
    const response = await model.generateContent({ contents: formattedMessages });
    const reply = response.response.text();

    return NextResponse.json({ role: "assistant", content: reply || "I'm here for you, but I'm having trouble processing that right now." });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

