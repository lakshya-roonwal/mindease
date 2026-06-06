import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        journalEntries: {
            where: { deletedAt: null }
        },
        moodCheckIns: true,
        streak: true,
        exams: true,
      },
    });

    if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const exportData = {
        profile: {
            name: data.name,
            email: data.email,
            examConfig: data.exams,
        },
        wellness: {
            streak: data.streak,
            checkIns: data.moodCheckIns,
        },
        reflections: data.journalEntries.map(e => ({
            title: e.title,
            content: e.content,
            mood: e.mood,
            createdAt: e.createdAt
        })),
        exportedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="mindease-data-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
