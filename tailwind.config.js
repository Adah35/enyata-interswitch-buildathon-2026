/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Map Tailwind classes to CSS variables
        background:   "var(--color-background)",
        surface:      "var(--color-surface)",
        "surface-2":  "var(--color-surface-2)",
        border:       "var(--color-border)",
        "text-primary":   "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted":     "var(--color-text-muted)",
        accent:       "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "accent-fg":  "var(--color-accent-fg)",
        danger:       "var(--color-danger)",
        "danger-hover": "var(--color-danger-hover)",
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      boxShadow: {
        card:  "0 1px 3px rgba(0,0,0,.07), 0 4px 14px rgba(0,0,0,.05)",
        "card-dark": "0 1px 3px rgba(0,0,0,.4), 0 4px 20px rgba(0,0,0,.3)",
        glow:  "0 0 30px rgba(37,99,235,.25)",
      },
      animation: {
        "fade-up":    "fadeUp .6s ease both",
        "fade-in":    "fadeIn .5s ease both",
        "slide-right": "slideRight .5s ease both",
        float:        "float 4s ease-in-out infinite",
        pulse2:       "pulse2 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: "translateY(22px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn:   { from: { opacity: 0 },              to: { opacity: 1 } },
        slideRight: { from: { opacity: 0, transform: "translateX(-20px)" }, to: { opacity: 1, transform: "translateX(0)" } },
        float:    { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        pulse2:   { "0%,100%": { opacity: 1 }, "50%": { opacity: .5 } },
      },
    },
  },
  plugins: [],
}