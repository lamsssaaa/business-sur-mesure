import Section from "@/components/Section";
import CtaButton from "@/components/CtaButton";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { COPY } from "@/lib/copy";
import { TEMOIGNAGES } from "@/lib/config";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <Section>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{COPY.hero.titre}</h1>
        <p className="mt-5 text-xl text-muted">{COPY.hero.sousTitre}</p>
        <div className="mt-8">
          <CtaButton href="/mini-test/">{COPY.hero.cta}</CtaButton>
          <p className="mt-3 text-sm text-muted">{COPY.hero.reassurance}</p>
        </div>
      </Section>

      {/* COMMENT ÇA MARCHE */}
      <Section id="comment" alt>
        <h2 className="text-3xl font-bold">{COPY.etapesTitre}</h2>
        <ol className="mt-10 space-y-8">
          {COPY.etapes.map((etape, i) => (
            <li key={etape.titre} className="flex gap-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold">{etape.titre}</h3>
                <p className="mt-2 text-muted">{etape.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* CE QUE TU REÇOIS */}
      <Section id="rapport">
        <h2 className="text-3xl font-bold">{COPY.recois.titre}</h2>
        <ul className="mt-8 space-y-4">
          {COPY.recois.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="font-semibold text-accent" aria-hidden="true">
                ✓
              </span>
              <span className="text-muted">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-medium text-accent">{COPY.recois.mention}</p>
      </Section>

      {/* POURQUOI UN SEUL BUSINESS */}
      <Section id="un-seul" alt>
        <h2 className="text-3xl font-bold">{COPY.unSeul.titre}</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">{COPY.unSeul.texte}</p>
      </Section>

      {/* TÉMOIGNAGES — visible uniquement quand il y en a de vrais */}
      {TEMOIGNAGES.length > 0 && (
        <Section id="temoignages">
          <h2 className="text-3xl font-bold">Ils ont reçu leur rapport</h2>
          <div className="mt-8 space-y-6">
            {TEMOIGNAGES.map((t, i) => (
              <blockquote key={`${t.prenom}-${i}`} className="rounded-lg border border-line bg-white p-6">
                <p className="text-lg">« {t.texte} »</p>
                <footer className="mt-3 text-sm text-muted">— {t.prenom}</footer>
              </blockquote>
            ))}
          </div>
        </Section>
      )}

      {/* QUI EST DERRIÈRE */}
      <Section id="qui">
        <h2 className="text-3xl font-bold">{COPY.qui.titre}</h2>
        <p className="mt-6 text-lg leading-relaxed text-muted">{COPY.qui.texte}</p>
      </Section>

      {/* PRIX */}
      <Section id="prix" alt>
        <div className="rounded-2xl border border-line bg-white p-8 sm:p-10">
          <h2 className="text-3xl font-bold">{COPY.prix.titre}</h2>
          <p className="mt-6 text-5xl font-bold text-accent">{COPY.prix.montant}</p>
          <ul className="mt-8 space-y-3">
            {COPY.prix.inclus.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="font-semibold text-accent" aria-hidden="true">
                  ✓
                </span>
                <span className="text-muted">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">{COPY.prix.garantie}</p>
          <div className="mt-8">
            <CtaButton href="/mini-test/">{COPY.prix.cta}</CtaButton>
            <p className="mt-3 text-sm text-muted">{COPY.prix.reassurance}</p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <h2 className="text-3xl font-bold">{COPY.faqTitre}</h2>
        <div className="mt-8">
          <Faq />
        </div>
      </Section>

      <Footer />
    </main>
  );
}
