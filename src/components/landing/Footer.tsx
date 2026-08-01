import { ArrowUpRight } from "lucide-react";

interface FooterProps {
  onLinkClick?: (link: string) => void;
}

const footerLinks = {
  Platform: ["Features", "Pricing", "Security", "Enterprise"],
  Company: ["About", "Careers", "Press", "Contact"],
  Resources: ["Documentation", "Research", "Blog", "Support"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

const Footer = ({ onLinkClick }: FooterProps) => {

  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    
    // Scroll anchors
    if (link === "Features") {
      const el = document.getElementById("platform");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (link === "Enterprise") {
      const el = document.getElementById("insights");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (link === "About" || link === "Research") {
      const el = document.getElementById("science");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (onLinkClick) {
      // Trigger dialog for other info links
      onLinkClick(link);
    }
  };

  return (
    <footer className="border-t border-border bg-muted/10">
      <div className="container py-16 md:py-20">
        <div className="grid md:grid-cols-5 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="font-serif text-xl tracking-tight font-semibold text-primary">ATHENAFIT</span>
            <p className="text-xs text-muted-foreground mt-4 max-w-xs leading-relaxed">
              Readiness intelligence for athletes and performance coaches. Know when to train, when to recover, and when to rest.
            </p>
          </div>

          {/* Links categories */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs text-primary uppercase tracking-widest font-bold mb-4">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={(e) => handleLinkClick(e, link)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 text-left font-semibold hover:underline"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 ATHENAFIT Readiness Intelligence. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-serif italic font-semibold tracking-wide">
            Made by Mifra and Yasar
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "Instagram"].map((social) => (
              <a
                key={social}
                href="#"
                onClick={(e) => { e.preventDefault(); if (onLinkClick) onLinkClick(social); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 font-semibold"
              >
                {social}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
