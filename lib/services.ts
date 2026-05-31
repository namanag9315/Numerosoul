export type ServiceIconKey =
  | "user"
  | "baby-carriage"
  | "car"
  | "smartphone"
  | "edit-3"
  | "building-2"
  | "heart"
  | "briefcase"
  | "home"
  | "grid-3x3"
  | "calendar-stats"
  | "users";

export type NumerologyService = {
  id: string;
  title: string;
  icon: ServiceIconKey;
  price: string;
  duration: string;
  amountInr: number;
  featured?: boolean;
  tagline: string;
  included: string[];
  forWhom: string;
  receive: string[];
};

export const SERVICES: NumerologyService[] = [
  {
    id: "personal-full-reading",
    title: "Personal Full Reading",
    icon: "user",
    price: "₹1,500–₹2,500",
    duration: "60–90 min",
    amountInr: 1500,
    featured: true,
    tagline: "A complete reading of your core numbers, life path, strengths, timing, and energetic patterns.",
    included: [
      "Life path, destiny, soul urge, and personality number",
      "Current personal year and month guidance",
      "Strengths, challenges, lucky colors, and timing notes",
      "Space for personal questions during the session",
    ],
    forWhom:
      "Ideal when you are at a turning point, seeking clarity about your nature, or wanting a grounded map of your numerology profile.",
    receive: [
      "Personalised PDF summary",
      "Session recording or written notes",
      "Lucky dates and color guidance",
      "Practical next-step recommendations",
    ],
  },
  {
    id: "baby-name-numerology",
    title: "Baby Name Numerology",
    icon: "baby-carriage",
    price: "₹1,000–₹2,000",
    duration: "45 min",
    amountInr: 1000,
    featured: true,
    tagline: "Name suggestions and spelling checks aligned with your baby's date of birth and family vibration.",
    included: [
      "Baby DOB analysis",
      "Shortlist of compatible name vibrations",
      "Spelling and initial checks",
      "Parent-name harmony notes",
    ],
    forWhom:
      "For parents choosing a name with care, especially when you want meaning, sound, and numerology to work together.",
    receive: [
      "Lucky name shortlist",
      "Name-number compatibility score",
      "PDF report with meanings",
      "Recommended spellings",
    ],
  },
  {
    id: "vehicle-number",
    title: "Vehicle Number",
    icon: "car",
    price: "₹500–₹800",
    duration: "30 min",
    amountInr: 500,
    featured: true,
    tagline: "Check whether your vehicle number supports your life path, travel rhythm, and daily energy.",
    included: [
      "Registration digit vibration",
      "Owner life path compatibility",
      "Lucky or challenging number notes",
      "Remedial suggestions when needed",
    ],
    forWhom:
      "Useful before buying a vehicle, selecting from available numbers, or checking a registration you already use daily.",
    receive: [
      "Vehicle vibration result",
      "Compatibility rating",
      "Practical remedy notes",
      "Lucky usage guidance",
    ],
  },
  {
    id: "phone-number-check",
    title: "Phone Number Check",
    icon: "smartphone",
    price: "₹500–₹800",
    duration: "30 min",
    amountInr: 500,
    featured: true,
    tagline: "Understand the vibration your mobile number carries into communication, money, and relationships.",
    included: [
      "Full digit total and compound number",
      "Compatibility with DOB",
      "Communication and opportunity reading",
      "Alternate-number guidance if needed",
    ],
    forWhom:
      "For anyone choosing a new number, reviewing a business line, or noticing repeated patterns through phone communication.",
    receive: [
      "Phone vibration report",
      "Compatibility notes",
      "Suggested number qualities",
      "Remedy or change recommendation",
    ],
  },
  {
    id: "name-correction",
    title: "Name Correction",
    icon: "edit-3",
    price: "₹1,500–₹3,000",
    duration: "60 min",
    amountInr: 1500,
    featured: true,
    tagline: "Refine spelling and public-name vibration to support confidence, opportunity, and smoother timing.",
    included: [
      "Current name vibration analysis",
      "Birth-name and public-name comparison",
      "Corrected spelling options",
      "Usage guidance for documents and social profiles",
    ],
    forWhom:
      "Best for people who feel blocked, are rebranding personally, or want their name vibration to support their current life direction.",
    receive: [
      "Corrected-name options",
      "Before-and-after number breakdown",
      "Implementation guidance",
      "PDF summary",
    ],
  },
  {
    id: "business-numerology",
    title: "Business Numerology",
    icon: "building-2",
    price: "₹2,000–₹4,000",
    duration: "60 min",
    amountInr: 2000,
    featured: true,
    tagline: "Brand name, launch date, color, and business vibration guidance for stronger momentum.",
    included: [
      "Business or brand name analysis",
      "Launch date and personal timing check",
      "Color and number alignment",
      "Founder-name compatibility",
    ],
    forWhom:
      "For founders, consultants, creators, and shop owners choosing a name, launching a product, or correcting brand energy.",
    receive: [
      "Brand vibration report",
      "Launch-window suggestions",
      "Lucky color and number notes",
      "Action plan for rollout",
    ],
  },
  {
    id: "marriage-compatibility",
    title: "Marriage Compatibility",
    icon: "heart",
    price: "₹1,500–₹2,500",
    duration: "60 min",
    amountInr: 1500,
    tagline: "Compare life path, destiny, emotional tendencies, and timing between two partners.",
    included: [
      "Both DOB and name-number analysis",
      "Compatibility strengths and friction points",
      "Timing and emotional pattern notes",
      "Supportive remedies and communication guidance",
    ],
    forWhom:
      "For couples, families, or individuals seeking a numerology lens on long-term harmony and practical compatibility.",
    receive: [
      "Compatibility score and notes",
      "Strengths and challenge map",
      "Remedy suggestions",
      "Session summary",
    ],
  },
  {
    id: "career-finance",
    title: "Career & Finance",
    icon: "briefcase",
    price: "₹1,500–₹2,500",
    duration: "60 min",
    amountInr: 1500,
    tagline: "Decode career cycles, money patterns, and timing for moves, launches, and decisions.",
    included: [
      "Career number and personal year reading",
      "Money-pattern analysis",
      "Favorable timing windows",
      "Practical direction for next steps",
    ],
    forWhom:
      "For professionals planning a switch, entrepreneurs choosing timing, or anyone wanting clearer financial rhythm.",
    receive: [
      "Career and finance reading",
      "Best months for action",
      "Lucky business cues",
      "Focused next-step plan",
    ],
  },
  {
    id: "house-number",
    title: "House Number",
    icon: "home",
    price: "₹800–₹1,200",
    duration: "30 min",
    amountInr: 800,
    tagline: "Understand your home vibration and how it affects peace, prosperity, relationships, and routines.",
    included: [
      "House number total and compound reading",
      "Resident compatibility notes",
      "Energy strengths and weak spots",
      "Simple balancing remedies",
    ],
    forWhom:
      "Helpful before renting, buying, moving, or correcting the atmosphere of an existing home.",
    receive: [
      "House vibration result",
      "Resident-fit guidance",
      "Remedial suggestions",
      "Color and placement notes",
    ],
  },
  {
    id: "lo-shu-grid-analysis",
    title: "Lo Shu Grid Analysis",
    icon: "grid-3x3",
    price: "₹1,000–₹2,000",
    duration: "45 min",
    amountInr: 1000,
    tagline: "A Chinese grid personality deep-dive using DOB, repeated numbers, missing numbers, and planes.",
    included: [
      "Full 3x3 Lo Shu grid",
      "Missing and repeated number analysis",
      "Mental, emotional, and practical planes",
      "Remedies for absent numbers",
    ],
    forWhom:
      "For people who want a detailed personality map and practical remedies based on birth-date patterns.",
    receive: [
      "Lo Shu grid chart",
      "Missing-number remedies",
      "Plane analysis",
      "PDF reading notes",
    ],
  },
  {
    id: "personal-year-forecast",
    title: "Personal Year Forecast",
    icon: "calendar-stats",
    price: "₹1,200–₹2,000",
    duration: "45 min",
    amountInr: 1200,
    tagline: "Plan the year ahead with numerology timing, monthly themes, and best windows for decisions.",
    included: [
      "Personal year and month cycle",
      "Best months and challenge months",
      "Relationship, work, and money timing",
      "Action calendar for the year",
    ],
    forWhom:
      "For anyone planning launches, moves, commitments, or a more intentional year.",
    receive: [
      "Year theme report",
      "Month-by-month guidance",
      "Important timing windows",
      "Practical planning prompts",
    ],
  },
  {
    id: "corporate-team-reading",
    title: "Corporate Team Reading",
    icon: "users",
    price: "₹5,000–₹15,000",
    duration: "2–3 hrs",
    amountInr: 5000,
    tagline: "Team dynamics, founder compatibility, and leadership rhythms for groups and organizations.",
    included: [
      "Team number-pattern analysis",
      "Founder or leadership compatibility",
      "Launch and planning timing",
      "Group strengths and communication map",
    ],
    forWhom:
      "For founders, small teams, family businesses, and leadership groups seeking a reflective team-building session.",
    receive: [
      "Team vibration overview",
      "Leadership compatibility notes",
      "Timing recommendations",
      "Group discussion prompts",
    ],
  },
];

export function getServiceById(id: string | null | undefined) {
  return SERVICES.find((service) => service.id === id);
}
