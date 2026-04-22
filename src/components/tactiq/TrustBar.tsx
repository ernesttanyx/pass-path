import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";

const logos = ["MRSM TRIALS", "SBP TRIALS", "SPM PAST YEARS", "KPM SYLLABUS", "SELANGOR TRIALS", "JOHOR TRIALS"];

export const TrustBar = () => {
  const { tr } = useLang();
  return (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2 }}
    className="py-20 px-6 overflow-hidden"
  >
    <p className="text-center text-[11px] uppercase tracking-[0.25em] text-foreground/50 mb-10">
      {tr("trustLabel")}
    </p>
    <div className="relative">
      <div className="flex gap-16 animate-marquee whitespace-nowrap w-max">
        {[...logos, ...logos, ...logos].map((l, i) => (
          <span
            key={i}
            className="font-serif text-2xl tracking-wide text-foreground/40 hover:text-gold transition-colors duration-500"
          >
            {l}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  </motion.section>
  );
};