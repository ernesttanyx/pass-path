import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "EN" | "BM";

type Dict = Record<string, { EN: string; BM: string }>;

export const t: Dict = {
  // Nav
  navMethod: { EN: "The 40% Method", BM: "Kaedah 40%" },
  navLogin: { EN: "Login", BM: "Log Masuk" },
  navWaitlist: { EN: "Join Waitlist", BM: "Sertai Senarai" },

  // Hero
  heroTitle1: { EN: "Stop Guessing.", BM: "Berhenti Meneka." },
  heroTitle2: { EN: "Start", BM: "Mula" },
  heroTitle3: { EN: "Passing", BM: "Lulus" },
  heroTitleEnd: { EN: ".", BM: "." },
  heroSub: {
    EN: "The only strategic roadmap built for the Malaysian SPM marking scheme. We don't teach you to be a genius; we teach you how to hit 40% using the chapters that actually matter.",
    BM: "Peta jalan strategik pertama yang dibina khas untuk skema pemarkahan SPM Malaysia. Kami tidak mengajar anda jadi genius; kami tunjuk cara capai 40% menggunakan bab yang benar-benar penting.",
  },
  heroCta1: { EN: "Get the High-Yield Chapter List", BM: "Dapatkan Senarai Bab Berpotensi Tinggi" },
  heroCta2: { EN: "Watch the 90s Strategy", BM: "Tonton Strategi 90 Saat" },
  heroEmail: { EN: "your@email.com", BM: "emel@anda.com" },
  heroSlip: { EN: "Slip in →", BM: "Masuk →" },

  // Problem
  problemTag: { EN: "The Problem", BM: "Masalahnya" },
  problemTitle1: { EN: "Why 50% of Students", BM: "Kenapa 50% Pelajar" },
  problemTitle2: { EN: "Fail Add Maths.", BM: "Gagal Matematik Tambahan." },
  problemC1Title: { EN: "The Marking Scheme Gap", BM: "Jurang Skema Pemarkahan" },
  problemC1Body: {
    EN: "Knowing the math isn't enough. If your \"Jalan Kerja\" (working steps) doesn't match the specific SPM Skema, you lose points. Generic AI doesn't know the Skema. Tactiq does.",
    BM: "Tahu matematik sahaja tidak cukup. Jika \"Jalan Kerja\" anda tidak sepadan dengan Skema SPM, markah hilang. AI biasa tidak tahu Skema. Tactiq tahu.",
  },
  problemC2Title: { EN: "The Cognitive Wall", BM: "Tembok Kognitif" },
  problemC2Body: {
    EN: "Traditional tuition dumps 400 pages of jargon on you. For a student at a 10% grade, that is noise. We filter the syllabus down to the \"Essential 40%.\"",
    BM: "Tuisyen biasa membebankan anda dengan 400 muka surat jargon. Untuk pelajar pada tahap 10%, itu hanya bising. Kami tapis sukatan kepada \"40% Penting.\"",
  },
  problemC3Title: { EN: "The Data Deficit", BM: "Kekurangan Data" },
  problemC3Body: {
    EN: "Students waste 80% of their time on low-yield chapters that barely appear in Paper 2. We use 10 years of trial data to tell you exactly where the marks are hidden.",
    BM: "Pelajar membazir 80% masa pada bab berpotensi rendah yang jarang muncul dalam Kertas 2. Kami guna data 10 tahun percubaan untuk tunjuk di mana markah tersembunyi.",
  },

  // Method
  methodTag: { EN: "The Method", BM: "Kaedahnya" },
  methodTitle: { EN: "Strategic Triage.", BM: "Triaj Strategik." },
  methodSub: {
    EN: "We help you ignore the 60% of the syllabus that causes failure, focusing your energy on the 40% that guarantees a pass.",
    BM: "Kami bantu anda abaikan 60% sukatan yang menyebabkan kegagalan, dan fokus pada 40% yang menjamin lulus.",
  },
  methodMap: { EN: "The High-Yield Map", BM: "Peta Berpotensi Tinggi" },
  methodSkema: { EN: "Skema-Awareness", BM: "Kesedaran Skema" },
  methodTriage: { EN: "Strategic Triage", BM: "Triaj Strategik" },
  methodSocratic: { EN: "Socratic Guidance", BM: "Panduan Sokratik" },
  methodRed: { EN: "Red Zone", BM: "Zon Merah" },
  methodRedNote: { EN: "Skip · 60%", BM: "Lepas · 60%" },
  methodTactiq: { EN: "Tactiq Zone", BM: "Zon Tactiq" },
  methodTactiqNote: { EN: "Focus · 40%", BM: "Fokus · 40%" },
  methodKLevel: { EN: "+2 K-Level", BM: "+2 Aras K" },
  methodDataSource: { EN: "Data source: MRSM Trials 2024", BM: "Sumber data: Percubaan MRSM 2024" },
  methodQ: {
    EN: "What is the first step for this Circular Measure question?",
    BM: "Apakah langkah pertama untuk soalan Sukatan Membulat ini?",
  },
  methodOptA: { EN: "A. Convert to radians", BM: "A. Tukar ke radian" },
  methodOptB: { EN: "B. Find the arc length", BM: "B. Cari panjang lengkok" },
  methodOptC: { EN: "C. Substitute θ directly", BM: "C. Gantikan θ terus" },

  // Skema demo
  skemaTitle1: { EN: "Not Just an Answer.", BM: "Bukan Sekadar Jawapan." },
  skemaTitle2: { EN: "The Right Working.", BM: "Jalan Kerja Yang Betul." },
  skemaGeneric: { EN: "Generic ChatGPT", BM: "ChatGPT Biasa" },
  skemaEngine: { EN: "Tactiq Skema-Engine", BM: "Enjin Skema Tactiq" },
  skemaG1: { EN: "To differentiate y = x³ − 2x²,", BM: "Untuk bezakan y = x³ − 2x²," },
  skemaG2: { EN: "we apply the power rule...", BM: "kita guna petua kuasa..." },
  skemaG3: { EN: "So when x = 2, the gradient is 4.", BM: "Jadi apabila x = 2, kecerunan ialah 4." },
  skemaG4: { EN: "(no working shown for Skema marks)", BM: "(tiada jalan kerja untuk markah Skema)" },
  skemaTipK1a: { EN: "Knowledge: differentiation rule applied", BM: "Pengetahuan: petua pembezaan digunakan" },
  skemaTipK1b: { EN: "Must show substitution of x = 2 here to secure this mark.", BM: "Mesti tunjukkan gantian x = 2 di sini untuk dapat markah." },
  skemaTipN1: { EN: "Numerical: final answer", BM: "Berangka: jawapan akhir" },

  // Analyzer
  analyzerTitle: { EN: "Data, Not Guesswork.", BM: "Data, Bukan Tekaan." },
  analyzerSub: {
    EN: "We analyzed 10 years of SPM and Trial papers (MRSM, SBP, Selangor) to rank chapters by their \"Mark-to-Effort\" ratio.",
    BM: "Kami analisis 10 tahun kertas SPM dan Percubaan (MRSM, SBP, Selangor) untuk susun bab mengikut nisbah \"Markah-kepada-Usaha\".",
  },
  anNote1: { EN: "Appeared in 9/10 Paper 2s.", BM: "Muncul dalam 9/10 Kertas 2." },
  anNote2: { EN: "High-yield Section C marks.", BM: "Markah Bahagian C berpotensi tinggi." },
  anNote3: { EN: "The easiest 10 marks in the paper.", BM: "10 markah termudah dalam kertas." },
  anNote4: { EN: "Consistent Paper 2 appearance.", BM: "Kemunculan konsisten dalam Kertas 2." },
  anNote5: { EN: "Frequent Section B anchor.", BM: "Sauh tetap Bahagian B." },
  anCh1: { EN: "Index Numbers", BM: "Nombor Indeks" },
  anCh2: { EN: "Solution of Triangles", BM: "Penyelesaian Segi Tiga" },
  anCh3: { EN: "Linear Law", BM: "Hukum Linear" },
  anCh4: { EN: "Coordinate Geometry", BM: "Geometri Koordinat" },
  anCh5: { EN: "Circular Measure", BM: "Sukatan Membulat" },
  anCircle: { EN: "of marks come from just 5 chapters", BM: "markah datang dari hanya 5 bab" },

  // Method chapters (reuse)
  chLinear: { EN: "Linear Law", BM: "Hukum Linear" },
  chIndex: { EN: "Index Numbers", BM: "Nombor Indeks" },
  chTriangles: { EN: "Solution of Triangles", BM: "Penyelesaian Segi Tiga" },
  chCoord: { EN: "Coordinate Geometry", BM: "Geometri Koordinat" },
  chCircular: { EN: "Circular Measure", BM: "Sukatan Membulat" },

  // Trust bar
  trustLabel: { EN: "Based on the Standards of", BM: "Berdasarkan Piawaian" },

  // Final CTA
  ctaTitle: { EN: "Join the 40% Revolution.", BM: "Sertai Revolusi 40%." },
  ctaSub: {
    EN: "Stop fighting the whole syllabus. Get our \"2026 High-Yield Chapter Report\" and start your path to a pass today. Only 500 spots available for the Beta.",
    BM: "Berhenti melawan seluruh sukatan. Dapatkan \"Laporan Bab Berpotensi Tinggi 2026\" dan mula perjalanan anda untuk lulus. Hanya 500 tempat untuk Beta.",
  },
  ctaButton: { EN: "Secure My Spot", BM: "Tempah Tempat Saya" },
  ctaDone: { EN: "Check your inbox. Your strategy has arrived.", BM: "Semak peti masuk anda. Strategi anda telah tiba." },
  ctaDisclaimer: {
    EN: "We don't spam. We just help you pass. No geniuses allowed.",
    BM: "Kami tidak spam. Kami bantu anda lulus. Genius tidak dibenarkan.",
  },
  ctaCopyright: { EN: "© 2026 Tactiq. Built for Malaysian students.", BM: "© 2026 Tactiq. Dibina untuk pelajar Malaysia." },
  ctaPrivacy: { EN: "Privacy", BM: "Privasi" },
  ctaTerms: { EN: "Terms", BM: "Terma" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; tr: (key: keyof typeof t) => string };

const LanguageContext = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("EN");
  const tr = (key: keyof typeof t) => t[key]?.[lang] ?? String(key);
  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>{children}</LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};