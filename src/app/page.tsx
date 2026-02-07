import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import LeadForm from "@/components/lead-form";
import BenefitsSection from "@/components/benefits-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-16 flex flex-col gap-16">
        <HeroSection />
        <section id="join">
          <LeadForm />
        </section>
        <BenefitsSection />
        <Footer />
      </main>
    </>
  );
}
