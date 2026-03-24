import { motion } from "motion/react";
import type { TherapistProfile } from "../backend.d";
import { WaveDivider } from "./WaveDivider";

interface BioSectionProps {
  profile: TherapistProfile | undefined;
  photoUrl: string | null;
}

export function BioSection({ profile, photoUrl }: BioSectionProps) {
  const bioText =
    profile?.bio ||
    "I am a licensed psychotherapist with over 10 years of experience, specialising in nature-based and outdoor therapy. Growing up near the sea in Ostend, I have always been drawn to the restorative power of the ocean. Today, I combine evidence-based therapeutic approaches with the healing environment of the Belgian coast to help clients find clarity, calm, and inner strength.\n\nMy practice is rooted in compassion, curiosity, and respect for the natural world. Whether you are navigating life transitions, managing anxiety, or simply seeking a deeper connection with yourself, beach therapy offers a unique and profoundly effective path forward.";

  return (
    <section id="about" className="bg-background">
      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-card">
                <img
                  src={
                    photoUrl ||
                    "/assets/generated/therapist-placeholder.dim_600x750.jpg"
                  }
                  alt={profile?.name || "Your Therapist"}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -z-10 -bottom-3 -left-3 w-full h-full rounded-2xl bg-sea" />
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-tan/40 blur-xl" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-tan-dark font-body text-xs uppercase tracking-[0.3em] font-semibold mb-3">
              Meet Your Therapist
            </p>
            <h2 className="font-display text-3xl font-bold text-teal mb-2">
              {profile?.name || "Sophie Van den Berg"}
            </h2>
            <p className="text-teal/70 font-body text-base mb-6 italic">
              {profile?.tagline ||
                "Licensed Psychotherapist & Outdoor Therapy Specialist"}
            </p>
            <div className="prose prose-sm max-w-none text-foreground/80 font-body leading-relaxed">
              {bioText.split("\n").map((para) => (
                <p key={para.slice(0, 40)} className="mb-4">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <WaveDivider fill="oklch(0.845 0.042 215)" />
    </section>
  );
}
