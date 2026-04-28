import { motion } from "framer-motion";

const cards = [
  {
    title: "The Marking Scheme Gap",
    body: 'Knowing the math isn\'t enough. If your "Jalan Kerja" (working steps) doesn\'t match the specific SPM Skema, you lose points. Generic AI doesn\'t know the Skema. Tactiq does.',
    icon: (
      <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="14" y="10" width="30" height="40" rx="2" />
        <line x1="20" y1="20" x2="38" y2="20" />
        <line x1="20" y1="28" x2="38" y2="28" />
        <line x1="20" y1="36" x2="32" y2="36" />
        <circle cx="44" cy="44" r="8" />
        <line x1="50" y1="50" x2="56" y2="56" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "The Cognitive Wall",
    body: 'Traditional tuition dumps 400 pages of jargon on you. For a student at a 10% grade, that is noise. We filter the syllabus down to the "Essential 40%."',
    icon: (
      <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="12" y="40" width="40" height="10" />
        <rect x="14" y="28" width="36" height="10" />
        <rect x="16" y="16" width="32" height="10" />
        <line x1="22" y1="21" x2="30" y2="21" />
        <line x1="20" y1="33" x2="28" y2="33" />
        <line x1="18" y1="45" x2="26" y2="45" />
      </svg>
    ),
  },
  {
    title: "The Data Deficit",
    body: "Students waste 80% of their time on low-yield chapters that barely appear in Paper 2. We use 10 years of trial data to tell you exactly where the marks are hidden.",
    icon: (
      <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1">
        <line x1="10" y1="54" x2="54" y2="54" />
        <rect x="14" y="28" width="8" height="26" />
        <rect x="28" y="20" width="8" height="34" />
        <rect x="42" y="36" width="8" height="18" />
        <polyline points="10,16 22,24 36,18 54,34" strokeWidth="1.2" />
      </svg>
    ),
  },
];

export const Problem = () => (
  <section className="relative py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-20">
        <span className="inline-block text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-sage/25 text-foreground">
          The Problem
        </span>
        <h2 className="mt-6 font-serif text-4xl md:text-6xl text-foreground leading-tight">
          Why 50% of Students <br className="hidden md:block" /> Fail Add Maths.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-12 md:gap-0">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            className="relative px-8 md:px-10"
          >
            {i > 0 && (
              <div className="hidden md:block absolute left-0 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-foreground/20 to-transparent" />
            )}
            <div className="text-foreground mb-6 draw-on-view">{c.icon}</div>
            <h3 className="font-serif text-2xl mb-4 text-foreground">{c.title}</h3>
            <p className="text-foreground/70 leading-relaxed text-[15px]">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);