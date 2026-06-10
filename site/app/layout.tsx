import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "Ton Business Sur Mesure — LE business à lancer, selon TON profil",
  description:
    "Réponds à 50 questions sur ton expérience, tes compétences, ton budget et ton temps — on te dit LE business à lancer, et comment, en 30 jours. Rapport personnalisé, livré en 48 h.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${hanken.variable}`}>
      <body className="antialiased">
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
