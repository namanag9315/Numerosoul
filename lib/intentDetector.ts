export type Intent =
  | "greeting"
  | "small_talk"
  | "personal_year"
  | "psychic_number"
  | "missing_numbers"
  | "compatibility"
  | "marriage_timing"
  | "name_correction"
  | "colors_remedies"
  | "career_finance"
  | "master_numbers"
  | "lo_shu_grid"
  | "general"

export interface DetectedIntent {
  intent: Intent
  targetYear?: number   // if asking about a specific year
  targetNumber?: number // if asking about a specific number
}

export function detectIntent(message: string): DetectedIntent {
  const msg = message.toLowerCase().trim()

  // Greetings — never search PDF
  if (/^(hi|hello|hey|hii|good\s?(morning|evening|afternoon|night)|namaste|how are you|what'?s up|sup)[\s!?]*$/.test(msg)) {
    return { intent: "greeting" }
  }

  // Small talk — never search PDF
  if (/^(thanks|thank you|ok|okay|great|nice|cool|got it|perfect|bye|goodbye)[\s!.]*$/.test(msg)) {
    return { intent: "small_talk" }
  }

  // Year question — extract the year
  const yearMatch = msg.match(/20([2-9]\d)/)
  if (yearMatch || /\b(this year|next year|personal year)\b/.test(msg)) {
    return {
      intent: "personal_year",
      targetYear: yearMatch ? parseInt(yearMatch[0]) : undefined
    }
  }

  // Specific number queries
  const numMatch = msg.match(/\bnumber\s*([1-9])\b/)
  
  if (/missing|lo shu|grid|lacking|absent/.test(msg))
    return { intent: "missing_numbers" }

  if (/marri|wedding|best time.*relationship|love timing/.test(msg))
    return { intent: "marriage_timing" }

  if (/compat|partner|match|suited|good together/.test(msg))
    return { intent: "compatibility" }

  if (/name|spell|correct.*name|change.*name/.test(msg))
    return { intent: "name_correction" }

  if (/color|colour|remedy|remedies|stone|crystal|rudraksha|gemstone|wear/.test(msg))
    return { intent: "colors_remedies" }

  if (/career|job|business|finance|money|profession|invest/.test(msg))
    return { intent: "career_finance" }

  if (/master number|11|22|33/.test(msg))
    return { intent: "master_numbers" }

  if (/psychic|mulank|ruling planet/.test(msg))
    return { intent: "psychic_number", targetNumber: numMatch ? parseInt(numMatch[1]) : undefined }

  return { intent: "general" }
}
