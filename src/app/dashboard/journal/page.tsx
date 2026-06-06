"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PenLine, 
  History, 
  Search, 
  Filter, 
  Loader2, 
  Calendar as CalendarIcon,
  AlertCircle
} from "lucide-react";
import JournalEditor from "@/components/journal/JournalEditor";
import EntryCard from "@/components/journal/EntryCard";
import { format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState<"write" | "past">("write");
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState<string>(""); // YYYY-MM
  const [page, setPage] = useState(1);
  const [totalPages, setPages] = useState(1);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/journal?page=${page}`);
      const data = await res.json();
      if (res.ok) {
        setEntries(data.entries);
        setPages(data.pagination.pages);
      }
    } catch (e) {
      console.error("Failed to fetch entries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "past") {
      fetchEntries();
    }
  }, [activeTab, page]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/journal?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEntries(entries.filter((e) => e.id !== id));
      }
    } catch (e) {
      console.error("Delete failed");
    }
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (entry.title && entry.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!filterMonth) return matchesSearch;

      const entryDate = new Date(entry.createdAt);
      const [year, month] = filterMonth.split("-").map(Number);
      const start = startOfMonth(new Date(year, month - 1));
      const end = endOfMonth(new Date(year, month - 1));

      return matchesSearch && isWithinInterval(entryDate, { start, end });
    });
  }, [entries, searchQuery, filterMonth]);

  const uniqueMonths = useMemo(() => {
     const months = new Set<string>();
     entries.forEach(e => {
        months.add(format(new Date(e.createdAt), "yyyy-MM"));
     });
     return Array.from(months).sort().reverse();
  }, [entries]);

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Your Journal</h1>
          <p className="text-muted-foreground mt-2">A safe harbor for your thoughts and exam stress.</p>
        </div>

        <div className="flex bg-surface border border-border/50 p-1 rounded-2xl shadow-sm self-start">
          <button
            onClick={() => setActiveTab("write")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "write" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <PenLine size={16} /> Write
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "past" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <History size={16} /> Past Entries
          </button>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === "write" ? (
            <motion.div
              key="write-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <JournalEditor />
            </motion.div>
          ) : (
            <motion.div
              key="past-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 bg-surface border border-border/50 p-6 rounded-3xl shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder="Search your reflections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all text-sm font-medium"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative min-w-[180px]">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 bg-background border border-border/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 appearance-none text-sm font-bold text-foreground"
                    >
                      <option value="">All Months</option>
                      {uniqueMonths.map(m => (
                         <option key={m} value={m}>
                            {format(new Date(m + "-01"), "MMMM yyyy")}
                         </option>
                      ))}
                    </select>
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="grid gap-6">
                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Retrieving your memories...</p>
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="py-20 text-center bg-surface border-2 border-dashed border-border/50 rounded-[3rem] space-y-4">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto opacity-50">
                      <AlertCircle size={32} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-bold text-foreground">No entries found</h3>
                       <p className="text-muted-foreground max-w-xs mx-auto">
                         {searchQuery ? "Try a different search term or clear filters." : "Start your first reflection in the 'Write' tab."}
                       </p>
                    </div>
                    {searchQuery && (
                       <button onClick={() => {setSearchQuery(""); setFilterMonth("");}} className="text-primary font-bold hover:underline">Clear all filters</button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Showing {filteredEntries.length} reflection{filteredEntries.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {filteredEntries.map((entry) => (
                      <EntryCard 
                        key={entry.id} 
                        entry={entry} 
                        onDelete={handleDelete} 
                        onEdit={(e) => {
                           // Set active tab to write and pass data
                           // For now we just go back to write tab
                           setActiveTab("write");
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
