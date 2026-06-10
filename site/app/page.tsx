import Hero from "@/components/Hero";
import HomeBody from "@/components/HomeBody";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <main>
      <JsonLd />
      <Hero />
      <HomeBody />
      <Footer />
    </main>
  );
}
