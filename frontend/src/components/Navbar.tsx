import { useState, useEffect, useRef } from "react";
import { subscribeOnlineVisitors, trackPageView } from "../services/socket.service.js";
import { useTheme } from "../hooks/useTheme.js";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isClickScrolling = useRef(false);
  const unlockTimer = useRef<number | null>(null);

  const navLinks = [
    { label: "Home", href: "#hero", id: "hero" },
    { label: "About", href: "#about", id: "about" },
    { label: "Skills", href: "#skills", id: "skills" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Experience", href: "#experience", id: "experience" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];


  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();

    setActiveSection(targetId);
    isClickScrolling.current = true;

    if (unlockTimer.current) {
      clearTimeout(unlockTimer.current);
    }

    trackPageView(`/#${targetId}`);

    if (targetId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 76;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    }

    unlockTimer.current = window.setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      if (isClickScrolling.current) {
        if (unlockTimer.current) {
          clearTimeout(unlockTimer.current);
        }
        unlockTimer.current = window.setTimeout(() => {
          isClickScrolling.current = false;
        }, 200);
        return;
      }

      if (scrollY < 150) {
        setActiveSection("hero");
        return;
      }

      if (window.innerHeight + Math.round(scrollY) >= document.documentElement.scrollHeight - 60) {
        setActiveSection("contact");
        return;
      }

      const sectionIds = ["about", "skills", "projects", "experience", "contact"];

      let currentSection = "hero";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            currentSection = id;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const unsubscribe = subscribeOnlineVisitors((count) => {
      setOnlineCount(count);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
      unsubscribe();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-3.5" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, "hero")}
          className="group flex items-center gap-2.5 text-[var(--text-color)] no-underline font-display tracking-tight text-lg sm:text-xl font-bold shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-cyan-400/80 border border-cyan-400/30 flex items-center justify-center text-cyan-700 dark:text-cyan-200 group-hover:border-cyan-400 transition-colors shadow-sm">
            <span className="font-mono text-sm font-bold">TH</span>
          </div>
          <div className="flex flex-col">
            <span className="leading-tight group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
              TRAN HIEU
            </span>
            <span className="text-[10px] font-mono text-muted tracking-widest uppercase">
              Full-Stack Eng
            </span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1 bg-surface-100/80 dark:bg-surface-100/60 p-1.5 rounded-full border border-border-subtle backdrop-blur-md shadow-sm">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 ${
                  isActive
                    ? "bg-black/[0.06] text-cyan-600 border-black/[0.08] dark:bg-white/[0.08] dark:text-cyan-300 dark:border-white/[0.08] shadow-sm font-semibold"
                    : "text-muted hover:text-[var(--text-color)] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] border-transparent"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-100/80 border border-border-subtle text-[11px] font-mono text-muted"
            title="Realtime connected active visitors on this website (SSE)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-[var(--text-color)]">{onlineCount}</span>
            <span className="text-muted text-[10px]">online</span>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-100/90 hover:bg-surface-200 border border-border-subtle text-xs font-mono text-muted hover:text-[var(--text-color)] transition-all shadow-sm cursor-pointer"
            aria-label="Toggle Light/Dark Theme"
            title={theme === "dark" ? "Chuyển sang chế độ Sáng (Light Mode)" : "Chuyển sang chế độ Tối (Dark Mode)"}
          >
            {theme === "dark" ? (
              <>
                <svg className="w-4 h-4 text-amber-400 animate-[spin_16s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span className="text-[11px] font-medium text-amber-300">Light</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                <span className="text-[11px] font-medium text-sky-700">Dark</span>
              </>
            )}
          </button>

          <a
            href="#contact"
            onClick={(e) => scrollToSection(e, "contact")}
            className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black font-medium text-xs hover:bg-cyan-500 dark:hover:bg-cyan-300 transition-all shadow-sm hover:shadow-md"
          >
            Get in Touch
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-surface-100 border border-border-subtle text-muted hover:text-[var(--text-color)] cursor-pointer"
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
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-4 pb-6 bg-surface-50/95 dark:bg-[#09090e]/95 backdrop-blur-xl border-b border-border-subtle flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-500 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {onlineCount} Online
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 border border-border-subtle text-xs font-mono cursor-pointer"
            >
              {theme === "dark" ? (
                <>
                  <span className="text-amber-300">☀️</span>
                  <span className="text-amber-300 font-medium">Chế độ Sáng</span>
                </>
              ) : (
                <>
                  <span className="text-sky-600">🌙</span>
                  <span className="text-sky-700 font-medium">Chế độ Tối</span>
                </>
              )}
            </button>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                scrollToSection(e, link.id);
              }}
              className={`py-2 text-sm transition-colors ${
                activeSection === link.id
                  ? "text-cyan-600 dark:text-cyan-300 font-semibold"
                  : "text-muted hover:text-[var(--text-color)]"
              }`}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contact"
            onClick={(e) => {
              setMobileMenuOpen(false);
              scrollToSection(e, "contact");
            }}
            className="mt-2 text-center py-2.5 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black font-medium text-xs hover:bg-cyan-500 dark:hover:bg-cyan-300 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      )}
    </header>
  );
};
