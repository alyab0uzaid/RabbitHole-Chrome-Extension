import HeroSection from '@/components/hero-section-five';
import FeaturesSection from '@/components/features-12';
import CallToActionOne from '@/components/call-to-action-one';
import FooterSection from '@/components/footer-four';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CallToActionOne />
      </main>
      <FooterSection />
    </div>
  );
}
