import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ton Business Sur Mesure — LE business à lancer, selon TON profil",
  description:
    "Réponds à 50 questions sur ton expérience, tes compétences, ton budget et ton temps — on te dit LE business à lancer, et comment, en 30 jours. Rapport personnalisé, livré en 48 h.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
