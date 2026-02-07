import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stayingahead.in"),
  title: "Staying Ahead | Join the Free AI Updates Community",
  description:
    "Get curated AI updates, resources, and session invites. Join 10,000+ AI enthusiasts on WhatsApp. Free forever.",
  alternates: {
    canonical: "https://stayingahead.in",
  },
  openGraph: {
    title: "Staying Ahead | Join the Free AI Updates Community",
    description:
      "Get curated AI updates, resources, and session invites. Join 10,000+ AI enthusiasts on WhatsApp. Free forever.",
    type: "website",
    siteName: "Staying Ahead",
  },
  twitter: {
    card: "summary_large_image",
    title: "Staying Ahead | Join the Free AI Updates Community",
    description:
      "Get curated AI updates, resources, and session invites. Join 10,000+ AI enthusiasts on WhatsApp. Free forever.",
  },
  other: {
    "theme-color": "#0A0A0A",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Staying Ahead",
      url: "https://stayingahead.in",
      description:
        "Get curated AI updates, resources, and session invites. Join 10,000+ AI enthusiasts on WhatsApp. Free forever.",
    },
    {
      "@type": "Organization",
      name: "Staying Ahead",
      url: "https://stayingahead.in",
      description:
        "Free AI community delivering curated updates, resources, and live sessions via WhatsApp.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-body antialiased min-h-screen`}
      >
        <noscript>
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#888888",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            <p>
              JavaScript is required to use this form. Please enable JavaScript
              in your browser settings to join the Staying Ahead community.
            </p>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
