import { motion } from "framer-motion";
import { Check } from "lucide-react";

const chapters = [
  { name: "Linear Law", freq: 92 },
  { name: "Index Numbers", freq: 95 },
  { name: "Solution of Triangles", freq: 88 },
  { name: "Coordinate Geometry", freq: 78 },
  { name: "Circular Measure", freq: 72 },
];

const spring = { type: "spring" as const, stiffness: 120, damping: 14 };

export const Method = () => (
  <section id="method" className="relative py-28 px-6 bg-paper">
    <div className="max-w-6xl mx-auto">
      <div className="mb-16 max-w-2xl">
        <span className="inline-block text-xs uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-sage/25 text-foreground">
          The Method
        </span>
        <h2 className="mt-6 font-serif text-4xl md:text-6xl text-foreground leading-tight">
          Strategic Triage.
        </h2>
        <p className="mt-5 text-foreground/70 text-lg">
          We help you ignore the 60% of the syllabus that causes failure,
          focusing your energy on the 40% that guarantees a pass.
        </p>
      </div>

      <div className="grid md:grid-cols-3 md:grid-rows-2 gap-5">
        {/* Block 1: High-Yield Map (large) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={spring}
          className="md:col-span-2 md:row-span-1 bg-background rounded-[24px] p-8 border border-border/60 hover:shadow-[0_0_50px_-10px_hsl(var(--primary)/0.08)] transition-shadow group"
        >
          <p className="text-xs uppercase tracking-wider text-foreground/50 mb-6">The High-Yield Map</p>
          <div className="space-y-4">
            {chapters.map((c, i) => (
              <div key={c.name} className="group/row flex items-center gap-4">
                <span className="text-foreground/40 text-sm w-4">{i + 1}.</span>
                <span className="font-serif text-xl text-foreground w-52">{c.name}</span>
                <div className="flex-1 h-[3px] bg-grid rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.freq}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-primary"
                  />
                </div>
                <span className="text-sm text-foreground/60 w-10 text-right">{c.freq}%</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-foreground/40">Data source: MRSM Trials 2024</p>
        </motion.div>

        {/* Block 2: Skema-Awareness (small) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.1 }}
          className="bg-background rounded-[24px] p-8 border border-border/60"
        >
          <p className="text-xs uppercase tracking-wider text-foreground/50 mb-6">Skema-Awareness</p>
          <div className="font-serif text-lg space-y-3 text-foreground">
            <div>dy/dx = 3x² − 4x</div>
            <div className="flex items-center gap-2">
              <span>= 3(2)² − 4(2)</span>
              <span className="inline-flex items-center gap-1 text-xs bg-sage/30 text-foreground px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3" /> +2 K-Level
              </span>
            </div>
            <div>= 4</div>
          </div>
        </motion.div>

        {/* Block 3: Strategic Triage (small) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.15 }}
          className="bg-background rounded-[24px] p-8 border border-border/60"
        >
          <p className="text-xs uppercase tracking-wider text-foreground/50 mb-6">Strategic Triage</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-destructive/10">
              <span className="text-sm">Red Zone</span>
              <span className="text-xs text-foreground/60">Skip · 60%</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-sage/30">
              <span className="text-sm">Tactiq Zone</span>
              <span className="text-xs text-foreground/60">Focus · 40%</span>
            </div>
          </div>
        </motion.div>

        {/* Block 4: Socratic (large) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.2 }}
          className="md:col-span-2 bg-background rounded-[24px] p-8 border border-border/60"
        >
          <p className="text-xs uppercase tracking-wider text-foreground/50 mb-6">Socratic Guidance</p>
          <div className="inline-block max-w-md bg-paper px-5 py-3 rounded-2xl rounded-bl-sm font-serif text-lg text-foreground">
            What is the first step for this Circular Measure question?
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {["A. Convert to radians", "B. Find the arc length", "C. Substitute θ directly"].map((o) => (
              <button
                key={o}
                className="text-sm px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-sage/10 transition"
              >
                {o}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);