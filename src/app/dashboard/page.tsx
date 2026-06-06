import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardView from "@/components/dashboard/DashboardView";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userStreak = await prisma.streak.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <DashboardView 
      user={{
        name: session.user.name || null,
        examType: session.user.examType || null,
        examDate: session.user.examDate || null,
      }} 
      streakCount={userStreak?.count || 0} 
    />
  );
}
