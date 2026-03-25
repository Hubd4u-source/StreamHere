import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "AMAI TV - Watch Anime Online",
    template: "%s | AMAI TV",
  },
  description: "Stream your favorite anime series and movies on AMAI TV. High quality, fast streaming experience.",
  keywords: ["anime", "watch anime online", "anime streaming", "free anime"],
  authors: [{ name: "AMAI TV" }],
  creator: "AMAI TV",
  verification: {
    google: "FzT9B60wUVMnAUfsQJ6P4Yhi0R0Uqt4uXJgyZyyQAeI",
  },
  metadataBase: new URL("https://amaitv.vercel.app"),

  // ── FAVICON / ICONS ──────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  // ── PWA MANIFEST ─────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── OPEN GRAPH (Google preview card) ─────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://amaitv.vercel.app",
    siteName: "AMAI TV",
    title: "AMAI TV - Watch Anime Online",
    description: "Stream your favorite anime series and movies. High quality, fast experience.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AMAI TV - Watch Anime Online",
      },
    ],
  },

  // ── TWITTER CARD ─────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "AMAI TV - Watch Anime Online",
    description: "Stream your favorite anime series and movies.",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  themeColor: "#0D0D0F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Remove third-party scripts for cleaner UX */}
        <meta name="theme-color" content="#0D0D0F" />
        <link rel="icon" href="data:," />
      </head>
      <body className="bg-bg-base text-content-primary font-sans antialiased flex flex-col min-h-[100dvh]">
        <AuthProvider>
          <SettingsProvider>
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


