"use client";

import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import TiltCard from "@/components/TiltCard";
import CtaButton from "@/components/CtaButton";
import Faq from "@/components/Faq";
import { COPY } from "@/lib/copy";
import { TEMOIGNAGES } from "@/lib/config";

const STATS = [
  { valeur: 50, suffixe: "", label: "questions sur ton profil" },
  { valeur: 48, suffixe: " h", label: "pour recevoir ton rapport" },
  { valeur: 30, suffixe: " jours", label: "de plan d'action concret" },
];

export default function HomeBody() {
  return (
    <>
      {/* CHIFFRES CLÉS */}
      <section className="border-y border-line bg-white/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.12} y={20} className="py-10 text-center sm:py-14">
              <p className="font-display text-6xl font-semibold text-accent sm:text-7xl">
                <Counter value={s.valeur} />
                {s.suffixe}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment" className="relative">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <Reveal>
            <h2 className="text-4xl font-semibold sm:text-5xl">{COPY.etapesTitre}</h2>
          </Reveal>
          <div className="mt-16 space-y-10">
            {COPY.etapes.map((e, i) => (
              <Reveal key={e.titre} delay={i * 0.08}>
                <div
                  className={`flex flex-col gap-6 rounded-3xl border border-line bg-white p-8 shadow-float sm:flex-row sm:items-start sm:gap-10 sm:p-10 ${
                    i === 1 ? "sm:ml-16" : i === 2 ? "sm:ml-32" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-6xl font-semibold leading-none text-accent/20 sm:text-7xl"
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold">{e.titre}</h3>
                    <p className="mt-3 max-w-2xl text-lg text-muted">{e.texte}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CE QUE TU REÇOIS */}
      <section id="rapport" className="bg-accent-soft/60">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <h2 className="text-4xl font-semibold sm:text-5xl">{COPY.recois.titre}</h2>
              <p className="mt-8 font-display text-2xl italic leading-snug text-accent sm:text-3xl">
                {COPY.recois.mention}
              </p>
            </Reveal>
            <ul className="space-y-5">
              {COPY.recois.items.map((item, i) => (
                <Reveal key={item} delay={i * 0.07} y={24}>
                  <li className="flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-float">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white"
                    >
                      ✓
                    </span>
                    <span className="text-lg">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* POURQUOI UN SEUL BUSINESS */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <Reveal>
            <h2 className="text-4xl font-semibold sm:text-5xl">{COPY.unSeul.titre}</h2>
            <p className="mt-10 whitespace-pre-line font-display text-xl leading-relaxed text-ink/80 sm:text-2xl">
              {COPY.unSeul.texte}
            </p>
          </Reveal>
        </div>
      </section>

      {/* TÉMOIGNAGES — seulement quand il y en a de VRAIS */}
      {TEMOIGNAGES.length > 0 && (
        <section id="temoignages" className="bg-accent-soft/60">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
            <Reveal>
              <h2 className="text-4xl font-semibold sm:text-5xl">Ils ont reçu leur rapport</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {TEMOIGNAGES.map((t, i) => (
                <Reveal key={`${t.prenom}-${i}`} delay={i * 0.08}>
                  <blockquote className="rounded-2xl border border-line bg-white p-7 shadow-float">
                    <p className="text-lg">« {t.texte} »</p>
                    <cite className="mt-4 block text-sm font-semibold text-accent">
                      — {t.prenom}
                    </cite>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TON CONSEILLER */}
      <section className="border-y border-line bg-white/60">
        <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Genève, Suisse</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">{COPY.qui.titre}</h2>
            <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-muted sm:text-xl">
              {COPY.qui.texte}
            </p>
          </Reveal>
        </div>
      </section>

      {/* PRIX */}
      <section id="prix" className="relative overflow-hidden">
        <div className="hero-aura absolute inset-0 rotate-180" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl px-6 py-24 sm:py-32">
          <Reveal>
            <TiltCard className="rounded-[2rem] border border-line bg-white p-10 text-center shadow-lift sm:p-14">
              <h2 className="text-3xl font-semibold sm:text-4xl">{COPY.prix.titre}</h2>
              <p className="mt-8 font-display text-6xl font-semibold text-accent sm:text-7xl">
                {COPY.prix.montant}
              </p>
              <ul className="mx-auto mt-10 max-w-md space-y-3 text-left">
                {COPY.prix.inclus.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="font-bold text-accent">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted">{COPY.prix.garantie}</p>
              <div className="mt-10">
                <CtaButton href="/mini-test/">{COPY.prix.cta}</CtaButton>
                <p className="mt-4 text-sm text-muted">{COPY.prix.reassurance}</p>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="mx-auto max-w-3xl px-6 pb-28 pt-4 sm:pb-36">
          <Reveal>
            <h2 className="text-4xl font-semibold sm:text-5xl">{COPY.faqTitre}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12">
              <Faq />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
