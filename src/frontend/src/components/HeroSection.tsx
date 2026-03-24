import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import type { TherapistProfile } from "../backend.d";
import { WaveDivider } from "./WaveDivider";

interface HeroSectionProps {
  profile: TherapistProfile | undefined;
  photoUrl: string | null;
}

export function HeroSection({ profile, photoUrl }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col" id="hero">
      {/* Beach background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/hero-beach-ostende.dim_1920x1080.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-teal-dark/75 via-teal/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-sea/60" />

      {/* Content */}
      <div className="relative z-10 flex-1 container mx-auto px-6 pt-28 pb-12 flex items-center">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-sand/90 font-body text-sm uppercase tracking-[0.3em] mb-4">
              Oostende, België · Beach Therapy
            </p>
            <h1
              className="font-display font-bold text-sand-light leading-[1.05] mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              Vind Balans
              <br />
              <span className="text-sea-light">aan de Kust</span>
              <br />
              van Oostende
            </h1>
            <p className="text-sand/85 font-body text-base leading-relaxed mb-2 max-w-md">
              Find your balance on the shores of Ostend.
            </p>
            <p className="text-sand/75 font-body text-sm leading-relaxed mb-8 max-w-md">
              {profile?.tagline ||
                "Professional outdoor therapy sessions where the sea meets healing. Walk, breathe, and reconnect with yourself."}
            </p>
            <div className="flex flex-wrap gap-3">
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
                className="rounded-full border-sand/60 text-sand bg-transparent hover:bg-sand/10 font-body font-semibold px-7 py-2.5 text-sm"
                data-ocid="hero.secondary_button"
              >
                <a href="#about">Learn More</a>
              </Button>
            </div>
          </motion.div>

          {/* Right: Therapist photo */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hidden md:flex justify-center md:justify-end"
          >
            <div className="relative">
              <div className="w-72 h-96 lg:w-80 lg:h-[440px] rounded-2xl overflow-hidden shadow-hero border-4 border-sand/30">
                <img
                  src={
                    photoUrl ||
                    "/assets/generated/therapist-placeholder.dim_600x750.jpg"
                  }
                  alt={profile?.name || "Your Therapist"}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              </div>
              {/* Decorative blob */}
              <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-2xl bg-sea-light/40" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="relative z-10">
        <WaveDivider fill="oklch(0.924 0.028 82)" />
      </div>
    </section>
  );
}
