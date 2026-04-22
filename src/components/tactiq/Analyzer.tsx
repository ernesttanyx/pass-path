import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";

const data = [
  { nameKey: "anCh1", pct: 95, noteKey: "anNote1" },
  { nameKey: "anCh2", pct: 88, noteKey: "anNote2" },
  { nameKey: "anCh3", pct: 85, noteKey: "anNote3" },
  { nameKey: "anCh4", pct: 78, noteKey: "anNote4" },
  { nameKey: "anCh5", pct: 72, noteKey: "anNote5" },
] as const;

const Counter = ({ to }: { to: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const mv = { n: 0 };
    const controls = animate(0, to, {
      duration: 1.5,
      onUpdate: (n) => setV(Math.round(n)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}%</span>;
};

export const Analyzer = () => {
  const { tr } = useLang();
  return (
  <section className="relative py-28 px-6">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-tight">
          {tr("analyzerTitle")}
        </h2>
        <p className="mt-5 text-foreground/70 max-w-2xl mx-auto">
          {tr("analyzerSub")}
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-16 items-center">
        <div className="space-y-7">
          {data.map((d, i) => (
            <motion.div
              key={d.nameKey}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-serif text-xl md:text-2xl text-foreground">{tr(d.nameKey)}</span>
                <span className="font-serif text-xl text-foreground/80 tabular-nums">
                  <Counter to={d.pct} />
                </span>
              </div>
              <div className="h-[4px] bg-grid rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: i * 0.1, type: "spring", bounce: 0.3 }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-xs text-foreground/50">{tr(d.noteKey)}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="mx-auto w-56 h-56 md:w-64 md:h-64 rounded-full border border-sage/60 bg-sage/10 flex flex-col items-center justify-center text-center p-6"
        >
          <span className="font-serif text-5xl text-foreground">42%</span>
          <span className="mt-2 text-xs uppercase tracking-wider text-foreground/60 leading-relaxed">
            {tr("anCircle")}
          </span>
        </motion.div>
      </div>
    </div>
  </section>
  );
};