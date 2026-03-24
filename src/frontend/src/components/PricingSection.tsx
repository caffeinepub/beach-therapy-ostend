import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import type { PricingPackage } from "../backend.d";
import { WaveDivider } from "./WaveDivider";

interface PricingSectionProps {
  packages: PricingPackage[];
}

export function PricingSection({ packages }: PricingSectionProps) {
  return (
    <section id="pricing" className="bg-sea">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-teal/60 font-body text-xs uppercase tracking-[0.3em] font-semibold mb-3">
            Investment in Yourself
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-teal mb-4">
            Session Packages
          </h2>
          <p className="text-teal/70 font-body max-w-md mx-auto">
            Transparent pricing for your peace of mind.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 flex flex-col shadow-card border transition-all duration-300 ${
                pkg.highlighted
                  ? "bg-teal border-teal-light shadow-hero scale-[1.02]"
                  : "bg-card border-border hover:shadow-hero"
              }`}
              data-ocid={`pricing.item.${i + 1}`}
            >
              {pkg.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tan text-teal-dark text-xs font-body font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <h3
                className={`font-display font-bold text-lg mb-1 uppercase tracking-wide ${
                  pkg.highlighted ? "text-sand-light" : "text-teal"
                }`}
              >
                {pkg.name}
              </h3>
              <p
                className={`text-xs font-body mb-4 ${pkg.highlighted ? "text-sea-light" : "text-muted-foreground"}`}
              >
                {pkg.duration}
              </p>
              <div
                className={`text-4xl font-display font-bold mb-1 ${pkg.highlighted ? "text-sand-light" : "text-teal"}`}
              >
                €{pkg.price}
              </div>
              <p
                className={`text-xs font-body mb-5 ${pkg.highlighted ? "text-sea-light" : "text-muted-foreground"}`}
              >
                {pkg.description}
              </p>
              <ul className="space-y-2 flex-1 mb-6">
                {pkg.bulletPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${pkg.highlighted ? "text-sea-light" : "text-teal"}`}
                    />
                    <span
                      className={`text-xs font-body leading-relaxed ${pkg.highlighted ? "text-sand/90" : "text-foreground/75"}`}
                    >
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`rounded-full font-body font-semibold text-sm w-full ${
                  pkg.highlighted
                    ? "bg-tan text-teal-dark hover:bg-tan-dark"
                    : "bg-teal text-sand-light hover:bg-teal-dark"
                }`}
                data-ocid={`pricing.primary_button.${i + 1}`}
              >
                <a href="#contact">Book This Package</a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      <WaveDivider fill="oklch(0.924 0.028 82)" />
    </section>
  );
}
