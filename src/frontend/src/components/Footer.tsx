import { Waves } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-teal text-sand">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-sea/30 flex items-center justify-center">
                <Waves className="w-4 h-4 text-sand-light" />
              </div>
              <div>
                <div className="text-sm font-display font-bold text-sand-light tracking-[0.15em] uppercase">
                  Ostend
                </div>
                <div className="text-[10px] font-body text-sand tracking-[0.2em] uppercase">
                  Beach Therapy
                </div>
              </div>
            </div>
            <p className="text-sand font-body text-sm leading-relaxed">
              Professional outdoor therapy sessions on the beautiful shores of
              Oostende, Belgium.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sand-light text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <nav className="space-y-2">
              {[
                ["About", "#about"],
                ["CV / Qualifications", "#cv"],
                ["Therapy Sessions", "#therapy"],
                ["Pricing", "#pricing"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="block text-sand hover:text-sand-light font-body text-sm transition-colors"
                  data-ocid="nav.link"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-display font-bold text-sand-light text-sm uppercase tracking-wider mb-4">
              Location
            </h4>
            <p className="text-sand font-body text-sm leading-relaxed">
              Zeedijk, Oostende
              <br />
              West-Vlaanderen
              <br />
              Belgium
              <br />
              <br />
              Sessions: Tue – Sat · 9:00–18:00
            </p>
          </div>
        </div>

        <div className="border-t border-sand/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sand/60 font-body text-xs">
            © {year} Ostend Beach Therapy. All rights reserved.
          </p>
          <p className="text-sand/50 font-body text-xs">
            Built with ❤ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sand transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
