import { Button } from "@/components/ui/button";
import { Menu, Waves, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "CV / Qualifications", href: "#cv" },
    { label: "Therapy", href: "#therapy" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-sand-light/95 backdrop-blur-md shadow-xs border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group"
          data-ocid="nav.link"
        >
          <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center shadow-xs">
            <Waves className="w-5 h-5 text-sand-light" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-display font-bold text-teal tracking-[0.15em] uppercase">
              Ostend
            </div>
            <div className="text-[10px] font-body text-teal/70 tracking-[0.2em] uppercase">
              Beach Therapy
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-body font-medium text-teal/80 hover:text-teal transition-colors tracking-wide uppercase text-[11px]"
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden md:flex rounded-full bg-tan text-teal-dark font-body font-semibold text-sm px-5 hover:bg-tan-dark transition-colors"
            data-ocid="nav.primary_button"
          >
            <a href="#contact">Book Now</a>
          </Button>
          <button
            type="button"
            className="md:hidden text-teal"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-sand-light/98 border-b border-border px-6 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-body font-medium text-teal uppercase tracking-wider"
              data-ocid="nav.link"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-3 flex items-center justify-center w-full rounded-full bg-tan text-teal-dark font-semibold py-2.5 text-sm hover:bg-tan-dark transition-colors"
            data-ocid="nav.primary_button"
          >
            Book Now
          </button>
        </div>
      )}
    </header>
  );
}
