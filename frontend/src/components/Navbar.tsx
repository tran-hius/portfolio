import { useState, useEffect } from "react";
import { subscribeToRealtimeVisitors } from "../services/api.js";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Scroll listener for sticky blur
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect active section for indicator
      const sections = ["hero", "about", "skills", "projects", "experience", "system", "contact"];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Connect to backend Realtime SSE
    const unsubscribe = subscribeToRealtimeVisitors((count) => {
      setOnlineCount(count);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { label: "About", href: "#about", id: "about" },
    { label: "Skills", href: "#skills", id: "skills" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Experience", href: "#experience", id: "experience" },
    { label: "System", href: "#system", id: "system" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-3.5" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#hero"
          className="group flex items-center gap-2.5 text-white no-underline font-display tracking-tight text-lg sm:text-xl font-bold"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-cyan-400/80 border border-cyan-400/30 flex items-center justify-center text-cyan-200 group-hover:border-cyan-400 transition-colors">
            <span className="font-mono text-sm font-bold">TH</span>
          </div>
          <div className="flex flex-col">
            <span className="leading-tight text-white group-hover:text-cyan-300 transition-colors">
              TRAN HIEU
            </span>
            <span className="text-[10px] font-mono text-muted tracking-widest uppercase">
              Full-Stack Eng
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-100/60 p-1.5 rounded-full border border-border-subtle backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeSection === link.id
                  ? "bg-white/[0.08] text-cyan-300 border border-white/[0.08] shadow-sm"
                  : "text-muted hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Realtime Active Visitor Indicator & Action CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Live Visitor Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100/80 border border-white/[0.08] text-[11px] font-mono text-muted"
            title="Realtime connected active visitors on this website (SSE)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-white font-semibold">{onlineCount}</span>
            <span className="text-muted-foreground text-[10px]">online</span>
          </div>

          <a
            href="#contact"
            className="px-4 py-2 rounded-lg bg-white text-black font-medium text-xs hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)]"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-surface-100 border border-border-subtle text-muted hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-4 pb-6 bg-[#09090e]/95 backdrop-blur-xl border-b border-border-subtle flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-xs text-muted font-mono">Live Visitors:</span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {onlineCount} Online
            </div>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-sm text-muted hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 text-center py-2.5 rounded-lg bg-white text-black font-medium text-xs hover:bg-cyan-300 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      )}
    </header>
  );
};
