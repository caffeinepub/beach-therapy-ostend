import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import type { TherapistProfile } from "../backend.d";
import { WaveDivider } from "./WaveDivider";

interface HeroSectionProps {
  profile: TherapistProfile | undefined;
  photoUrl: string | null;
}

export function HeroSection({
  profile,
  photoUrl: _photoUrl,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col" id="hero">
      {/* Beach background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/uploads/armennano-sunset-7335440-019d21b2-0d6a-7662-b2e5-1d1eb789458d-1.jpg')`,
        }}
      />
      {/* Subtle gradient only at very top and very bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent via-40% to-black/30" />

      {/* TOP TEXT — sits in the open sky above the buildings */}
      <div className="relative z-10 container mx-auto px-6 pt-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          <p className="text-sand/90 font-body text-sm uppercase tracking-[0.3em] mb-3 drop-shadow">
            Oostende, België · Beach Therapy
          </p>
          <h1
            className="font-display font-bold text-white leading-[1.05] drop-shadow-lg"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              textShadow: "0 2px 12px rgba(0,0,0,0.35)",
            }}
          >
            Vind Balans
            <br />
            <span className="text-teal-light">aan de Kust</span>
            <br />
            van Oostende
          </h1>
        </motion.div>
      </div>

      {/* Spacer pushes bottom content down into the sea/sand area */}
      <div className="flex-1" />

      {/* BOTTOM TEXT & BUTTONS — in the sand, just under the waterline */}
      <div
        className="relative z-10 container mx-auto px-6 pb-4"
        style={{ marginBottom: "6vh" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="max-w-lg mb-4"
        >
          <p
            className="text-white/90 font-body text-base leading-relaxed mb-1 drop-shadow"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
          >
            Find your balance on the shores of Ostend.
          </p>
          <p
            className="text-white/75 font-body text-sm leading-relaxed drop-shadow"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
          >
            {profile?.tagline ||
              "Professional outdoor therapy sessions where the sea meets healing. Walk, breathe, and reconnect with yourself."}
          </p>
        </motion.div>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="flex flex-wrap gap-3 pb-2"
        >
          <Button
            asChild
            className="rounded-full bg-tan text-teal-dark font-body font-semibold px-7 py-2.5 hover:bg-tan-dark text-sm transition-all shadow-hero"
            data-ocid="hero.primary_button"
          >
            <a href="#contact">Book a Session</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/60 text-white bg-transparent hover:bg-white/10 font-body font-semibold px-7 py-2.5 text-sm"
            data-ocid="hero.secondary_button"
          >
            <a href="#about">Learn More</a>
          </Button>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="relative z-10">
        <WaveDivider fill="oklch(0.924 0.028 82)" />
      </div>
    </section>
  );
}
