"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  MessageSquare, 
  BookOpen, 
  Wind, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  BarChart3
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Insights", href: "/dashboard/insights", icon: BarChart3 },
  { name: "AI Coach", href: "/dashboard/coach", icon: MessageSquare },
  { name: "Journal", href: "/dashboard/journal", icon: BookOpen },
  { name: "Toolkit", href: "/dashboard/toolkit", icon: Sparkles },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b bg-surface sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Sparkles className="text-primary w-6 h-6" />
          <span className="font-bold text-xl text-primary">MindEase</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-surface border-r z-50 lg:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-primary w-6 h-6" />
                  <span className="font-bold text-xl text-primary">MindEase</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === item.href
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-2 pt-6 border-t">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <Settings size={20} />
                  <span className="font-medium">Settings</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-all"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-surface border-r flex-col p-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-10 px-2">
          <Sparkles className="text-primary w-7 h-7" />
          <span className="font-bold text-2xl text-primary">MindEase</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                pathname === item.href
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-2 pt-6 border-t">
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === "/dashboard/settings"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 md:p-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
