import { motion } from "motion/react";
import type { SessionContentItem } from "../backend.d";
import { getIcon } from "../lib/iconMap";
import { WaveDivider } from "./WaveDivider";

interface TherapySectionProps {
  items: SessionContentItem[];
}

export function TherapySection({ items }: TherapySectionProps) {
  return (
    <section id="therapy" className="bg-background">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-tan-dark font-body text-xs uppercase tracking-[0.3em] font-semibold mb-3">
            Your Journey
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-teal mb-4">
            What to Expect
          </h2>
          <p className="text-foreground/70 font-body max-w-xl mx-auto leading-relaxed">
            Each session is a bespoke experience, tailored to your needs and
            guided by the rhythm of the sea.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const Icon = getIcon(item.iconName);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border text-center hover:shadow-hero transition-shadow duration-300"
                data-ocid={`therapy.item.${i + 1}`}
              >
                <div className="w-12 h-12 rounded-xl bg-sea/60 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="font-body font-bold text-teal text-sm uppercase tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="text-foreground/70 font-body text-xs leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <WaveDivider fill="oklch(0.845 0.042 215)" />
    </section>
  );
}
