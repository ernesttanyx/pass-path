import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

export const Nav = () => {
  const { lang, setLang, tr } = useLang();
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-serif text-2xl text-foreground">Tactiq</a>
        <div className="flex items-center gap-4 md:gap-8 text-sm">
          <a href="#method" className="hidden md:inline text-foreground/80 hover:text-foreground transition">{tr("navMethod")}</a>
          <a href="#login" className="hidden md:inline text-foreground/80 hover:text-foreground transition">{tr("navLogin")}</a>

          {/* EN/BM toggle */}
          <div
            role="tablist"
            aria-label="Language"
            className="relative inline-flex items-center rounded-full border border-border/80 bg-background/60 p-0.5 text-[11px] uppercase tracking-wider"
          >
            {(["EN", "BM"] as const).map((l) => (
              <button
                key={l}
                role="tab"
                aria-selected={lang === l}
                onClick={() => setLang(l)}
                className="relative px-3 py-1 rounded-full transition-colors"
              >
                {lang === l && (
                  <motion.span
                    layoutId="lang-pill"
                    className="absolute inset-0 rounded-full bg-sage/50"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative ${lang === l ? "text-foreground" : "text-foreground/60"}`}>{l}</span>
              </button>
            ))}
          </div>

          <a
            href="#waitlist"
            className="hidden md:inline px-4 py-2 rounded-full border border-sage text-foreground hover:bg-sage/20 transition"
          >
            {tr("navWaitlist")}
          </a>
        </div>
      </div>
    </motion.nav>
  );
};