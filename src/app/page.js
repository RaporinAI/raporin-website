import HeroSection from "../components/HeroSection.jsx";
import FeaturesSection from "../components/FeaturesSection.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import TestimonialsSection from "../components/TestimonialsSection.jsx";
import FAQSection from "../components/FAQSection.jsx";
import Footer from "../components/Footer.jsx";
import PricingSection from "../components/PricingSection.jsx";
import ContactSection from "../components/ContactSection.jsx";
import FaqSchema from "../components/FaqSchema.jsx";
import ProductSchema from "../components/ProductSchema";
import LaunchBanner from "../components/LaunchBanner.jsx";

export default function HomePage() {
  return (
    <main className="[&_:target]:scroll-mt-32">
      <FaqSchema />
      <ProductSchema />
      <div className="pt-28">
        <LaunchBanner />
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </main>
  );
}
