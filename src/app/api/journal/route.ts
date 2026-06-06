import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const journalSchema = z.object({
  id: z.string().optional(),
  title: z.string().max(100).optional().nullable(),
  content: z.string().min(1, "Content is required"),
  mood: z.string().optional().nullable(),
  moodScore: z.number().min(1).max(10).optional().nullable(),
  prompt: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    let where: any = {
      userId: session.user.id,
      deletedAt: null,
    };

    if (dateStr) {
      const date = new Date(dateStr);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      where.createdAt = {
        gte: date,
        lt: nextDate,
      };
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return NextResponse.json({
      entries,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      }
    });
  } catch (error) {
    console.error("Journal GET error"); // Don't log content
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const result = journalSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        ...result.data,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Journal POST error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const result = journalSchema.safeParse(body);

    if (!result.success || !result.data.id) {
      return NextResponse.json({ error: "Invalid data or missing ID" }, { status: 400 });
    }

    const { id, ...data } = result.data;

    // Check ownership
    const existing = await prisma.journalEntry.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const entry = await prisma.journalEntry.update({
      where: { id },
      data,
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Journal PUT error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // Soft delete
    await prisma.journalEntry.updateMany({
      where: { id, userId: session.user.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Journal DELETE error");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
