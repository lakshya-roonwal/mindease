"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  User, 
  Sparkles, 
  Loader2, 
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  HelpCircle
} from "lucide-react";
import { detectCrisisSignals } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "I'm feeling overwhelmed by my syllabus",
  "I had a bad mock test today",
  "How do I manage exam anxiety?",
  "I can't sleep because of stress"
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [showCrisisCard, setShowCrisisCard] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, isLoading]);

  const handleSend = async (text: string) => {
    const userText = text.trim();
    if (!userText || isLoading) return;

    if (detectCrisisSignals(userText)) {
      setShowCrisisCard(true);
    }

    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamingText("");

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("Failed to connect to AI Coach");

      const reader = response.body?.getReader();
      const decoder = new TextEncoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          fullContent += chunk;
          setStreamingText(fullContent);
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
      setStreamingText("");
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I'm having a bit of trouble connecting. Let's take a deep breath together and try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-surface border border-border/50 rounded-[2.5rem] shadow-xl overflow-hidden">
      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth"
        role="log"
        aria-label="Coach chat history"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-primary/10 p-4 rounded-3xl">
              <Sparkles className="text-primary h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Namaste! I'm your MindEase Coach.</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">How are you feeling about your prep today? Pick a topic or type your own.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full max-w-sm">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left px-5 py-3 rounded-2xl bg-background border border-border/50 text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-between group"
                >
                  {s}
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
              m.role === "user" ? "bg-primary text-white" : "bg-accent text-white"
            }`}>
              {m.role === "user" ? <User size={20} /> : <span className="font-black text-lg">M</span>}
            </div>
            <div className={`max-w-[80%] p-5 rounded-3xl text-base leading-relaxed shadow-sm ${
              m.role === "user" 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-background border border-border/50 text-foreground rounded-tl-none"
            }`}>
              {m.content}
            </div>
          </motion.div>
        ))}

        {streamingText && (
          <div className="flex gap-4 flex-row">
            <div className="shrink-0 w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center">
              <span className="font-black text-lg">M</span>
            </div>
            <div className="max-w-[80%] p-5 rounded-3xl bg-background border border-border/50 text-foreground rounded-tl-none shadow-sm leading-relaxed whitespace-pre-wrap">
              {streamingText}
            </div>
          </div>
        )}

        {isLoading && !streamingText && (
          <div className="flex gap-4 items-center">
            <div className="shrink-0 w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center">
              <span className="font-black text-lg">M</span>
            </div>
            <div className="bg-background border border-border/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium text-muted-foreground">MindEase is thinking...</span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showCrisisCard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] space-y-4"
            >
              <div className="flex items-center gap-3 text-red-700">
                <AlertTriangle size={24} />
                <h4 className="font-black uppercase tracking-widest text-xs">A note from MindEase</h4>
              </div>
              <p className="text-red-900 leading-relaxed">
                It sounds like you're going through a very difficult time. Please know that you're not alone, and help is available. While I'm here to listen, I'm an AI and can't provide the level of care you deserve right now.
              </p>
              <div className="bg-white/50 p-4 rounded-2xl space-y-2 border border-red-100">
                <p className="font-bold text-red-900">iCall Helpline (Available 8am-10pm):</p>
                <a href="tel:9152987821" className="text-2xl font-black text-red-600 block">9152987821</a>
              </div>
              <button 
                onClick={() => setShowCrisisCard(false)}
                className="text-red-700 text-sm font-bold hover:underline"
              >
                Close this alert
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="p-6 md:p-8 border-t border-border/50 bg-background/50 backdrop-blur-md">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
          className="relative max-w-3xl mx-auto flex items-center gap-4"
        >
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Talk to your coach..."
              className="w-full pl-6 pr-14 py-4 bg-surface border-2 border-border focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-[1.5rem] outline-none transition-all text-base shadow-inner resize-none min-h-[60px] max-h-[120px]"
              aria-label="Your message to the coach"
              disabled={isLoading}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 p-3 bg-primary text-white rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg active:scale-90"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        <p className="text-[9px] text-center text-muted-foreground mt-4 uppercase tracking-[0.2em] font-bold">
          Empathetic AI support. Not a clinical replacement.
        </p>
      </div>
    </div>
  );
}
