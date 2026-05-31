"use client";

import { useEffect, useState, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform, Variants, useInView, MotionValue, useMotionValue, useSpring } from "framer-motion";
import { Orbit, Baby, Building2, Star, Quote } from "lucide-react";

// Local imports
import { IntroSequence } from "@/components/home/IntroSequence";
import { ScrollProgress } from "@/components/home/ScrollProgress";
import { HomeScrollAnimations } from "@/components/home/HomeScrollAnimations";
import { CustomCursor } from "@/components/home/CustomCursor";
import { NumberWheel } from "@/components/effects/NumberWheel";
import { ChapterCard } from "@/components/home/ChapterCard";
import { AboutUma } from "@/components/home/AboutUma";
import { PythagoreanMatrix } from "@/components/home/PythagoreanMatrix";
import { ServicesSection } from "@/components/home/ServicesSection";
import { FreeToolsSection } from "@/components/home/FreeToolsSection";
import { Constellation } from "@/components/effects/Constellation";
import { StarField } from "@/components/effects/StarField";
import { SectionDivider } from "@/components/effects/SectionDivider";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { CosmicGeometry3D } from "@/components/effects/CosmicGeometry3D";
import { getWhatsAppLink } from "@/lib/whatsapp";

// Data types
const stats = [
  { number: 500, suffix: "+", label: "Clients Guided" },
  { number: 8, suffix: "+", label: "Years Experience" },
  { number: 4.9, suffix: "★", label: "Rating" },
  { number: 100, suffix: "%", label: "Personalised" },
];

const testimonials = [
  { quote: "My baby's name correction changed our entire family's energy. She thrives in every way.", client: "Priya M., Badaun", service: "Baby Name Numerology" },
  { quote: "Changed my car number on her advice. Got promoted within 2 months. She's the real deal.", client: "Rahul K., Indore", service: "Vehicle Number" },
  { quote: "My business was struggling. After the name correction and launch date analysis, sales doubled in 6 months.", client: "Sunita V., Mumbai", service: "Business Numerology" },
  { quote: "The lo shu grid reading was eerily accurate. She identified my missing numbers without me telling her anything.", client: "Arjun T., Delhi", service: "Lo Shu Grid" },
  { quote: "Found the perfect phone number that aligns with my life path. Small change, massive difference.", client: "Meera P., Pune", service: "Phone Number" },
  { quote: "The personal reading was like looking in a mirror. I finally understand why I make the choices I do.", client: "Riya S., Jaipur", service: "Personal Reading" },
];

const domains = [
  { title: "Life Path Numbers", description: "Your birth-date blueprint for purpose, timing, and inner direction.", icon: Orbit },
  { title: "Destiny Numbers", description: "The name vibration that shapes expression, opportunity, and influence.", icon: Orbit },
  { title: "Soul Urge", description: "A quiet reading of desire, emotional motivation, and heart-level needs.", icon: Orbit },
  { title: "Lo Shu Grid", description: "A 3x3 map of strengths, missing numbers, and personality patterns.", icon: Orbit },
  { title: "Master Numbers", description: "Elevated 11, 22, and 33 frequencies with greater sensitivity and duty.", icon: Orbit },
  { title: "Karmic Debt", description: "Lessons carried through 13, 14, 16, and 19 for conscious realignment.", icon: Orbit },
];

const blogPosts = [
  { category: "Life Path", title: "What Your Life Path Number Reveals About Your Next Chapter", excerpt: "A gentle guide to reading your personal year rhythm and planning with more ease.", date: "May 18, 2026", icon: Orbit },
  { category: "Baby Names", title: "Choosing a Baby Name With Numerology and Family Harmony", excerpt: "How name vibration, initials, and birth-date energy work together in a reading.", date: "May 10, 2026", icon: Baby },
  { category: "Business", title: "Launch Dates, Brand Names, and the Numbers Behind Momentum", excerpt: "A practical numerology lens for founders choosing names, colors, and timing.", date: "April 29, 2026", icon: Building2 },
];

