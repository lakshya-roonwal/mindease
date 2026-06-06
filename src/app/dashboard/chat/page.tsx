"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm MindEase AI. Exam prep can be tough—I'm here to listen. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I'm having a bit of trouble connecting right now. Take a deep breath, and let's try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6">
      <header className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <Sparkles className="text-primary h-8 w-8" />
            AI Guide
          </h1>
          <p className="text-muted-foreground mt-1">Empathetic support for your journey.</p>
        </div>
      </header>

      <div className="flex-1 bg-surface border border-border/50 rounded-[2rem] shadow-sm overflow-hidden flex flex-col relative">
        {/* Messages area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth"
          role="log"
          aria-label="Chat messages"
        >
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                  m.role === "user" ? "bg-primary text-white" : "bg-accent/10 text-accent"
                }`}>
                  {m.role === "user" ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl text-lg leading-relaxed shadow-sm ${
                  m.role === "user" 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-background border border-border/50 text-foreground rounded-tl-none"
                }`}>
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 items-center"
            >
              <div className="shrink-0 w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="bg-background border border-border/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-muted-foreground animate-pulse">Thinking...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input area */}
        <div className="p-6 md:p-8 border-t border-border/50 bg-background/50 backdrop-blur-md shrink-0">
          <form onSubmit={handleSend} className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me how you're feeling..."
              className="w-full pl-6 pr-16 py-4 bg-surface border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-2xl outline-none transition-all text-lg shadow-inner"
              aria-label="Your message"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-3 p-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:scale-95 transition-all shadow-lg shadow-primary/20 active:scale-90"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-[0.2em] font-bold">
            MindEase AI is a supportive companion, not a replacement for professional help.
          </p>
        </div>
      </div>
    </div>
  );
}
