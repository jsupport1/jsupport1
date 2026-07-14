// Tailwind CDN runtime configuration.
// Mirrors the custom @theme block that previously lived in globals.css
// (src/app/globals.css) so all utility classes (bg-primary, text-accent, etc.)
// keep working exactly as they did in the Next.js version.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a",
        secondary: "#475569",
        accent: "#0f766e",
        background: "#ffffff",
        section: "#f8fafc",
        text: "#1f2937",
        border: "#e5e7eb",
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
};
