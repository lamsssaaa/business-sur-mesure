import Hero from "@/components/Hero";
import HomeBody from "@/components/HomeBody";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import MobileCta from "@/components/MobileCta";

export default function Home() {
  return (
    <main>
      <JsonLd />
      <Hero />
      <HomeBody />
      <Footer />
      <MobileCta />
    </main>
  );
}
