import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const FinalCTA = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="waitlist" className="relative py-28 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto rounded-[32px] border border-dashed border-foreground/40 bg-sage/10 p-10 md:p-16 text-center"
      >
        <h2 className="font-serif text-4xl md:text-6xl text-foreground leading-tight">
          Join the 40% Revolution.
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-foreground/70">
          Stop fighting the whole syllabus. Get our "2026 High-Yield Chapter Report" and
          start your path to a pass today. Only 500 spots available for the Beta.
        </p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -10 }}
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="mt-10 max-w-lg mx-auto flex flex-col sm:flex-row items-stretch gap-4"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 bg-transparent border-b border-foreground/50 px-1 py-3 outline-none text-foreground placeholder:text-foreground/40 text-center sm:text-left"
              />
              <button
                type="submit"
                className="px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-medium animate-ripple"
              >
                Secure My Spot
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <svg viewBox="0 0 80 80" className="w-16 h-16 text-primary draw-on-view" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 42 L34 58 L64 24" />
              </svg>
              <p className="font-serif text-2xl text-foreground">
                Check your inbox. Your strategy has arrived.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-8 text-xs text-foreground/50">
          We don't spam. We just help you pass. No geniuses allowed.
        </p>
      </motion.div>

      <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between text-xs text-foreground/50 gap-3">
        <span className="font-serif text-lg text-foreground/80">Tactiq</span>
        <span>© 2026 Tactiq. Built for Malaysian students.</span>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground transition">Privacy</a>
          <a href="#" className="hover:text-foreground transition">Terms</a>
        </div>
      </footer>
    </section>
  );
};