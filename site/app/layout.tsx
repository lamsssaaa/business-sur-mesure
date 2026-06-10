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

const SITE_URL = "https://lamsssaaa.github.io/business-sur-mesure";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ton Business Sur Mesure — LE business à lancer, selon TON profil",
    template: "%s · Ton Business Sur Mesure",
  },
  description:
    "Réponds à 50 questions sur ton expérience, tes compétences, ton budget et ton temps — on te dit LE business à lancer, et comment, en 30 jours. Rapport personnalisé, livré en 48 h.",
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Ton Business Sur Mesure",
    title: "Arrête de chercher une idée. Trouve TON business.",
    description:
      "50 questions sur ton profil → LE business à lancer, avec le plan des 30 premiers jours. Rapport personnalisé, livré en 48 h.",
    images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arrête de chercher une idée. Trouve TON business.",
    description:
      "50 questions sur ton profil → LE business à lancer, avec le plan des 30 premiers jours.",
    images: [`${SITE_URL}/og.jpg`],
  },
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
