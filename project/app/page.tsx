import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import FeaturesOverview from "@/components/features-overview"
import ProcessDiagram from "@/components/process-diagram"
import PricingSection from "@/components/pricing-section"
import WhyHireGenius from "@/components/why-hire-genius"
import TestimonialsSlider from "@/components/testimonials-slider"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesOverview />
        <ProcessDiagram />
        <PricingSection />
        <WhyHireGenius />
        <TestimonialsSlider />
      </main>
      <Footer />
    </div>
  )
}
