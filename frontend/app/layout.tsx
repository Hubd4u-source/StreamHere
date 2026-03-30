import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Footer from "@/components/Footer";
import BroadcastBanner from "@/components/BroadcastBanner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amaitv.vercel.app"),
  title: {
    default: "AMAI TV — Watch Anime Online Free | Hindi Dubbed & Subbed",
    template: "%s | AMAI TV",
  },
  description:
    "Watch anime online free in HD. Hindi dubbed, English subbed, and Japanese audio. Stream Naruto, Dragon Ball, One Piece, Demon Slayer, Classroom of the Elite and 1000+ more series on AMAI TV.",
  keywords: [
    "watch anime online",
    "anime hindi dubbed",
    "free anime streaming",
    "anime online HD",
    "watch anime free",
    "hindi dubbed anime",
    "anime subbed",
    "AMAI TV",
    "anime series",
    "anime movies",
    "watch anime online free",
  ],
  authors: [{ name: "AMAI TV", url: "https://amaitv.vercel.app" }],
  creator: "AMAI TV",
  publisher: "AMAI TV",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "FzT9B60wUVMnAUfsQJ6P4Yhi0R0Uqt4uXJgyZyyQAeI",
  },

  // ── FAVICON / ICONS ──────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-144x144.png", sizes: "144x144", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },

  // ── OPEN GRAPH ─────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://amaitv.vercel.app",
    siteName: "AMAI TV",
    title: "AMAI TV — Watch Anime Online Free | Hindi Dubbed & Subbed",
    description:
      "Stream 1000+ anime series in Hindi dubbed and English subbed for free. HD quality, no ads. New episodes daily.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AMAI TV — Free Anime Streaming in Hindi Dubbed & English Subbed",
      },
    ],
  },

  // ── TWITTER CARD ─────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "AMAI TV — Watch Anime Online Free",
    description:
      "Stream 1000+ anime series in Hindi dubbed and English subbed for free. HD quality.",
    images: ["/og-image.png"],
  },

  // ── CANONICAL ─────────────────────────────────────
  alternates: {
    canonical: "https://amaitv.vercel.app",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D0D0F",
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AMAI TV",
  url: "https://amaitv.vercel.app",
  logo: "https://amaitv.vercel.app/Logo.jpg",
  description:
    "Watch anime online free in Hindi dubbed and English subbed. HD quality streaming.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0D0D0F" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <style>{`
          html, body {
            max-width: 100vw;
            overflow-x: hidden;
            position: relative;
          }
        `}</style>
      </head>
      <body className="bg-bg-base text-content-primary font-sans antialiased flex flex-col min-h-[100dvh]">
        <AuthProvider>
          <SettingsProvider>
            <BroadcastBanner />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
          </SettingsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
