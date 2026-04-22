import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { tr } = useLang();
  return (
  <section className="relative grain overflow-hidden">
    <div className="max-w-4xl mx-auto px-6 py-28 md:py-32 text-center">
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] text-foreground"
      >
        {tr("heroTitle1")} <br />
        {tr("heroTitle2")} <span className="gold-underline italic">{tr("heroTitle3")}</span>{tr("heroTitleEnd")}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-8 max-w-[650px] mx-auto text-base md:text-lg text-foreground/70 leading-relaxed"
      >
        {tr("heroSub")}
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4"
      >
        <a
          href="#waitlist"
          className="w-full md:w-auto px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-[0_4px_20px_-8px_hsl(var(--primary)/0.4)] hover:shadow-[0_8px_40px_-6px_hsl(var(--primary)/0.55)] transition-shadow duration-500"
        >
          {tr("heroCta1")}
        </a>
        <a
          href="#demo"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm text-foreground/80 hover:text-foreground transition"
        >
          <Play className="w-4 h-4" /> {tr("heroCta2")}
        </a>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        onSubmit={(e) => e.preventDefault()}
        className="mt-12 max-w-md mx-auto flex items-center gap-3 border-b border-foreground/40 pb-2"
      >
        <input
          type="email"
          placeholder={tr("heroEmail")}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-foreground/40"
        />
        <button className="text-xs uppercase tracking-wider text-foreground/70 hover:text-foreground">
          {tr("heroSlip")}
        </button>
      </motion.form>
    </div>
  </section>
  );
};