const domainConstellationPoints = [
  { x: 18, y: 18 }, { x: 50, y: 16 }, { x: 82, y: 20 },
  { x: 18, y: 50 }, { x: 50, y: 48 }, { x: 82, y: 51 },
  { x: 18, y: 82 }, { x: 50, y: 78 }, { x: 82, y: 82 },
];
const domainConstellationConnections: Array<[number, number]> = [
  [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [0, 3], [1, 4], [4, 7], [2, 5], [0, 4], [4, 8], [2, 4], [4, 6],
];

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [introActive, setIntroActive] = useState(true);

  const { scrollY, scrollYProgress } = useScroll();
  const floatY = useTransform(scrollY, [0, 2000], [0, -120]);
  const scrollFigureY = useTransform(scrollYProgress, [0, 1], ["0vh", "-18vh"]);
  const scrollFigureRotate = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const scrollFigureScale = useTransform(scrollYProgress, [0, 0.42, 1], [1, 0.86, 1.12]);
  const scrollFigureOpacity = useTransform(scrollYProgress, [0, 0.18, 0.78, 1], [0.82, 0.46, 0.34, 0.12]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 1. Introductory Cinematic Sequence */}
      <AnimatePresence mode="wait">
        {introActive && (
          <IntroSequence key="intro" onComplete={() => setIntroActive(false)} />
        )}
      </AnimatePresence>

      {/* 2. Global Fixed Controls */}
      {!introActive && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-screen text-slate-800 bg-[#FFFDF9] selection:bg-[#E8A020]/20 selection:text-[#E8A020]"
          style={{
            background: "linear-gradient(to bottom, #FFFDF9 0%, #FAF6EE 35%, #F5EFE2 70%, #FFFDF9 100%)",
            scrollBehavior: "smooth"
          }}
        >
          <CosmicGradientBackdrop />
          <ScrollKineticFigure
            y={scrollFigureY}
            rotate={scrollFigureRotate}
            scale={scrollFigureScale}
            opacity={scrollFigureOpacity}
          />
          <CustomCursor />
          <ScrollProgress />
          <HomeScrollAnimations />

          {/* 3. Main Sections */}
          <div className="relative z-10">
            <HeroSection />
            <ChapterCard />
            <AboutUma />
            <PythagoreanMatrix />
            <ServicesSection />
            <FreeToolsSection />
            <TestimonialsSection floatY={floatY} />
            <DomainGrid />
            <BookingBanner />
            <BlogPreview />
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════
   HERO SECTION — Rebuilt for Light Theme
   ═══════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-24 pt-32 sm:px-10 lg:px-16 hero-gradient-stage"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, #FFF8EE 0%, #FAF3E0 48%, #F5EFE2 100%)"
      }}
    >
      <GradientRibbonField />

      {/* Mouse repulsion particle canvas */}
      <ParticleCanvas />

      {/* Stars layer */}
      <StarField starCount={40} color="gold" className="opacity-[0.3] z-0" />

      {/* Hero Content layout */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] w-full">
        
        {/* Left Column: Heading and Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center lg:text-left flex flex-col justify-center"
        >
          <motion.p variants={fadeUp} className="eyebrow text-[#D4700A]">
            ✦ Ancient Wisdom · Modern Clarity ✦
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display leading-[1.05]"
            style={{ fontSize: "clamp(2.8rem, 5.5vw + 0.5rem, 4.8rem)", fontWeight: 750 }}
          >
            <span className="text-slate-900">Decode Your</span> <br />
            <span className="italic text-[#E8A020]">
              Soul Vibrations
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-slate-600 text-base sm:text-lg leading-relaxed mx-auto lg:mx-0"
          >
            Discover the divine pattern mapped inside your birth date and name corrections. Personalised numerology readings by certified guide Uma Rastogi.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <a 
              href="/book" 
              className="btn-primary min-w-[200px]"
              style={{
                background: "linear-gradient(135deg, #1E0A3C, #0D0820)",
                boxShadow: "0 10px 25px rgba(30, 10, 60, 0.18)"
              }}
            >
              Book Consultation
            </a>
            <a 
              href="#tools" 
              className="btn-secondary min-w-[200px] border-[#E8A020] text-[#D4700A] hover:bg-[#E8A020]/10"
            >
              Explore Free Tools ↓
            </a>
          </motion.div>

          {/* Author Credit Line */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center justify-center lg:justify-start gap-3"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold text-[#E8A020] select-none"
              style={{
                border: "2px solid #E8A020",
                boxShadow: "0 0 0 3px rgba(232, 160, 32, 0.12)",
                background: "linear-gradient(135deg, #1E0A3C, #0D0820)",
              }}
            >
              UR
            </div>
            <p className="font-body text-[13px] text-slate-600 text-left">
              Guided by <strong className="text-slate-800">Uma Rastogi</strong> · Certified Numerologist · Badaun, Uttar Pradesh, India
            </p>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            variants={fadeUp}
            className="mt-14 grid grid-cols-2 overflow-hidden rounded-2xl md:grid-cols-4 border border-[#E8A020]/15 depth-card gradient-border-card"
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 15px 35px rgba(232, 160, 32, 0.05)"
            }}
          >
            {stats.map((stat, i) => (
              <StatCell key={i} stat={stat} index={i} total={stats.length} />
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Visual Centerpiece NumberWheel */}
        <div className="flex items-center justify-center relative w-full h-full min-h-[380px] lg:min-h-none">
          <HeroNumberStage />
        </div>

      </div>

      {/* Infinite scrolling ticker at the bottom of hero */}
      <div className="absolute bottom-0 inset-x-0 bg-[#FAF6EE]/90 border-y border-[#E8A020]/10 py-3 overflow-hidden whitespace-nowrap z-10 select-none">
        <div className="inline-block animate-[marquee_35s_linear_infinite] text-[11px] font-display font-semibold tracking-[4px] uppercase text-[#D4700A]">
          ✦ 1 SUN ☉ ✦ 2 MOON ☽ ✦ 3 JUPITER ♃ ✦ 4 RAHU ☊ ✦ 5 MERCURY ☿ ✦ 6 VENUS ♀ ✦ 7 KETU ☋ ✦ 8 SATURN ♄ ✦ 9 MARS ♂ ✦ 1 SUN ☉ ✦ 2 MOON ☽ ✦ 3 JUPITER ♃ ✦ 4 RAHU ☊ ✦ 5 MERCURY ☿ ✦ 6 VENUS ♀ ✦ 7 KETU ☋ ✦ 8 SATURN ♄ ✦ 9 MARS ♂ ✦
        </div>
      </div>

      {/* CSS keyframe for marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function CosmicGradientBackdrop() {
  return (
    <div className="cosmic-gradient-backdrop fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div className="cosmic-gradient-grid" />
    </div>
  );
}

function ScrollKineticFigure({
  y,
  rotate,
  scale,
  opacity,
}: {
  y: MotionValue<string>;
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      className="scroll-kinetic-figure fixed right-[-150px] top-[14vh] z-[1] hidden h-[560px] w-[560px] pointer-events-none lg:block"
      aria-hidden="true"
      style={{ y, rotateZ: rotate, scale, opacity }}
    >
      <SacredGeometryFigure />
    </motion.div>
  );
}

function SacredGeometryFigure() {
  return (
    <CosmicGeometry3D className="w-full h-full" color="#E8A020" />
  );
}

function GradientRibbonField() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="hero-perspective-lines" />
    </div>
  );
}

function HeroNumberStage() {
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 120, damping: 18, mass: 0.35 });
  const rotateY = useSpring(rotateYValue, { stiffness: 120, damping: 18, mass: 0.35 });

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rotateXValue.set(y * -14);
    rotateYValue.set(x * 18);
  };

  const handleMouseLeave = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
  };

  return (
    <motion.div
      className="hero-3d-stage relative flex min-h-[380px] w-full items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
    >
      <motion.div
        className="hero-stage-inner relative flex h-[360px] w-[360px] items-center justify-center md:h-[560px] md:w-[560px]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="hero-depth-ring hero-depth-ring-a" />
        <div className="hero-depth-ring hero-depth-ring-b" />
        <div className="hero-depth-ring hero-depth-ring-c" />
        <div className="hero-number-shadow" />
        <div className="hero-sacred-figure" aria-hidden="true">
          <SacredGeometryFigure />
        </div>
        <motion.div
          className="relative z-20"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div style={{ transform: "translateZ(72px)", transformStyle: "preserve-3d" }}>
            <NumberWheel />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* Stats counting up cell */
function StatCell({ stat, index, total }: { stat: typeof stats[0]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const value = useCountUp(isInView ? stat.number : 0, 1500);

  return (
    <div
      ref={ref}
      className={`px-4 py-5 text-center ${
        index !== total - 1 ? "border-r border-[#E8A020]/10" : ""
      } ${index < 2 ? "border-b border-[#E8A020]/10 md:border-b-0" : ""}`}
    >
      <p className="font-numeral text-3xl font-bold leading-none text-[#D4700A] drop-shadow-[0_0_12px_rgba(232,160,32,0.1)]">
        {value}{stat.suffix}
      </p>
      <p className="mt-2 text-[10px] text-slate-500 tracking-wider uppercase font-semibold">{stat.label}</p>
    </div>
  );
}

/* ── Custom HTML5 Canvas Particle Connection & Mouse Repulsion Field ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const particleCount = isMobile ? 0 : 12;
    if (particleCount === 0) return;

    const maxDistance = 95;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    };

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2 + 0.8,
      });
    }

    const mouse = { x: -2000, y: -2000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -2000;
      mouse.y = -2000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw lines & nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (!isMobile) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const force = (110 - dist) / 110;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 1.5;
            p.y += Math.sin(angle) * force * 1.5;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212, 112, 10, 0.45)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(232, 160, 32, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      canvas?.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

/* ═══════════════════════════════════════════════
   TESTIMONIALS — Rebuilt for Light Theme
   ═══════════════════════════════════════════════ */
function TestimonialsSection({ floatY }: { floatY: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      setActive((c) => (c + 1) % testimonials.length);
    }, 4550);
    return () => window.clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const carousel = carouselRef.current;
    const target = carousel?.children[active] as HTMLElement | undefined;
    if (!carousel || !target) return;
    carousel.scrollTo({ left: target.offsetLeft - carousel.offsetLeft, behavior: "smooth" });
  }, [active]);

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 bg-transparent">
      {/* Blurred glow circle */}
      <div 
        className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgba(232, 160, 32, 0.04) 0%, transparent 70%)", filter: "blur(50px)" }}
      />

      <motion.div style={{ y: floatY }} className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="text-center">
          <p className="eyebrow text-[#D4700A]">✦ Voices of Transformation ✦</p>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold leading-tight text-slate-900">
            Real Stories, Real <span className="italic text-[#E8A020]">Realignment</span>
          </h2>
          <SectionDivider className="mx-auto mt-6" variant="gold" />
        </div>

        <div
          className="mt-16"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={carouselRef}
            className="flex snap-x gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t, index) => (
              <motion.article
                key={t.client}
                className="min-w-[88%] sm:min-w-[48%] lg:min-w-[32%] snap-start p-8 rounded-2xl border transition-all duration-300 flex flex-col justify-between depth-card gradient-border-card"
                whileHover={{ y: -10, rotateX: 3, rotateY: index % 2 === 0 ? -3 : 3 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderColor: "rgba(232, 160, 32, 0.16)",
                  boxShadow: "0 10px 30px rgba(232, 160, 32, 0.03)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div>
                  <div className="flex gap-1 text-[#E8A020] mb-5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-4.5 w-4.5 fill-[#E8A020] text-none" strokeWidth={0} />
                    ))}
                  </div>
                  
                  <Quote className="h-6 w-6 text-[#E8A020]/20 mb-3" />
                  <blockquote className="font-display text-lg italic leading-relaxed text-slate-700">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/40 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500 font-semibold">{t.client}</p>
                  <span 
                    className="w-fit rounded-full px-3 py-1 text-[10px] font-semibold tracking-wider uppercase"
                    style={{ 
                      backgroundColor: "rgba(232, 160, 32, 0.06)", 
                      color: "#D4700A",
                      border: "1px solid rgba(232, 160, 32, 0.15)"
                    }}
                  >
                    {t.service}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   DOMAIN GRID — Rebuilt for Light Theme
   ═══════════════════════════════════════════════ */
