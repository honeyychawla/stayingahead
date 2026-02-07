"use client";

export default function Navbar() {
  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-[60] animate-[fade-in_0.4s_ease-out]">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 pt-3">
        <div className="bg-slate-card/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          {/* Brand */}
          <a
            href="#"
            className="font-heading text-base sm:text-lg font-bold text-white whitespace-nowrap shrink-0"
          >
            Staying Ahead
          </a>

          {/* CTA */}
          <button
            onClick={() => {
              document.getElementById("join")?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
            className="bg-lime text-black rounded-full px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
          >
            Join Community &rarr;
          </button>
        </div>
      </div>
    </nav>
  );
}
