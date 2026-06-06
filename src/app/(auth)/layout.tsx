import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20">
      <div className="w-full max-w-md px-4 py-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-primary tracking-tight">
              MindEase
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2">
            Your safe space to breathe and reflect
          </p>
        </div>
        <div className="bg-surface border border-border/50 shadow-xl rounded-2xl p-8 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
