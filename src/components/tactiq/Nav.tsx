import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { LoginModal } from "@/components/LoginModal";
import { useState } from 'react'
export const Nav = () => {
  const { lang, setLang, tr } = useLang();
  const [loginOpen, setLoginOpen] = useState(false)
  return (
  <>
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-serif text-2xl text-foreground">tacly</a>
        <div className="flex items-center gap-4 md:gap-8 text-sm">
          <a href="#method" className="hidden md:inline text-foreground/80 hover:text-foreground transition">{tr("navMethod")}</a>
          <a onClick={() => setLoginOpen(true)} className="cursor-pointer hidden md:inline text-foreground/80 hover:text-foreground transition">
            {tr("navLogin")}
          </a>
          <div role="tablist" aria-label="Language" className="relative inline-flex items-center rounded-full border border-border/80 bg-background/60 p-0.5 text-[11px] uppercase tracking-wider">
            {(["EN", "BM"] as const).map((l) => (
              <button key={l} role="tab" aria-selected={lang === l} onClick={() => setLang(l)} className="relative px-3 py-1 rounded-full transition-colors">
                {lang === l && (
                  <motion.span layoutId="lang-pill" className="absolute inset-0 rounded-full bg-sage/50" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <span className={`relative ${lang === l ? "text-foreground" : "text-foreground/60"}`}>{l}</span>
              </button>
            ))}
          </div>
          <a href="https://forms.gle/uJKuzE6MjDQmaq5VA" className="hidden md:inline px-4 py-2 rounded-full border border-sage text-foreground hover:bg-sage/20 transition">
            {tr("navWaitlist")}
          </a>
        </div>
      </div>
    </motion.nav>

    {/* Modal lives here, outside the nav */}
    <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
  </>
)
};