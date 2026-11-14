import type { Metadata, Viewport } from "next";
import { Gloock, Hanken_Grotesk, Literata } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const text = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-text", display: "swap" });
const read = Literata({ subsets: ["latin"], variable: "--font-read", display: "swap" });

export const metadata: Metadata = {
  title: { default: "CMCI Ngaoundéré", template: "%s · CMCI Ngaoundéré" },
  description:
    "Communauté Missionnaire Chrétienne Internationale à Ngaoundéré : pasteurs, centres de quartier, programme, librairie et rendez-vous en ligne.",
  icons: { icon: [{ url: "/icon-32.png", sizes: "32x32" }, { url: "/icon-192.png", sizes: "192x192" }], apple: "/icon-180.png" },
  openGraph: { images: ["/logo-badge.png"] },
};
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#FAFBFD" }, { media: "(prefers-color-scheme: dark)", color: "#16191F" }], width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${text.variable} ${read.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
