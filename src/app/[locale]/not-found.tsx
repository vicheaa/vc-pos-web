import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="relative flex flex-col items-center">
        <h1 className="text-9xl font-extrabold tracking-widest text-accent md:text-[12rem]">
          404
        </h1>
        <div className="absolute top-1/2 -translate-y-1/2 rounded-full bg-red-500 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/50 md:text-base">
          Page Not Found
        </div>
      </div>
      <p className="mt-4 max-w-md text-center text-lg text-muted-foreground md:text-xl">
        Oops! The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-4 rounded-full border border-primary-background px-8 py-3 text-base font-semibold text-primary-background transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        <ArrowLeft />
        Return Home
      </Link>
    </div>
  );
}
