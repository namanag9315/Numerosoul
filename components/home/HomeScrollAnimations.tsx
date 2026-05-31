"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HomeScrollAnimations() {
  const sacredCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip on reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const ctx = gsap.context(() => {
      // ═══════════════════════════════════════
      // 1. HERO SACRED GEOMETRY CANVAS
      // ═══════════════════════════════════════
      // This is handled by requestAnimationFrame on the canvas ref (see below)

      // ═══════════════════════════════════════
      // 2. CHAPTER CARD — Parallax number drift  
      // ═══════════════════════════════════════
      // Target: The large "9" watermark inside ChapterCard
      // Selector: section that contains text 'Chapter I' - use the section with bg-[#0D0820]
      // Find the element with class 'font-numeral' inside it
      const chapterSection = document.querySelector('section[style*="#0D0820"]');
      if (chapterSection) {
        const chapterNumber = chapterSection.querySelector('.font-numeral');
        if (chapterNumber) {
          gsap.to(chapterNumber, {
            y: -80,
            x: 30,
            scrollTrigger: {
              trigger: chapterSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
      }

      // ═══════════════════════════════════════
      // 3. ABOUT SECTION — Yantra rotation on scroll
      // ═══════════════════════════════════════
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        // Target the SVG polygons (triangles) in the Shatkona frame
        const polygons = aboutSection.querySelectorAll('polygon');
        if (polygons.length >= 2) {
          // Don't override Framer Motion's rotation, add a scroll-based scale pulse
          gsap.fromTo(aboutSection.querySelector('.relative.h-64, .relative.h-72')?.parentElement || aboutSection, {
            scale: 0.92,
          }, {
            scale: 1,
            scrollTrigger: {
              trigger: aboutSection,
              start: "top 80%",
              end: "center center",
              scrub: 1,
            },
          });
        }
      }

      // ═══════════════════════════════════════
      // 4. SERVICES — Card stagger rise  
      // ═══════════════════════════════════════
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        const cards = servicesSection.querySelectorAll('article');
        if (cards.length > 0) {
          gsap.fromTo(cards, {
            y: 60,
            opacity: 0,
          }, {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
              trigger: servicesSection,
              start: "top 75%",
              end: "center 60%",
              scrub: 1,
            },
          });
        }
      }

      // ═══════════════════════════════════════
      // 5. TESTIMONIALS — Float and subtle parallax
      // ═══════════════════════════════════════
      // Find the testimonials section (contains "Voices of Transformation")
      const allSections = document.querySelectorAll('section');
      let testimonialsSection: Element | null = null;
      allSections.forEach(s => {
        if (s.textContent?.includes('Voices of Transformation')) {
          testimonialsSection = s;
        }
      });
      if (testimonialsSection) {
        const cards = (testimonialsSection as Element).querySelectorAll('article');
        cards.forEach((card, i) => {
          gsap.fromTo(card, {
            y: 40 + (i * 10),
          }, {
            y: -(10 + i * 5),
            scrollTrigger: {
              trigger: testimonialsSection,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 2,
            },
          });
        });
      }

      // ═══════════════════════════════════════
      // 6. DOMAIN GRID — Card stagger with rotation
      // ═══════════════════════════════════════
      const guideSection = document.getElementById('guide');
      if (guideSection) {
        const domainCards = guideSection.querySelectorAll('article');
        gsap.fromTo(domainCards, {
          y: 50,
          rotateY: 8,
          opacity: 0,
        }, {
          y: 0,
          rotateY: 0,
          opacity: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: guideSection,
            start: "top 75%",
            end: "center 60%",
            scrub: 1,
          },
        });
      }

      // ═══════════════════════════════════════
      // 7. ALL HEADINGS — Subtle fade-up entrance
      // ═══════════════════════════════════════
      const headings = document.querySelectorAll('h2');
      headings.forEach(h => {
        gsap.fromTo(h, {
          y: 20,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: h,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // ═══════════════════════════════════════
      // 8. BOOKING BANNER — Parallax background yantra
      // ═══════════════════════════════════════
      const bookingYantra = document.querySelector('.animate-mandala-spin');
      if (bookingYantra) {
        gsap.to(bookingYantra, {
          rotation: 180,
          scale: 1.15,
          scrollTrigger: {
            trigger: bookingYantra.closest('section'),
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // ═══════════════════════════════════════
  // Sacred Geometry Canvas (Hero background)
  // ═══════════════════════════════════════
  useEffect(() => {
    const canvas = sacredCanvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    let animId: number;
    let angle = 0;

    const centerX = width * 0.6;
    const centerY = height * 0.5;
    const radii = [140, 220, 300];
    const speeds = [0.0003, -0.0002, 0.00015];
    const dotCount = 9;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const draw = () => {
      ctx2d.clearRect(0, 0, width, height);
      angle++;

      radii.forEach((r, ringIndex) => {
        const rotation = angle * speeds[ringIndex];

        // Draw circle
        ctx2d.beginPath();
        ctx2d.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx2d.strokeStyle = 'rgba(201, 151, 58, 0.12)';
        ctx2d.lineWidth = 1;
        ctx2d.stroke();

        // Draw orbiting dots
        for (let d = 0; d < dotCount; d++) {
          const dotAngle = rotation + (d * (Math.PI * 2) / dotCount);
          const dx = centerX + Math.cos(dotAngle) * r;
          const dy = centerY + Math.sin(dotAngle) * r;

          ctx2d.beginPath();
          ctx2d.arc(dx, dy, 3, 0, Math.PI * 2);
          ctx2d.fillStyle = 'rgba(201, 151, 58, 0.4)';
          ctx2d.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Sacred Geometry Canvas - positioned in the hero section */}
      <canvas
        ref={sacredCanvasRef}
        className="fixed top-0 left-0 w-full h-screen pointer-events-none z-[1] opacity-60"
        aria-hidden="true"
      />
    </>
  );
}
