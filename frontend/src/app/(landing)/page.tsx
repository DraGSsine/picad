import Footer from "@/components/landing/footer";
import WhyUs from "@/components/landing/why-us";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import FAQ from "@/components/landing/faq";
import Hero from "@/components/landing/hero";
import CTA from "@/components/landing/cta";
import HowItWorks from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-white">
      <main className="flex-grow">
        <Hero />
        <WhyUs />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
