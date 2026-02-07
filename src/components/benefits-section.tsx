import type { ReactNode } from "react";

const benefits: { icon: ReactNode; title: string; description: string }[] = [
  {
    icon: (
      <svg
        className="w-5 h-5 text-lime"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "AI Updates",
    description: "Stay current with what actually matters in AI",
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-lime"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Curated Resources",
    description: "Handpicked tools, guides, and tutorials",
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-lime"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "Session Invites",
    description: "Weekend AI masterminds and workshops",
  },
  {
    icon: (
      <svg
        className="w-5 h-5 text-lime"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Free Tools",
    description: "Access to exclusive AI tools and templates",
  },
];

export default function BenefitsSection() {
  return (
    <section className="flex flex-col items-center gap-8">
      <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-center">
        What You&apos;ll Get
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="bg-slate-card border border-white/10 rounded-xl p-5 transition-shadow hover:shadow-[0_0_20px_rgba(196,242,73,0.1)]"
          >
            <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center">
              {benefit.icon}
            </div>
            <h4 className="text-white font-medium mt-3">{benefit.title}</h4>
            <p className="text-secondary text-sm mt-1">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
