"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-8">
      <div className="bg-red-50 p-6 rounded-full text-red-500">
        <AlertTriangle size={48} />
      </div>
      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-black text-foreground">Something went wrong!</h2>
        <p className="text-muted-foreground leading-relaxed">
          We encountered an unexpected error. Don't worry, your data is safe. Let's try that again.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
      >
        <RotateCcw size={18} />
        Try again
      </button>
    </div>
  );
}
