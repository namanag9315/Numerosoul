import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Baby,
  CalendarDays,
  Car,
  Grid3X3,
  Hash,
  Heart,
  MessageCircle,
  Scale,
  Sparkles,
  UserRound,
} from "lucide-react";
import { StarField } from "@/components/effects/StarField";
import { JsonLd } from "@/components/seo/JsonLd";
import { Divider } from "@/components/ui/Divider";
import {
  DESTINY_MEANINGS,
  LIFE_PATH_MEANINGS,
  LO_SHU_NUMBER_MEANINGS,
  MISSING_NUMBER_REMEDIES,
  PERSONAL_YEAR_THEMES,
  SOUL_URGE_MEANINGS,
  VEHICLE_VIBRATION_MEANINGS,
} from "@/lib/numerology-interpretations";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Complete Numerology Guide — Learn Everything",
  description:
    "Learn numerology systems, life path numbers, destiny numbers, soul urge, personality numbers, Lo Shu Grid, missing number remedies, personal year cycles, names, vehicle numbers, and compatibility.",
  alternates: {
    canonical: "/guide",
  },
  openGraph: {
    title: "Complete Numerology Guide — Learn Everything",
    description: "Learn numerology systems, life path numbers, destiny numbers, soul urge, personality numbers, Lo Shu Grid, missing number remedies, personal year cycles, names, vehicle numbers, and compatibility.",
    url: "/guide",
    type: "website",
  },
  twitter: {
    title: "Complete Numerology Guide — Learn Everything",
    description: "Learn numerology systems, life path numbers, destiny numbers, soul urge, personality numbers, Lo Shu Grid, missing number remedies, personal year cycles, names, vehicle numbers, and compatibility.",
  },
};

const guideSections = [
  ["what-is-numerology", "What is Numerology?"],
  ["systems", "Pythagorean vs Chaldean"],
  ["life-path", "Life Path Numbers"],
  ["destiny", "Destiny Numbers"],
  ["soul-urge", "Soul Urge Numbers"],
  ["personality", "Personality Numbers"],
  ["lo-shu", "Lo Shu Grid"],
  ["missing-numbers", "Missing Numbers"],
  ["personal-year", "Personal Year Cycles"],
  ["names", "Numerology for Names"],
  ["vehicle-phone", "Vehicle & Phone Numbers"],
  ["compatibility", "Compatibility Guide"],
] as const;

const loShuLayout = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

