import { Hero, HowItWorks, Features, Trust, CTA, Navbar, Footer, TRUST_ITEMS } from '@/features/landing';
import { HERO_DATA, HOW_IT_WORKS_DATA, CTA_DATA, FEATURE_GROUPS } from '@/features/landing';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero {...HERO_DATA} />
      <HowItWorks {...HOW_IT_WORKS_DATA} />
      <Features
        icon="UsersIcon"
        label="Features"
        title="Built for Everyone in the Supply Chain"
        subtitle="Simple tools designed to protect consumers, support manufacturers, and strengthen regulatory oversight."
        featureGroups={FEATURE_GROUPS}
      />
      <Trust
        icon="ShieldCheckIcon"
        label="Trust & Compliance"
        title="Built on Transparency, Security, and Regulation"
        subtitle="Designed to support regulatory oversight, protect consumers, and strengthen trust across the supply chain."
        items={TRUST_ITEMS}
      />
      <CTA {...CTA_DATA} />
      <Footer />
    </main>
  );
}
