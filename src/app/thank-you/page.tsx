"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (redirect) {
      const timer = setTimeout(() => {
        window.location.href = redirect;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [redirect]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center">
        <span className="text-3xl">✓</span>
      </div>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold">
        You&apos;re in!
      </h1>

      <p className="text-secondary text-lg max-w-md">
        Redirecting you to WhatsApp...
      </p>

      {redirect && (
        <a
          href={redirect}
          className="inline-block bg-lime text-black font-semibold rounded-full px-8 py-3 text-lg transition-opacity hover:opacity-90"
        >
          Join WhatsApp →
        </a>
      )}
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-secondary">Loading...</p>
        </main>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
