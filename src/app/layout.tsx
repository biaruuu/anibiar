import type { Metadata, Viewport } from "next";
import { Karla } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Anibiar - Watch Anime", template: "%s | Anibiar" },
  description: "Browse airing, popular and upcoming anime with schedules powered by AniList.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${karla.variable}`}>
      <body className="min-h-screen font-sans">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1500px] px-4">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
