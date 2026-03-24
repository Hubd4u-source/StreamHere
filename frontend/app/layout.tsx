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
  title: "AMAI TV - Watch Anime Online",
  description: "Stream your favorite anime series and movies on AMAI TV. High quality, fast streaming experience.",
  verification: {
    google: "FzT9B60wUVMnAUfsQJ6P4Yhi0R0Uqt4uXJgyZyyQAeI",
  },
  metadataBase: new URL("https://amaitv.vercel.app"), // Replace with your actual domain
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


