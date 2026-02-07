"use client";

export default function Navbar() {
  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-[60]">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 pt-3">
        <div className="bg-slate-card/80 backdrop-blur-md border border-gray-800 rounded-2xl px-3 sm:px-6 h-11 sm:h-14 flex items-center justify-between gap-3">
          {/* Brand */}
          <a
            href="#"
            className="font-heading text-base sm:text-lg font-bold text-white whitespace-nowrap shrink-0"
          >
            Staying Ahead
          </a>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a
              href="#"
              className="border border-gray-700 text-white bg-transparent rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium hover:border-gray-500 transition-colors whitespace-nowrap"
            >
              Newsletter
            </a>
            <button
              onClick={() => {
                document.getElementById("join")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              className="bg-lime text-black rounded-full px-3 sm:px-5 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
            >
              <span className="sm:hidden">Join &rarr;</span>
              <span className="hidden sm:inline">Join Community &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
