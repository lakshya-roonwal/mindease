import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import JournalView from "@/components/dashboard/JournalView";

export default async function JournalPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const entries = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Serialize entries for client component
  const serializedEntries = entries.map(entry => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }));

  return <JournalView initialEntries={serializedEntries} />;
}
