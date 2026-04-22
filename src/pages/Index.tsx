import { Nav } from "@/components/tactiq/Nav";
import { Hero } from "@/components/tactiq/Hero";
import { Problem } from "@/components/tactiq/Problem";
import { Method } from "@/components/tactiq/Method";
import { SkemaDemo } from "@/components/tactiq/SkemaDemo";
import { Analyzer } from "@/components/tactiq/Analyzer";
import { TrustBar } from "@/components/tactiq/TrustBar";
import { FinalCTA } from "@/components/tactiq/FinalCTA";

const Index = () => (
  <main className="min-h-screen bg-background text-foreground">
    <Nav />
    <Hero />
    <Problem />
    <Method />
    <SkemaDemo />
    <Analyzer />
    <TrustBar />
    <FinalCTA />
  </main>
);

export default Index;
