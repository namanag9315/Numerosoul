"use client"

interface NumberCard {
  label: string
  value: number | string
  sublabel?: string
  highlight?: boolean  // true = missing number (shown in red)
}

interface Props {
  numbers: {
    lifePath?: number
    expression?: number
    soulUrge?: number
    personality?: number
    personalYear?: number
    psychicNumber?: number
    missingNumbers?: number[]
  }
}

const ARCHETYPES: Record<number, string> = {
  1:"Leader", 2:"Peacemaker", 3:"Creator", 4:"Builder",
  5:"Explorer", 6:"Nurturer", 7:"Seeker", 8:"Achiever",
  9:"Humanitarian", 11:"Intuitive", 22:"Master Builder",
  33:"Master Teacher"
}

const PLANETS: Record<number, string> = {
  1:"☀️ Sun", 2:"🌙 Moon", 3:"♃ Jupiter", 4:"🪐 Rahu",
  5:"☿ Mercury", 6:"♀ Venus", 7:"♆ Ketu", 8:"♄ Saturn",
  9:"♂ Mars"
}

export function NumberCards({ numbers }: Props) {
  const cards: NumberCard[] = []

  if (numbers.lifePath)
    cards.push({
      label: "Life Path",
      value: numbers.lifePath,
      sublabel: ARCHETYPES[numbers.lifePath]
    })

  if (numbers.psychicNumber)
    cards.push({
      label: "Psychic No.",
      value: numbers.psychicNumber,
      sublabel: PLANETS[numbers.psychicNumber]
    })

  if (numbers.expression)
    cards.push({
      label: "Expression",
      value: numbers.expression,
      sublabel: ARCHETYPES[numbers.expression]
    })

  if (numbers.soulUrge)
    cards.push({
      label: "Soul Urge",
      value: numbers.soulUrge,
      sublabel: ARCHETYPES[numbers.soulUrge]
    })

  if (numbers.personality)
    cards.push({
      label: "Personality",
      value: numbers.personality,
      sublabel: undefined
    })

  if (numbers.personalYear)
    cards.push({
      label: "Personal Year",
      value: numbers.personalYear,
      sublabel: "Current"
    })

  // Missing numbers as separate red cards
  const missing = numbers.missingNumbers ?? []

  if (!cards.length && !missing.length) return null

  return (
    <div style={{ marginBottom: "16px" }}>
      {/* Main number cards */}
      <div style={{
        display: "flex", gap: "10px",
        overflowX: "auto", paddingBottom: "8px",
        scrollbarWidth: "none"
      }}>
        {cards.map(card => (
          <div key={card.label} style={{
            flexShrink: 0,
            background: "white",
            border: "1px solid #E9D5FF",
            borderTop: "4px solid #7C3AED",
            borderRadius: "10px",
            padding: "12px 14px",
            textAlign: "center",
            minWidth: "90px",
            boxShadow: "0 2px 8px rgba(109,40,217,0.08)"
          }}>
            <div style={{
              fontSize: "32px", fontWeight: 800,
              color: "#7C3AED", lineHeight: 1
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: "10px", color: "#6B7280",
              textTransform: "uppercase", letterSpacing: "0.05em",
              marginTop: "4px", fontWeight: 600
            }}>
              {card.label}
            </div>
            {card.sublabel && (
              <div style={{
                fontSize: "9px", color: "#9CA3AF",
                fontStyle: "italic", marginTop: "2px"
              }}>
                {card.sublabel}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Missing numbers row */}
      {missing.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <span style={{
            fontSize: "10px", color: "#DC2626",
            fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.05em", marginRight: "8px"
          }}>
            ⚠️ Missing:
          </span>
          {missing.map(n => (
            <span key={n} style={{
              display: "inline-flex", alignItems: "center",
              justifyContent: "center",
              width: "28px", height: "28px",
              background: "#FEF2F2",
              border: "2px solid #FCA5A5",
              borderRadius: "6px",
              fontSize: "13px", fontWeight: 700,
              color: "#DC2626", marginRight: "4px"
            }}>
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
