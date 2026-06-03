export const BRAND = {
  name: "NumeroSoul",
  legalName: "NumeroSoul by Uma Rastogi",
  founder: "Uma Rastogi",
  tagline: "Light-filled numerology for grounded inner clarity.",
  location: "Badaun, Uttar Pradesh, India",
  city: "Badaun",
  region: "Uttar Pradesh",
  country: "India",
  email: "numerosoul6@gmail.com",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://numerasoul.in").replace(/^["']|["']$/g, ''),
  invoicePrefix: "NOS",
  colors: {
    amber: "#E8A020",
    amberDark: "#D4700A",
    cream: "#FAF6EE",
    indigo: "#1E0A3C",
    ink: "#0F172A",
    muted: "#64748B",
    teal: "#0D9488",
    white: "#FFFDF9",
  },
} as const;

export function brandUrl(path = "/") {
  return new URL(path, BRAND.siteUrl).toString();
}
