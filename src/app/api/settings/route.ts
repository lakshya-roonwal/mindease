import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  reminderTime: z.string().optional(),
  remindersEnabled: z.boolean().optional(),
  exams: z.array(z.object({
    id: z.string().optional(),
    type: z.string(),
    date: z.string(),
  })).optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { exams: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const result = settingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { name, reminderTime, remindersEnabled, exams } = result.data;

    // Update User
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        reminderTime,
        remindersEnabled,
      },
    });

    // Update Exams (Simple approach: delete existing and recreate if provided)
    if (exams) {
      await prisma.exam.deleteMany({
        where: { userId: session.user.id },
      });

      if (exams.length > 0) {
        await prisma.exam.createMany({
          data: exams.map(e => ({
            userId: session.user.id,
            type: e.type,
            date: new Date(e.date),
          })),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Cascade delete is handled by Prisma schema (onDelete: Cascade)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
