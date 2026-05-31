export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  excerpt: string;
  readTime: string;
  sections: BlogSection[];
};

export const BLOG_CATEGORIES = [
  "All",
  "Life Path",
  "Vehicle",
  "Baby Names",
  "Master Numbers",
  "Personal Year",
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-your-life-path-number-really-says-about-you",
    title: "What Your Life Path Number Really Says About You",
    category: "Life Path",
    author: "NumeroSoul",
    publishedAt: "2026-05-18",
    readTime: "6 min read",
    excerpt:
      "Your life path number is not a label. It is a repeating rhythm that describes motivation, timing, and the way your growth asks to unfold.",
    sections: [
      {
        heading: "A Blueprint, Not a Box",
        paragraphs: [
          "The life path number is calculated from your date of birth and is often treated as the central number in a personal reading. It points to the tone of your journey: how you learn, what you repeatedly face, and the strengths that become more visible with maturity.",
          "A good reading keeps the number alive. A Life Path 1 is not simply a leader, and a Life Path 7 is not simply spiritual. Each number has a high expression, a shadow pattern, and a timing rhythm that changes with age and choices.",
        ],
      },
      {
        heading: "How to Read the Number",
        paragraphs: [
          "Begin with the archetype, then look at the ruling planet, compatible numbers, and current personal year. The same life path can feel very different in a Year 1 of initiation compared with a Year 9 of closure.",
          "For practical decisions, your life path is strongest when read alongside your destiny number and soul urge. The birth date tells the path; the name describes the instrument you use to walk it.",
        ],
      },
      {
        heading: "When It Becomes Useful",
        paragraphs: [
          "Life path work becomes most helpful during transitions: career changes, relationships, business launches, naming a child, or choosing dates that should carry cleaner momentum.",
          "The aim is not superstition. It is pattern recognition with symbolic language, used gently enough to support clear decisions.",
        ],
      },
    ],
  },
  {
    slug: "why-your-car-number-affects-your-luck-more-than-you-think",
    title: "Why Your Car Number Affects Your Luck More Than You Think",
    category: "Vehicle",
    author: "NumeroSoul",
    publishedAt: "2026-05-10",
    readTime: "5 min read",
    excerpt:
      "Vehicle numerology studies the vibration of the digits you travel with every day, and whether that rhythm supports your birth number.",
    sections: [
      {
        heading: "A Number You Move With",
        paragraphs: [
          "A vehicle number is not passive. You repeat it in documents, see it often, and travel under it. Numerology treats that repeated contact as a small but consistent energetic signature.",
          "The most important check is compatibility between the vehicle vibration and the owner's life path. A number that feels smooth for one person can feel heavy or restless for another.",
        ],
      },
      {
        heading: "What We Calculate",
        paragraphs: [
          "The digits in the registration are added, then reduced to a core number. The compound total is also noted, because the route to the final number often adds texture to the reading.",
          "For example, a vehicle that reduces to 5 can support movement, sales, travel, and flexible work. It may feel distracting for someone who needs stability unless balanced with practical discipline.",
        ],
      },
      {
        heading: "Before You Choose",
        paragraphs: [
          "If you are buying a new vehicle, compare available registration options with your date of birth. If you already own the vehicle, remedies and mindful use can soften challenging combinations.",
        ],
      },
    ],
  },
  {
    slug: "how-to-pick-a-lucky-baby-name-using-numerology",
    title: "How to Pick a Lucky Baby Name Using Numerology",
    category: "Baby Names",
    author: "NumeroSoul",
    publishedAt: "2026-04-30",
    readTime: "7 min read",
    excerpt:
      "A baby name reading blends sound, spelling, family preference, life path compatibility, and the long-term vibration the child will carry.",
    sections: [
      {
        heading: "Start With the Birth Date",
        paragraphs: [
          "The baby's date of birth gives the life path and psychic number. These numbers help us understand what kind of name vibration will feel supportive rather than contradictory.",
          "A name does not need to match the life path exactly, but it should harmonise. The strongest choices usually support the child's natural temperament while adding balance where the chart is light.",
        ],
      },
      {
        heading: "Name Number and Sound",
        paragraphs: [
          "Each letter carries a numeric value. The full proposed name is totalled and reduced, while the compound number is preserved for deeper interpretation.",
          "Sound also matters. A name may calculate well but feel harsh, awkward, or disconnected from the family. Numerology should refine the choice, not remove warmth from it.",
        ],
      },
      {
        heading: "Shortlists Work Best",
        paragraphs: [
          "Parents usually arrive with five to twenty names. The most useful process ranks them, explains why a few stand out, and suggests spelling shifts only when they feel natural.",
        ],
      },
    ],
  },
  {
    slug: "the-power-of-master-numbers-11-22-and-33",
    title: "The Power of Master Numbers 11, 22, and 33",
    category: "Master Numbers",
    author: "NumeroSoul",
    publishedAt: "2026-04-21",
    readTime: "6 min read",
    excerpt:
      "Master numbers are not automatically lucky. They are intensified patterns that ask for grounding, maturity, and conscious use.",
    sections: [
      {
        heading: "Why They Stay Unreduced",
        paragraphs: [
          "In numerology, 11, 22, and 33 are preserved because their symbolism carries a higher-voltage version of 2, 4, and 6. They suggest potential, sensitivity, and responsibility.",
          "The word master does not mean superior. It means the number requires mastery. Without grounding, a master number can feel anxious, pressured, or difficult to sustain.",
        ],
      },
      {
        heading: "The Three Frequencies",
        paragraphs: [
          "11 is the visionary messenger: intuitive, sensitive, and inspiring. 22 is the master builder: practical vision, systems, and legacy. 33 is the master teacher: service, healing, and compassionate leadership.",
          "Each needs daily structure. The stronger the intuition, the more important the nervous system, routine, and healthy boundaries become.",
        ],
      },
      {
        heading: "How to Work With Them",
        paragraphs: [
          "Master numbers are best read in the full chart. A single 11 in the name is different from an 11 life path supported by compatible destiny and soul urge numbers.",
        ],
      },
    ],
  },
  {
    slug: "personal-year-2025-what-does-it-mean-for-your-number",
    title: "Personal Year 2025: What Does It Mean for Your Number?",
    category: "Personal Year",
    author: "NumeroSoul",
    publishedAt: "2025-12-28",
    readTime: "5 min read",
    excerpt:
      "Your personal year shows the theme you are moving through in a calendar year, from new beginnings to completion and release.",
    sections: [
      {
        heading: "The Year Has a Tone",
        paragraphs: [
          "A personal year is calculated from your day and month of birth plus the current calendar year. It describes the yearly weather around your decisions.",
          "It does not remove free will. It helps you understand when to begin, refine, express, build, change, commit, study, harvest, or release.",
        ],
      },
      {
        heading: "Planning With the Cycle",
        paragraphs: [
          "A Year 1 supports initiation and independence. A Year 4 supports structure. A Year 8 highlights power, money, and results. A Year 9 asks for completion before the new cycle begins.",
          "The best planning happens when personal year, personal month, and the type of decision are read together.",
        ],
      },
      {
        heading: "Use It Gently",
        paragraphs: [
          "Timing is a compass, not a cage. If something must happen in a challenging month, numerology can still help you choose preparation, communication, and remedy wisely.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string, category: string) {
  return BLOG_POSTS.filter((post) => post.slug !== slug && post.category === category).slice(0, 2);
}
