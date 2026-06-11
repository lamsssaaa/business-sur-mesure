"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import CtaButton from "@/components/CtaButton";
import RevealTitle from "@/components/RevealTitle";
import RapportApercu from "@/components/RapportApercu";
import Counter from "@/components/Counter";
import DrawnCheck from "@/components/DrawnCheck";
import Faq from "@/components/Faq";
import { Gem } from "@/components/Gem";
import { COPY } from "@/lib/copy";
import { TEMOIGNAGES } from "@/lib/config";

const STATS = [
  { valeur: 50, suffixe: "", label: "questions sur ton profil" },
  { valeur: 48, suffixe: " h", label: "pour recevoir ton rapport" },
  { valeur: 30, suffixe: " j", label: "de plan d'action concret" },
];

export default function HomeBody() {
  return (
    <>
      {/* CHIFFRES — composés en géant, à même le papier */}
      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} y={24} className="py-12 sm:px-8 sm:py-16">
              <p className="tabular font-display text-[clamp(5.5rem,11vw,10rem)] font-light leading-[0.85] text-ink">
                <Counter value={s.valeur} />
                <span className="text-[0.45em] text-accent">{s.suffixe}</span>
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE — éditorial, numéros géants, grille alternée */}
      <section id="comment">
        <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <p className="kicker">La méthode</p>
          <RevealTitle texte={COPY.etapesTitre} pivot="marche" className="mt-4 text-4xl font-semibold sm:text-6xl" />
          <div className="mt-20">
            {COPY.etapes.map((e, i) => (
              <Reveal key={e.titre} delay={0.05}>
                <div
                  className={`relative border-t border-line py-14 sm:py-20 ${
                    i === 0 ? "" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-6 select-none font-display text-[clamp(7rem,18vw,15rem)] font-semibold leading-none text-accent/[0.07] sm:-top-10"
                    style={{ left: i === 1 ? "auto" : "-0.05em", right: i === 1 ? "-0.02em" : "auto" }}
                  >
                    0{i + 1}
                  </span>
                  <div
                    className={`relative grid gap-4 sm:grid-cols-12 ${""}`}
                  >
                    <h3
                      className={`text-3xl font-semibold sm:text-4xl ${
                        i === 0 ? "sm:col-span-5 sm:col-start-1" : i === 1 ? "sm:col-span-5 sm:col-start-2" : "sm:col-span-5 sm:col-start-3"
                      }`}
                    >
                      {e.titre}
                    </h3>
                    <p
                      className={`max-w-xl text-lg leading-relaxed text-muted ${
                        i === 0 ? "sm:col-span-6 sm:col-start-7" : i === 1 ? "sm:col-span-6 sm:col-start-7" : "sm:col-span-6 sm:col-start-7"
                      }`}
                    >
                      {e.texte}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CE QUE TU REÇOIS — liste éditoriale sur bande sauge */}
      <section id="rapport" className="bg-accent-soft/60">
        <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-24">
            <div>
              <p className="kicker">Ton rapport</p>
              <RevealTitle texte={COPY.recois.titre} pivot="reçois" className="mt-4 text-4xl font-semibold sm:text-6xl" />
              <Reveal delay={0.15}>
                <p className="mt-10 font-display text-2xl italic leading-snug text-accent sm:text-3xl">
                  {COPY.recois.mention}
                </p>
              </Reveal>
            </div>
            <ul>
              {COPY.recois.items.map((item, i) => (
                <Reveal key={item} delay={i * 0.06} y={20}>
                  <li className="flex gap-5 border-t border-ink/10 py-6 last:border-b">
                    <DrawnCheck delay={0.15 + i * 0.07} className="mt-1 h-6 w-6" />
                    <span className="text-lg leading-relaxed">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* À QUOI RESSEMBLE TON RAPPORT */}
      <RapportApercu />

      {/* LE MANIFESTE — le moment typographique de la page */}
      <section className="overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-32 sm:py-44">
          <h2 className="font-display font-semibold leading-[0.95]">
            <Reveal y={48}>
              <span className="block text-[clamp(2.6rem,7vw,6.5rem)]">Pourquoi un seul</span>
            </Reveal>
            <Reveal y={48} delay={0.1}>
              <span className="block text-[clamp(3.2rem,9vw,8.5rem)] italic text-accent">
                business,
              </span>
            </Reveal>
            <Reveal y={48} delay={0.2}>
              <span className="block text-[clamp(2.2rem,5.5vw,5rem)] text-muted">
                et pas une liste
              </span>
            </Reveal>
          </h2>
          <Reveal delay={0.3}>
            <p className="mt-16 max-w-[36rem] whitespace-pre-line text-xl leading-relaxed text-ink/80 lg:ml-[42%]">
              {COPY.unSeul.texte}
            </p>
          </Reveal>
          {/* CTA de mi-page : un lecteur convaincu ici ne doit pas chercher le bouton en bas */}
          <Reveal delay={0.4}>
            <div className="mt-12 lg:ml-[42%]">
              <CtaButton href="/mini-test/">{COPY.hero.cta}</CtaButton>
              <p className="mt-4 text-sm text-muted">{COPY.hero.reassurance}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TÉMOIGNAGES — seulement quand il y en a de VRAIS */}
      {TEMOIGNAGES.length > 0 && (
        <section id="temoignages" className="bg-accent-soft/60">
          <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
            <p className="kicker">Ils l'ont fait</p>
            <RevealTitle texte="Ils ont reçu leur rapport" pivot="rapport" className="mt-4 text-4xl font-semibold sm:text-6xl" />
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {TEMOIGNAGES.map((t, i) => (
                <Reveal key={`${t.prenom}-${i}`} delay={i * 0.08}>
                  <blockquote className="border-t border-ink/10 pt-6">
                    <p className="font-display text-xl italic leading-relaxed">« {t.texte} »</p>
                    <cite className="mt-4 block text-sm font-semibold not-italic text-accent">
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
      <section className="relative overflow-hidden border-y border-line bg-white/50">
        <Gem
          size={420}
          variant="pale"
          className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 opacity-50"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <div className="max-w-3xl">
            <p className="kicker">Genève, Suisse</p>
            <RevealTitle texte={COPY.qui.titre} pivot="conseiller" className="mt-4 text-4xl font-semibold sm:text-6xl" />
            <Reveal delay={0.15}>
              <p className="mt-10 whitespace-pre-line text-lg leading-relaxed text-muted sm:text-xl">
                {COPY.qui.texte}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRIX — la scène sombre : UNE décision, UN prix */}
      <section id="prix" className="relative overflow-hidden bg-accent-deep text-paper">
        <Gem
          size={560}
          variant="plein"
          className="pointer-events-none absolute -bottom-40 -right-32 opacity-[0.18]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-32 sm:py-44">
          <Reveal>
            <p className="font-display text-2xl italic text-paper/85 sm:text-3xl">{COPY.prix.titre}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="tabular mt-6 font-display text-[clamp(4.5rem,13vw,12rem)] font-light leading-[0.9]">
              49<span className="text-gold">.90</span>
              <span className="ml-3 align-middle font-sans text-[0.18em] font-semibold uppercase tracking-[0.2em] text-paper/70">
                CHF
              </span>
            </p>
            {/* La garantie collée au prix : c'est là qu'elle lève l'hésitation */}
            <p className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-gold/50 px-5 py-2.5 text-sm font-medium text-paper/90">
              <span aria-hidden="true" className="text-gold">✓</span>
              Satisfait ou remboursé — 14 jours, sans justification
            </p>
          </Reveal>
          <div className="mt-14 grid gap-x-16 gap-y-5 sm:grid-cols-2">
            {COPY.prix.inclus.map((item, i) => (
              <Reveal key={item} delay={0.15 + i * 0.06} y={16}>
                <div className="flex gap-4 border-t border-paper/15 pt-5">
                  <DrawnCheck or delay={0.25 + i * 0.08} className="mt-0.5 h-5 w-5" />
                  <span className="text-lg text-paper/90">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.25}>
            <p className="mt-10 max-w-xl text-paper/60">{COPY.prix.garantie}</p>
            <div className="mt-12">
              <Link
                href="/mini-test/"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-paper px-8 py-4 text-base font-semibold text-accent-deep shadow-lift transition duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-9 sm:text-lg"
              >
                {COPY.prix.cta}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <p className="mt-4 text-sm text-paper/60">{COPY.prix.reassurance}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ — index éditorial */}
      <section id="faq">
        <div className="mx-auto max-w-4xl px-6 pb-32 pt-28 sm:pb-40 sm:pt-36">
          <p className="kicker">Avant de te lancer</p>
          <RevealTitle texte={COPY.faqTitre} pivot="fréquentes" className="mt-4 text-4xl font-semibold sm:text-6xl" />
          <Reveal delay={0.1}>
            <div className="mt-14">
              <Faq />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
