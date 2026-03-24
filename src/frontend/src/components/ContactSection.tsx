import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitContactForm } from "../hooks/useQueries";

interface ContactSectionProps {
  profile?:
    | { contactEmail?: string; contactPhone?: string; contactAddress?: string }
    | undefined;
}
export function ContactSection({ profile }: ContactSectionProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const submitForm = useSubmitContactForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitForm.mutateAsync(form);
      setSubmitted(true);
      toast.success("Your message has been sent! We will be in touch soon.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" className="bg-background">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-tan-dark font-body text-xs uppercase tracking-[0.3em] font-semibold mb-3">
            Get in Touch
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-teal mb-4">
            Book a Session
          </h2>
          <p className="text-foreground/70 font-body max-w-md mx-auto">
            Ready to take the first step? Reach out and I will get back to you
            within 24 hours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display font-bold text-teal text-xl mb-6">
              Find Me at the Beach
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-sea flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <p className="font-body font-semibold text-teal text-sm">
                    Location
                  </p>
                  <p className="text-foreground/70 font-body text-sm">
                    {profile?.contactAddress || "Zeedijk, Oostende"}
                    <br />
                    West-Vlaanderen, Belgium
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-sea flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <p className="font-body font-semibold text-teal text-sm">
                    Email
                  </p>
                  <p className="text-foreground/70 font-body text-sm">
                    {profile?.contactEmail || "contact@ostende-beachtherapy.be"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-sea flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <p className="font-body font-semibold text-teal text-sm">
                    Phone
                  </p>
                  <p className="text-foreground/70 font-body text-sm">
                    {profile?.contactPhone || "+32 (0)59 00 00 00"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-sea/60 rounded-2xl border border-border">
              <p className="font-body text-sm text-teal/80 leading-relaxed">
                <strong className="text-teal">Sessions available:</strong>
                <br />
                Tuesday – Saturday · 9:00 – 18:00
                <br />
                Subject to tide and weather conditions.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center h-full py-12 text-center"
                data-ocid="contact.success_state"
              >
                <CheckCircle className="w-16 h-16 text-teal mb-4" />
                <h3 className="font-display font-bold text-teal text-xl mb-2">
                  Message Sent!
                </h3>
                <p className="text-foreground/70 font-body text-sm">
                  Thank you for reaching out. I will get back to you within 24
                  hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                data-ocid="contact.modal"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contact-name"
                      className="text-xs font-body font-semibold text-teal uppercase tracking-wide"
                    >
                      Name *
                    </Label>
                    <Input
                      id="contact-name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Your name"
                      className="rounded-xl bg-card border-border font-body text-sm"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contact-email"
                      className="text-xs font-body font-semibold text-teal uppercase tracking-wide"
                    >
                      Email *
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="your@email.com"
                      className="rounded-xl bg-card border-border font-body text-sm"
                      data-ocid="contact.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-phone"
                    className="text-xs font-body font-semibold text-teal uppercase tracking-wide"
                  >
                    Phone
                  </Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+32 ..."
                    className="rounded-xl bg-card border-border font-body text-sm"
                    data-ocid="contact.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-message"
                    className="text-xs font-body font-semibold text-teal uppercase tracking-wide"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="contact-message"
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Tell me a little about yourself and what you are looking for..."
                    rows={4}
                    className="rounded-xl bg-card border-border font-body text-sm resize-none"
                    data-ocid="contact.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitForm.isPending}
                  className="w-full rounded-full bg-tan text-teal-dark hover:bg-tan-dark font-body font-semibold py-2.5"
                  data-ocid="contact.submit_button"
                >
                  {submitForm.isPending ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
