import { useCallback, useEffect, useRef, useState } from "react";
import { BioSection } from "../components/BioSection";
import { CVSection } from "../components/CVSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { PricingSection } from "../components/PricingSection";
import { TherapySection } from "../components/TherapySection";
import { useActor } from "../hooks/useActor";
import {
  useCVEntries,
  usePricingPackages,
  useSeedData,
  useSessionContentItems,
  useTherapistProfile,
} from "../hooks/useQueries";

export function PublicPage() {
  const { actor, isFetching } = useActor();
  const { data: profile } = useTherapistProfile();
  const { data: cvEntries = [] } = useCVEntries();
  const { data: sessionItems = [] } = useSessionContentItems();
  const { data: pricingPackages = [] } = usePricingPackages();
  const seedData = useSeedData();
  const seeded = useRef(false);
  const doSeed = useCallback(() => seedData.mutate(), [seedData.mutate]);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Seed if empty
  useEffect(() => {
    if (!actor || isFetching || seeded.current) return;
    if (profile !== undefined && !profile.name) {
      seeded.current = true;
      doSeed();
    }
  }, [actor, isFetching, profile, doSeed]);

  // Convert photo bytes to blob URL
  useEffect(() => {
    if (!profile?.photo || profile.photo.length === 0) {
      setPhotoUrl(null);
      return;
    }
    const arr = new Uint8Array(profile.photo);
    const blob = new Blob([arr], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profile?.photo]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection profile={profile} photoUrl={photoUrl} />
        <BioSection profile={profile} photoUrl={photoUrl} />
        <CVSection entries={cvEntries} />
        <TherapySection items={sessionItems} />
        <PricingSection packages={pricingPackages} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
