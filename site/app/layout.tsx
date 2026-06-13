import type { Metadata, Viewport } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import Analytics from "@/components/Analytics";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});

const SITE_URL = "https://lamsssaaa.github.io/business-sur-mesure";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "53 Questions Sur Mesure — LE business à lancer, selon VOTRE profil",
    template: "%s · 53 Questions Sur Mesure",
  },
  description:
    "Répondez aux 53 questions sur votre expérience, vos compétences, votre budget et votre temps — on vous dit LE business à lancer, et comment, en 30 jours. Rapport personnalisé, livré en 48 h.",
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "53 Questions Sur Mesure",
    title: "Arrêtez de chercher une idée. Trouvez VOTRE business.",
    description:
      "53 questions sur votre profil → LE business à lancer, avec le plan des 30 premiers jours. Rapport personnalisé, livré en 48 h.",
    images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arrêtez de chercher une idée. Trouvez VOTRE business.",
    description:
      "53 questions sur votre profil → LE business à lancer, avec le plan des 30 premiers jours.",
    images: [`${SITE_URL}/og.jpg`],
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="fr" className={`${fraunces.variable} ${hanken.variable}`}>
      <body className="antialiased">
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <a
          href="#contenu"
          className="sr-only z-50 rounded-lg bg-accent px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu
        </a>
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        <div id="contenu">{children}</div>
        <Analytics />
      </body>
      </html>
    </ViewTransitions>
  );
}
