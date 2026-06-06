"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SkipLink() {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || pathname === "/" || pathname === "/login" || pathname === "/register") return null;

  return (
    <a
      href="#main-content"
      className="absolute -top-full left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-primary text-white font-bold rounded-b-xl shadow-lg focus:top-0 transition-all outline-none focus:ring-4 focus:ring-primary/50"
    >
      Skip to main content
    </a>
  );
}
