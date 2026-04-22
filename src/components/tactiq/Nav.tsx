import { motion } from "framer-motion";

export const Nav = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60"
  >
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="#" className="font-serif text-2xl text-foreground">Tactiq</a>
      <div className="hidden md:flex items-center gap-8 text-sm">
        <a href="#method" className="text-foreground/80 hover:text-foreground transition">The 40% Method</a>
        <a href="#login" className="text-foreground/80 hover:text-foreground transition">Login</a>
        <a
          href="#waitlist"
          className="px-4 py-2 rounded-full border border-sage text-foreground hover:bg-sage/20 transition"
        >
          Join Waitlist
        </a>
      </div>
    </div>
  </motion.nav>
);