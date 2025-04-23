import Footer from "@/components/landing/footer";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import FAQ from "@/components/landing/faq";
import Hero from "@/components/landing/hero";
import CTA from "@/components/landing/cta";
import HowItWorks from "@/components/landing/HowItWorks";
import BackgroundGradient from "@/components/landing/BackgroundGradient";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Single consistent background gradient for the entire page */}
      <BackgroundGradient />
      
      <main className="flex-grow relative z-10">
        <Hero />
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
