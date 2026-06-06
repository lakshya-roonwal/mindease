import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChatInterface from "@/components/coach/ChatInterface";
import { Sparkles, MessageCircle, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CoachPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Calculate days to exam
  let daysToExam = null;
  if (session.user.examDate) {
    const diff = new Date(session.user.examDate).getTime() - new Date().getTime();
    daysToExam = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-white p-4 rounded-[1.5rem] shadow-lg shadow-primary/20">
            <Sparkles size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Your AI Coach</h1>
            <p className="text-muted-foreground mt-1">Empathetic support for your academic journey.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-surface border border-border/50 px-5 py-3 rounded-2xl shadow-sm">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Focusing on</p>
            <p className="font-bold text-foreground capitalize">{(session.user as any).examType || 'Preparation'}</p>
          </div>
          {daysToExam !== null && (
            <div className="bg-surface border border-border/50 px-5 py-3 rounded-2xl shadow-sm">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Days to Go</p>
              <p className="font-bold text-primary">{daysToExam}</p>
            </div>
          )}
        </div>
      </header>

      <ChatInterface />

      <footer className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck size={16} />
          <span className="text-xs font-medium uppercase tracking-widest">This conversation is private and not stored</span>
        </div>
        <div className="text-xs text-muted-foreground text-center md:text-right">
          MindEase AI can make mistakes. Please check important info.
        </div>
      </footer>
    </div>
  );
}
