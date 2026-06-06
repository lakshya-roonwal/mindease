import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardView from "@/components/dashboard/DashboardView";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [userStreak, userData] = await Promise.all([
    prisma.streak.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { exams: true }
    })
  ]);

  return (
    <DashboardView 
      user={{
        name: userData?.name || null,
        exams: userData?.exams.map(e => ({
            id: e.id,
            type: e.type,
            date: e.date
        })) || [],
      }} 
      streakCount={userStreak?.count || 0} 
    />
  );
}

