import { motion } from "framer-motion";

const WindowDots = () => (
  <div className="flex gap-1.5">
    <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
    <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
    <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
  </div>
);

export const SkemaDemo = () => (
  <section id="demo" className="relative py-28 px-6 bg-paper">
    <div className="max-w-6xl mx-auto">
      <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-tight max-w-3xl">
        Not Just an Answer. <br />
        <span className="italic text-foreground/70">The Right Working.</span>
      </h2>

      <div className="mt-16 grid md:grid-cols-2 gap-6">
        {/* Generic */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(6px)" }}
          whileInView={{ opacity: 0.55, filter: "blur(1px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl overflow-hidden border border-border bg-grid/60"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/70">
            <WindowDots />
            <span className="text-xs text-foreground/50">Generic ChatGPT</span>
            <span />
          </div>
          <div className="p-6 font-mono text-[13px] text-foreground/70 leading-relaxed space-y-2">
            <div>To differentiate y = x³ − 2x²,</div>
            <div>we apply the power rule...</div>
            <div>dy/dx = 3x² − 4x</div>
            <div>So when x = 2, the gradient is 4.</div>
            <div className="text-foreground/40">(no working shown for Skema marks)</div>
          </div>
        </motion.div>

        {/* Tactiq */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="rounded-2xl overflow-hidden border border-sage/60 bg-background shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.25)]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, hsl(var(--grid)/0.5) 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, hsl(var(--grid)/0.5) 0 1px, transparent 1px 20px)",
          }}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/70 bg-background/80">
            <WindowDots />
            <span className="text-xs text-foreground/70">Tactiq Skema-Engine</span>
            <span />
          </div>
          <div className="p-6 font-serif text-lg text-foreground space-y-3">
            <div className="flex items-center gap-3">
              <span>y = x³ − 2x²</span>
            </div>
            <div className="flex items-center gap-3">
              <span>dy/dx = 3x² − 4x</span>
              <SkemaTag label="K1" title="Knowledge: differentiation rule applied" />
            </div>
            <div className="flex items-center gap-3">
              <span>= 3(2)² − 4(2)</span>
              <SkemaTag label="K1" title="Must show substitution of x = 2 here to secure this mark." />
            </div>
            <div className="flex items-center gap-3">
              <span>= 4</span>
              <SkemaTag label="N1" title="Numerical: final answer" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const SkemaTag = ({ label, title }: { label: string; title: string }) => (
  <span
    title={title}
    className="group relative text-[11px] uppercase tracking-wider bg-sage/30 text-foreground px-2.5 py-1 rounded-full border border-sage/60 cursor-help"
  >
    {label}
  </span>
);