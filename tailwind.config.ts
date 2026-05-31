import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)",
        "cream-deep": "var(--cream-deep)",
        parchment: "var(--parchment)",
        gold: "var(--gold)",
        navy: "var(--navy)",
        violet: "var(--violet)",
        rose: "var(--rose)",
        teal: "var(--teal)",
        border: "var(--border)",
        
        // New Modern Ethereal Palette
        "saffron-gold": "var(--saffron-gold)", // keeping alias for component compatibility, but mapping to new orange
        "temple-rose": "var(--temple-rose)",
        "sacred-indigo": "var(--sacred-indigo)", // mapped to deep purple
        "ivory-parchment": "var(--ivory-parchment)",
        "forest-emerald": "var(--forest-emerald)",
        "celestial-cream": "var(--celestial-cream)", // mapped to pearl
        "molten-amber": "var(--molten-amber)",
        
        "cosmic-purple": "var(--cosmic-purple)",
        "sunrise-orange": "var(--sunrise-orange)",
        "celestial-teal": "var(--celestial-teal)",
        "ethereal-pearl": "var(--ethereal-pearl)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        numeral: ["var(--font-numeral)", "serif"],
      },
      fontSize: {
        "display-xl": ["5rem", { lineHeight: "1.05", fontWeight: "700" }],
        "display-lg": ["4rem", { lineHeight: "1.05", fontWeight: "700" }],
        "display-md": ["3rem", { lineHeight: "1.1", fontWeight: "700" }],
        "number-hero": ["10rem", { lineHeight: "1", fontWeight: "600" }],
      },
      borderRadius: {
        card: "24px",
      },
      animation: {
        "mandala-spin": "mandala-spin 20s linear infinite",
        "gentle-float": "gentle-float 3s ease-in-out infinite",
        "shimmer-sweep": "shimmer-sweep 2s ease-in-out infinite",
        "tarot-flip": "tarot-flip 600ms ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "breathe-ring": "breathe-ring 2s ease-in-out infinite",
        "count-glow": "count-glow 1.5s ease-in-out infinite",
        "sonar-expand": "sonar-expand 3s ease-out infinite",
        "wheel-spin": "wheel-spin 60s linear infinite",
      },
      keyframes: {
        "mandala-spin": { to: { transform: "rotate(360deg)" } },
        "wheel-spin": { to: { transform: "rotate(360deg)" } },
        "gentle-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "shimmer-sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "tarot-flip": {
          "0%": { transform: "perspective(800px) rotateY(90deg)", opacity: "0" },
          "100%": { transform: "perspective(800px) rotateY(0deg)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124,58,237,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(124,58,237,0.35)" },
        },
        "breathe-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.15)", opacity: "0.3" },
        },
        "count-glow": {
          "0%, 100%": { textShadow: "0 0 20px rgba(249,115,22,0.3)" },
          "50%": { textShadow: "0 0 40px rgba(249,115,22,0.6), 0 0 80px rgba(249,115,22,0.2)" },
        },
        "sonar-expand": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
