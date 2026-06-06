import Link from "next/link";
import { Sparkles, Brain, Wind, BarChart3, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MindEase | Calm Companion for Exam Season",
  description: "Track moods, beat stress, and stay mentally strong — built for NEET, JEE, UPSC & more.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl">
            <Sparkles className="text-white h-6 w-6" />
          </div>
          <span className="font-extrabold text-2xl text-primary tracking-tight">MindEase</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground">Log in</Link>
          <Link href="/register" className="text-sm font-bold bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-foreground/90 transition-all">Start Free</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest border border-primary/20">
            <Sparkles size={16} /> Your mental health matters
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
            Your calm companion through <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">exam season.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track moods, beat stress, and stay mentally strong — built specifically for Indian students facing NEET, JEE, UPSC & more.
          </p>
          <div className="pt-8">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
            >
              Start Your Journey <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            { title: "AI Wellness Coach", desc: "Empathetic support customized for exam stress.", icon: Brain, color: "text-primary bg-primary/10 border-primary/20" },
            { title: "Calm Corner", desc: "Science-backed breathing exercises for instant relief.", icon: Wind, color: "text-accent bg-accent/10 border-accent/20" },
            { title: "Pattern Insights", desc: "Data-driven analytics to understand your mood trends.", icon: BarChart3, color: "text-secondary bg-secondary/10 border-secondary/20" },
          ].map((feature) => (
            <div key={feature.title} className="p-8 rounded-[2.5rem] bg-surface border border-border/50 text-left shadow-sm hover:shadow-xl transition-all">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${feature.color}`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-32 max-w-4xl mx-auto text-center space-y-12">
          <blockquote className="text-3xl font-medium leading-relaxed italic text-foreground/80">
            "MindEase completely changed how I handled JEE prep. The AI coach helped me through my lowest mock test scores, and the box breathing exercises saved me from panic attacks."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-xl">R</div>
            <div className="text-left">
              <div className="font-bold text-foreground">Rahul S.</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-black">JEE Aspirant</div>
            </div>
          </div>
        </div>

        <div className="mt-32 w-full max-w-5xl border-t border-border/50 pt-16">
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-8">Trusted by students preparing for</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {["NEET", "JEE MAIN", "JEE ADVANCED", "UPSC", "CAT", "CUET", "GATE"].map(exam => (
              <span key={exam} className="text-2xl font-black tracking-tighter text-foreground">{exam}</span>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-border/50 py-8 px-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} MindEase. Built for students.
        </div>
        <div className="flex items-center gap-6 text-sm font-bold text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">About Us</a>
          <span className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs uppercase tracking-widest">
            In crisis? Call iCall: 9152987821
          </span>
        </div>
      </footer>
    </div>
  );
}
