import Link from "next/link";
import { Wind } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4 space-y-8">
      <div className="bg-primary/10 p-6 rounded-full text-primary">
        <Wind size={48} />
      </div>
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-black text-foreground">Page Not Found</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          We couldn't find the page you're looking for. Take a deep breath, and let's get you back on track.
        </p>
      </div>
      <Link 
        href="/"
        className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
      >
        Go back home
      </Link>
    </div>
  );
}