export default function GuidePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Guide", path: "/guide" }])} />
      <div className="page-shell selection:bg-[#E8A020]/20 selection:text-[#E8A020]">
      <section className="page-hero">
        {/* Animated stars */}
        <StarField starCount={35} color="gold" className="opacity-[0.25] z-0" />
        <StarField starCount={15} color="white" className="opacity-[0.15] z-0" />

        <div className="page-hero-inner">
          <p className="eyebrow text-[#D4700A]">✦ Learn the Language of Numbers ✦</p>
          <h1 className="page-title">
            The Complete Numerology <span className="page-title-accent">Guide</span>
          </h1>
          <p className="page-subtitle">
            A practical reference for life path numbers, names, Lo Shu Grid,
            personal years, compatibility, and everyday number choices.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <nav className="sticky top-28 rounded-2xl p-5" style={{ background: 'rgba(255,253,249,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(232,160,32,0.15)', boxShadow: '0 16px 40px rgba(15,23,42,0.04)' }}>
              <p className="eyebrow text-xs text-[#D4700A]">Guide</p>
              <div className="mt-4 space-y-3">
                {guideSections.map(([id, title]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block text-sm leading-5 text-[color:var(--text-secondary)] transition hover:text-[#E8A020]"
                  >
                    {title}
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          <main className="space-y-14">
            <GuideSection id="what-is-numerology" icon={Sparkles} title="What is Numerology?">
              <p>
                Numerology is the study of symbolic meaning in numbers,
                especially numbers connected to a person&apos;s date of birth,
                name, home, phone, vehicle, business, and timing cycles. It
                treats numbers as patterns that can be read for temperament,
                choices, recurring lessons, and supportive timing.
              </p>
              <p>
                The strongest readings use numerology as a reflective map, not
                a rigid prediction. Your numbers can reveal tendencies and
                possibilities; your choices decide how those patterns mature.
              </p>
              <GuideCallout label="Start with your birth date" href="/#tools" />
            </GuideSection>

            <GuideSection id="systems" icon={Scale} title="The Two Main Systems">
              <p>
                Pythagorean numerology is widely used for birth-name and full
                name readings. Chaldean numerology is older, compound-number
                focused, and often preferred for public names, business names,
                and spelling corrections.
              </p>
              <div className="mt-7 overflow-hidden rounded-[8px] border border-[color:var(--border)]">
                <table className="w-full min-w-[680px] border-collapse bg-white text-left text-sm">
                  <thead className="bg-[color:var(--orange-pale)] text-[color:var(--text-primary)]">
                    <tr>
                      <th className="px-5 py-4 font-medium">System</th>
                      <th className="px-5 py-4 font-medium">Best Used For</th>
                      <th className="px-5 py-4 font-medium">Key Feature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--border)]">
                    <tr>
                      <td className="px-5 py-4 font-numeral text-[color:var(--sunrise-orange)]">Pythagorean</td>
                      <td className="px-5 py-4 text-[color:var(--text-secondary)]">Life path support, full birth-name expression, personal charts</td>
                      <td className="px-5 py-4 text-[color:var(--text-secondary)]">Letters map from 1 to 9 in a repeating sequence</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 font-numeral text-[color:var(--sunrise-orange)]">Chaldean</td>
                      <td className="px-5 py-4 text-[color:var(--text-secondary)]">Name correction, business names, compound-number interpretation</td>
                      <td className="px-5 py-4 text-[color:var(--text-secondary)]">Letters map from 1 to 8; 9 is treated as sacred</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </GuideSection>

            <GuideSection id="life-path" icon={Hash} title="Life Path Numbers 1-9, 11, 22, and 33">
              <p>
                Your life path number is calculated from your full date of
                birth. Day, month, and year are reduced separately first, then
                combined. This preserves master numbers during the calculation.
              </p>
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Object.entries(LIFE_PATH_MEANINGS).map(([number, meaning]) => (
                  <article key={number} className="card-premium p-5 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)]">
                    <p className="font-numeral text-3xl text-[color:var(--sunrise-orange)]" style={{ textShadow: '0 0 20px rgba(249,115,22,0.15)' }}>{number}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-[color:var(--text-primary)]">
                      {meaning.archetype}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
                      {meaning.keywords.join(" · ")}
                    </p>
                    <p className="mt-3 text-xs text-[color:var(--text-muted)]">
                      Planet: {meaning.ruling_planet} · Compatible: {meaning.compatibility.join(", ")}
                    </p>
                  </article>
                ))}
              </div>
            </GuideSection>

            <GuideSection id="destiny" icon={UserRound} title="Destiny / Expression Numbers">
              <p>
                The destiny number is calculated from all letters in the full
                birth name. It describes expression, opportunity, visible gifts,
                and the way your personality tends to meet the world.
              </p>
              <MeaningGrid meanings={DESTINY_MEANINGS} />
              <GuideCallout label="Try the name number calculator" href="/#tools" />
            </GuideSection>

            <GuideSection id="soul-urge" icon={Heart} title="Soul Urge Numbers">
              <p>
                The soul urge number, also called heart&apos;s desire, is
                calculated from vowels in the full name. It points to emotional
                motivation, private longing, and what the heart needs to feel
                nourished.
              </p>
              <MeaningGrid meanings={SOUL_URGE_MEANINGS} />
            </GuideSection>

            <GuideSection id="personality" icon={MessageCircle} title="Personality Numbers">
              <p>
                The personality number is calculated from consonants. It
                describes the first impression you make, the protective layer of
                the self, and how others often perceive your style before they
                know your inner world.
              </p>
              <div className="mt-6 rounded-[8px] border border-[color:var(--border)] bg-white p-6">
                <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
                  Read together: destiny shows your outer expression, soul urge
                  shows inner desire, and personality shows the doorway people
                  first meet. When these numbers harmonise, choices tend to feel
                  more natural. When they clash, self-awareness becomes the
                  remedy.
                </p>
              </div>
            </GuideSection>

            <GuideSection id="lo-shu" icon={Grid3X3} title="The Lo Shu Grid Explained">
              <p>
                The Lo Shu Grid places digits 1-9 in fixed positions and counts
                how often each appears in the date of birth, with psychic, life
                path, and destiny numbers added for deeper readings.
              </p>
              <div className="mt-8 grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
                <div className="grid aspect-square grid-cols-3 overflow-hidden rounded-[8px] border border-[color:var(--border)] bg-white shadow-sm">
                  {loShuLayout.flat().map((number) => {
                    const meaning = LO_SHU_NUMBER_MEANINGS[number];

                    return (
                      <div key={number} className="flex flex-col items-center justify-center border border-[color:var(--border)] p-4 text-center">
                        <p className="font-numeral text-4xl text-[color:var(--sunrise-orange)]">{number}</p>
                        <p className="mt-1 text-xs text-[color:var(--text-secondary)]">{meaning.planet}</p>
                        <p className="mt-1 text-[11px] text-[color:var(--text-muted)]">{meaning.direction}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(LO_SHU_NUMBER_MEANINGS).map(([number, meaning]) => (
                    <div key={number} className="rounded-[8px] border border-[color:var(--border)] bg-white p-4">
                      <p className="font-numeral text-sm text-[color:var(--sunrise-orange)]">
                        {number} · {meaning.planet}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[color:var(--text-secondary)]">
                        {meaning.element} · {meaning.color} · {meaning.bodyPart}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GuideSection>

            <GuideSection id="missing-numbers" icon={Sparkles} title="Missing Numbers & Remedies">
              <p>
                Missing numbers in the Lo Shu Grid are not flaws. They mark
                qualities that may need conscious practice, environmental
                support, or simple remedial habits.
              </p>
              <DataTable
                rows={Object.entries(MISSING_NUMBER_REMEDIES).map(([number, remedy]) => [
                  number,
                  remedy.focus,
                  remedy.practices.slice(0, 2).join("; "),
                  remedy.affirmation,
                ])}
                headers={["Number", "Focus", "Practices", "Affirmation"]}
              />
            </GuideSection>

            <GuideSection id="personal-year" icon={CalendarDays} title="Personal Year Cycles 1-9">
              <p>
                Personal year numbers describe the yearly theme created by your
                birthday and the current calendar year. They are useful for
                planning launches, study, moves, endings, and commitments.
              </p>
              <DataTable
                rows={Object.entries(PERSONAL_YEAR_THEMES).map(([number, theme]) => [
                  number,
                  theme.theme,
                  theme.focus,
                  `Best: ${theme.bestMonths.join(", ")} · Challenge: ${theme.challengeMonths.join(", ")}`,
                ])}
                headers={["Year", "Theme", "Focus", "Months"]}
              />
            </GuideSection>

            <GuideSection id="names" icon={Baby} title="Numerology for Names">
              <p>
                Name numerology is used for baby names, business names, public
                spellings, brand launches, and name correction. A strong name
                reading considers both the reduced number and the compound
                number, plus how the name feels when spoken.
              </p>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {["Baby names", "Business names", "Name correction"].map((item) => (
                  <div key={item} className="rounded-[8px] border border-[color:var(--border)] bg-white p-5">
                    <p className="font-display text-2xl font-medium text-[color:var(--text-primary)]">{item}</p>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
                      Checked for number harmony, sound, spelling, timing, and
                      the person or purpose the name will serve.
                    </p>
                  </div>
                ))}
              </div>
            </GuideSection>

            <GuideSection id="vehicle-phone" icon={Car} title="Vehicle & Phone Number Numerology">
              <p>
                Vehicle and phone readings reduce all digits to a core
                vibration and compare the result with the owner&apos;s life
                path. The number you use daily should support your rhythm, not
                constantly pull against it.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {Object.entries(VEHICLE_VIBRATION_MEANINGS).map(([number, meaning]) => (
                  <div key={number} className="rounded-[8px] border border-[color:var(--border)] bg-white p-5">
                    <p className="font-numeral text-2xl text-[color:var(--sunrise-orange)]">{number}</p>
                    <h3 className="mt-2 font-display text-xl font-medium text-[color:var(--text-primary)]">{meaning.theme}</h3>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">{meaning.caution}</p>
                  </div>
                ))}
              </div>
              <GuideCallout label="Check a vehicle number" href="/#tools" />
            </GuideSection>

            <GuideSection id="compatibility" icon={Heart} title="Compatibility Guide">
              <p>
                Compatibility is strongest when life path, destiny, and soul
                urge are read together. A simple starting point is to compare
                the life path number with naturally supportive numbers.
              </p>
              <DataTable
                rows={Object.entries(LIFE_PATH_MEANINGS).map(([number, meaning]) => [
                  number,
                  meaning.archetype,
                  meaning.compatibility.join(", "),
                  meaning.challenges.slice(0, 2).join(", "),
                ])}
                headers={["Life Path", "Archetype", "Often Harmonises With", "Watch For"]}
              />
            </GuideSection>
          </main>
        </div>
      </section>
      </div>
    </>
  );
}

function GuideSection({
  children,
  icon: Icon,
  id,
  title,
}: {
  children: React.ReactNode;
  icon: LucideIcon;
  id: string;
  title: string;
}) {
  return (
    <section id={id} className="card-premium scroll-mt-28 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--orange-pale), var(--white))', boxShadow: '0 0 24px rgba(249,115,22,0.08)' }}>
          <Icon className="h-6 w-6 text-[color:var(--sunrise-orange)]" strokeWidth={1.7} />
        </div>
        <h2 className="font-display text-4xl font-bold leading-tight text-[color:var(--text-primary)]">
          {title}
        </h2>
      </div>
      <Divider className="my-7 justify-start" />
      <div className="space-y-5 text-base leading-8 text-[color:var(--text-secondary)]">{children}</div>
    </section>
  );
}

function MeaningGrid({ meanings }: { meanings: typeof DESTINY_MEANINGS }) {
  return (
    <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Object.entries(meanings).map(([number, meaning]) => (
        <article key={number} className="card-premium p-5 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)]">
          <p className="font-numeral text-2xl text-[color:var(--sunrise-orange)]" style={{ textShadow: '0 0 16px rgba(249,115,22,0.15)' }}>{number}</p>
          <h3 className="mt-2 font-display text-xl font-bold text-[color:var(--text-primary)]">
            {meaning.archetype}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
            {meaning.guidance}
          </p>
        </article>
      ))}
    </div>
  );
}

function GuideCallout({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn-secondary mt-3">
      {label} →
    </Link>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-7 overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--border)', background: 'linear-gradient(145deg, var(--white), var(--ethereal-pearl))' }}>
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr style={{ background: 'var(--orange-pale)' }}>
            {headers.map((header) => (
              <th key={header} className="px-5 py-4 font-numeral text-sm font-medium text-[color:var(--text-primary)]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--border)]">
          {rows.map((row) => (
            <tr key={row.join("-")} className="transition hover:bg-black/5">
              {row.map((cell, index) => (
                <td
                  key={`${cell}-${index}`}
                  className={`px-5 py-4 align-top ${index === 0 ? "font-numeral text-[color:var(--sunrise-orange)]" : "text-[color:var(--text-secondary)]"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
