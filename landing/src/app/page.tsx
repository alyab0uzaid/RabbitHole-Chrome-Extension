import HeroSection from '@/components/hero-section-five';
import FooterSection from '@/components/footer-four';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="flex-1">
        <HeroSection />
      </main>
      <FooterSection />
    </div>
  );
}
