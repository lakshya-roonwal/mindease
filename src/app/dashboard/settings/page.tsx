"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  BookOpen, 
  Bell, 
  Shield, 
  Save, 
  Trash2, 
  Plus, 
  Download, 
  Loader2,
  AlertTriangle,
  ChevronRight,
  Check
} from "lucide-react";
import { format } from "date-fns";

const EXAM_TYPES = [
  "NEET", "JEE Main", "JEE Advanced", "CUET", "CAT", "GATE", 
  "UPSC Prelims", "UPSC Mains", "Class 10 Boards", "Class 12 Boards", "Other"
];

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  reminderTime: z.string(),
  remindersEnabled: z.boolean(),
  exams: z.array(z.object({
    type: z.string(),
    date: z.string(),
  })),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "exam" | "notifications" | "privacy">("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      reminderTime: "21:00",
      remindersEnabled: true,
      exams: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exams"
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (res.ok) {
          setEmail(data.email);
          reset({
            name: data.name || "",
            reminderTime: data.reminderTime || "21:00",
            remindersEnabled: data.remindersEnabled,
            exams: data.exams.map((e: any) => ({
              type: e.type,
              date: new Date(e.date).toISOString().split('T')[0]
            })),
          });
        }
      } catch (e) {
        console.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        alert("Settings updated successfully! ✓");
      }
    } catch (e) {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAllData = async () => {
    try {
      const res = await fetch("/api/settings", { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/register";
      }
    } catch (e) {
      alert("Action failed.");
    }
  };

  const handleExport = () => {
    window.open("/api/settings/export", "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing preferences...</p>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "exam", label: "Exams", icon: BookOpen },
    { id: "notifications", label: "Reminders", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="px-2">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight text-center md:text-left">Account Settings</h1>
        <p className="text-muted-foreground mt-2 text-center md:text-left">Manage your preferences and personal data.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-surface border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon size={18} />
                {tab.label}
              </div>
              <ChevronRight size={14} className={activeTab === tab.id ? "opacity-100" : "opacity-0"} />
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center md:items-start gap-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-primary text-white flex items-center justify-center text-4xl font-black shadow-xl shadow-primary/10">
                      {watch("name")?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="space-y-4 w-full">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                        <input
                          {...register("name")}
                          className="w-full px-6 py-4 bg-background border border-border/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold"
                          placeholder="Your name"
                        />
                        {errors.name && <p className="text-red-500 text-xs ml-2 font-bold">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2 opacity-60">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email (Linked to Auth)</label>
                        <input
                          value={email}
                          readOnly
                          className="w-full px-6 py-4 bg-muted/30 border border-border/50 rounded-2xl outline-none font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "exam" && (
                <motion.div
                  key="exam-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-6 bg-background border border-border/50 rounded-3xl space-y-4 relative group">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Exam Type</label>
                            <select
                              {...register(`exams.${index}.type`)}
                              className="w-full px-5 py-3 bg-surface border border-border/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-bold text-sm"
                            >
                              {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Exam Date</label>
                            <input
                              type="date"
                              {...register(`exams.${index}.date`)}
                              className="w-full px-5 py-3 bg-surface border border-border/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => append({ type: "NEET", date: new Date().toISOString().split('T')[0] })}
                    className="w-full py-4 border-2 border-dashed border-border/50 rounded-3xl text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Another Exam
                  </button>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  key="notif-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between p-6 bg-background border border-border/50 rounded-3xl">
                    <div>
                      <h4 className="font-bold">Daily Check-in Reminder</h4>
                      <p className="text-xs text-muted-foreground mt-1">We'll send you a nudge to track your mood.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" {...register("remindersEnabled")} className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className={`space-y-2 transition-opacity ${watch("remindersEnabled") ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Reminder Time</label>
                    <input
                      type="time"
                      {...register("reminderTime")}
                      className="w-full px-6 py-4 bg-background border border-border/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                    />
                  </div>

                  <div className="p-6 border border-dashed border-border/50 rounded-3xl bg-muted/10 opacity-60">
                    <div className="flex items-center gap-2">
                       <Check size={14} className="text-primary" />
                       <span className="text-sm font-bold uppercase tracking-tighter">Coming Soon</span>
                    </div>
                    <h4 className="font-bold mt-2">Weekly Insights Email</h4>
                    <p className="text-xs text-muted-foreground mt-1">Get a detailed PDF report of your mental wellness journey every Sunday.</p>
                  </div>
                </motion.div>
              )}

              {activeTab === "privacy" && (
                <motion.div
                  key="privacy-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-10"
                >
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                       <Shield size={18} className="text-primary" /> 
                       Data Portability
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Download all your personal data including journal reflections, check-in history, and exam configurations in a standard JSON format.
                    </p>
                    <button
                      type="button"
                      onClick={handleExport}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface border border-border/50 text-foreground hover:bg-muted transition-all font-bold text-sm shadow-sm"
                    >
                      <Download size={18} />
                      Export My Data (.json)
                    </button>
                  </div>

                  <div className="pt-10 border-t border-border/50 space-y-4">
                    <h3 className="font-bold text-red-600 flex items-center gap-2">
                       <AlertTriangle size={18} /> 
                       Danger Zone
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Permanently delete your account and all associated data. This action is irreversible.
                    </p>
                    
                    {!showDeleteConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-bold text-sm"
                      >
                        Delete My Account
                      </button>
                    ) : (
                      <div className="p-6 bg-red-50 border border-red-100 rounded-3xl space-y-4">
                        <p className="text-red-900 font-bold text-sm">Are you absolutely sure?</p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-5 py-2 bg-white rounded-xl border border-red-200 text-red-700 font-bold text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteAllData}
                            className="px-5 py-2 bg-red-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-red-200"
                          >
                            Yes, Delete Forever
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-8 border-t border-border/50 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