function DomainGrid() {
  return (
    <section
      id="guide"
      className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 bg-[#FAF7F0]"
    >
      <Constellation
        className="left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 text-[#E8A020] opacity-[0.16]"
        points={domainConstellationPoints}
        connections={domainConstellationConnections}
        viewBox="0 0 100 100"
      />

      <div className="pointer-events-none absolute left-1/2 top-16 h-[220px] w-[450px] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse, rgba(232, 160, 32, 0.04) 0%, transparent 70%)", filter: "blur(30px)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-[#D4700A]">✦ The Foundation ✦</p>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold leading-tight text-slate-900">
            The Science of <span className="italic text-[#E8A020]">Sacred Numbers</span>
          </h2>
          <p className="mt-5 text-slate-600 text-base leading-relaxed">
            Numerology studies recurring patterns across names, dates, grids, and cycles so your choices can feel more aligned.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {domains.map((domain) => (
            <motion.article
              key={domain.title}
              variants={fadeUp}
              whileHover={{ 
                y: -6, 
                rotateX: 3,
                rotateY: -3,
                borderColor: "rgba(232, 160, 32, 0.35)",
                backgroundColor: "rgba(255, 255, 255, 0.95)"
              }}
              className="p-7 rounded-2xl border transition-all duration-300 depth-card gradient-border-card"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                borderColor: "rgba(232, 160, 32, 0.14)",
                boxShadow: "0 10px 30px rgba(232, 160, 32, 0.02)",
                transformStyle: "preserve-3d",
              }}
            >
              <Orbit className="h-6 w-6 text-[#D4700A]" strokeWidth={1.8} />
              <h3 className="mt-5 font-display text-xl font-bold text-slate-800">{domain.title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">{domain.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   BOOKING BANNER — Rebuilt for Light Theme
   ═══════════════════════════════════════════════ */
function BookingBanner() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 bg-[#F5EFE2]">
      {/* Background Yantra Geometry Rotating */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.1] z-0 animate-mandala-spin" style={{ animationDuration: "120s" }}>
        <svg width="600" height="600" viewBox="0 0 200 200" fill="none" stroke="#E8A020" strokeWidth="0.8">
          <circle cx="100" cy="100" r="90" />
          <polygon points="100,10 178,145 22,145" />
          <polygon points="100,190 178,55 22,55" />
          <circle cx="100" cy="100" r="40" />
        </svg>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgba(232,160,32,0.06) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="eyebrow text-[#D4700A]">✦ Begin Your Journey ✦</p>
        <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold leading-tight text-slate-900">
          Ready to Decode Your <span className="italic text-[#E8A020]">Numbers?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
          Book a personalised session and begin your journey of self-discovery through the ancient wisdom of numerology.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a 
            href="/book" 
            className="btn-primary min-w-[220px]"
            style={{
              background: "linear-gradient(135deg, #1E0A3C, #0D0820)",
              boxShadow: "0 10px 25px rgba(30, 10, 60, 0.18)"
            }}
          >
            Book My Session
          </a>
          <a
            href={getWhatsAppLink()}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,211,102,0.18)] hover:scale-[1.03] transition duration-300 min-w-[220px]"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 text-xs text-slate-500 md:flex-row md:gap-7 select-none">
          <span>✓ Instant WhatsApp confirmation</span>
          <span>✓ PDF report included</span>
          <span>✓ 100% satisfaction or free follow-up</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   BLOG PREVIEW — Rebuilt for Light Theme
   ═══════════════════════════════════════════════ */
function BlogPreview() {
  return (
    <section id="blog" className="px-6 py-24 sm:px-10 lg:px-16 bg-transparent">
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-[#D4700A]">✦ Insights ✦</p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold leading-tight text-slate-900">
              Latest Numerology <span className="italic text-[#E8A020]">Insights</span>
            </h2>
          </div>
          <a
            href="/blog"
            className="text-xs font-semibold text-[#D4700A] uppercase tracking-wider hover:underline transition"
          >
            View All Articles →
          </a>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-6 lg:grid-cols-3"
        >
          {blogPosts.map((post) => {
            const PostIcon = post.icon;
            return (
              <motion.article
                key={post.title}
                variants={scaleIn}
                whileHover={{ 
                  y: -8, 
                  rotateX: 3,
                  rotateY: 3,
                  borderColor: "rgba(232, 160, 32, 0.35)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)"
                }}
                className="card-premium overflow-hidden border transition-all duration-300 flex flex-col justify-between depth-card gradient-border-card"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderColor: "rgba(232, 160, 32, 0.14)",
                  boxShadow: "0 10px 30px rgba(232, 160, 32, 0.02)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div>
                  <div
                    className="flex h-44 items-center justify-center text-[#E8A020]"
                    style={{
                      background: "linear-gradient(135deg, rgba(232,160,32,0.06), rgba(109,40,217,0.03))",
                    }}
                  >
                    <PostIcon className="h-10 w-10 text-[#D4700A]" strokeWidth={1.5} />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-[#D4700A] uppercase tracking-wider border border-[#E8A020]/20"
                        style={{ background: "rgba(232,160,32,0.04)" }}
                      >
                        {post.category}
                      </span>
                      <time className="text-[10px] text-slate-500 font-semibold">{post.date}</time>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold leading-snug text-slate-800">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <a
                    href="/blog"
                    className="text-xs font-semibold text-[#D4700A] tracking-wider uppercase hover:underline"
                  >
                    Read More →
                  </a>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
