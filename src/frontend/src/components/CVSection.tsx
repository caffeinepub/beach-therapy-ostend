import { Award, Briefcase, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import type { CVEntry, CVType } from "../backend.d";
import { WaveDivider } from "./WaveDivider";

interface CVSectionProps {
  entries: CVEntry[];
}

const typeConfig: Record<
  string,
  { label: string; icon: typeof GraduationCap; color: string }
> = {
  education: { label: "Education", icon: GraduationCap, color: "text-teal" },
  experience: { label: "Experience", icon: Briefcase, color: "text-tan-dark" },
  certification: {
    label: "Certifications",
    icon: Award,
    color: "text-sea-dark",
  },
};

export function CVSection({ entries }: CVSectionProps) {
  const grouped = entries.reduce(
    (acc, entry) => {
      const type = entry.type as unknown as string;
      if (!acc[type]) acc[type] = [];
      acc[type].push(entry);
      return acc;
    },
    {} as Record<string, CVEntry[]>,
  );

  const order = ["education", "experience", "certification"];

  return (
    <section id="cv" className="bg-sea">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-teal/60 font-body text-xs uppercase tracking-[0.3em] font-semibold mb-3">
            Background & Training
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-teal">
            Qualifications & CV
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {order.map((type) => {
            const config = typeConfig[type];
            const items = grouped[type] || [];
            const Icon = config.icon;
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: order.indexOf(type) * 0.1 }}
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <h3 className="font-display font-bold text-teal text-lg uppercase tracking-wide">
                    {config.label}
                  </h3>
                </div>

                <div className="space-y-4">
                  {items.length === 0 && (
                    <p className="text-teal/50 text-sm italic">
                      No entries yet.
                    </p>
                  )}
                  {items.map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-card rounded-xl p-4 shadow-card border border-border"
                      data-ocid={`cv.item.${i + 1}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-body font-semibold text-teal text-sm">
                          {entry.title}
                        </h4>
                        <span className="text-xs text-muted-foreground font-body ml-2 shrink-0">
                          {entry.yearRange}
                        </span>
                      </div>
                      <p className="text-xs text-tan-dark font-body font-medium mb-1">
                        {entry.organization}
                      </p>
                      {entry.description && (
                        <p className="text-xs text-foreground/70 font-body leading-relaxed">
                          {entry.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <WaveDivider fill="oklch(0.924 0.028 82)" />
    </section>
  );
}
