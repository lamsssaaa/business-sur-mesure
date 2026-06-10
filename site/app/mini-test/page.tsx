import type { Metadata } from "next";
import Quiz from "@/components/Quiz";
import Footer from "@/components/Footer";
import { INTRO } from "@/lib/quiz";

export const metadata: Metadata = {
  title: "Mini-test gratuit (2 min) — Quel entrepreneur es-tu ?",
};

export default function MiniTest() {
  return (
    <main>
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <h1 className="text-3xl font-bold">{INTRO.titre}</h1>
        <p className="mt-2 text-muted">{INTRO.texte}</p>
        <div className="mt-10">
          <Quiz />
        </div>
      </div>
      <Footer />
    </main>
  );
}
