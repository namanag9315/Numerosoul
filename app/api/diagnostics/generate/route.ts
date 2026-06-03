import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedDb: any = null;
function getKnowledgeBase() {
  if (cachedDb) return cachedDb;
  try {
    const dbPath = path.join(process.cwd(), 'data', 'chaldean_numerology_knowledge_base.json');
    cachedDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    console.error("Failed to load knowledge base", err);
    cachedDb = {};
  }
  return cachedDb;
}

export async function POST(req: Request) {
  try {
    const { section, parameters } = await req.json();

    const KNOWLEDGE_BASE = getKnowledgeBase();
    let relevantContext = "";
    let userPrompt = "";

    if (section === 'dob') {
      const { psychic, destiny } = parameters;
      const pContext = KNOWLEDGE_BASE?.structured_knowledge?.psychic_numbers?.[String(psychic)] || {};
      const dContext = KNOWLEDGE_BASE?.structured_knowledge?.destiny_numbers?.[String(destiny)] || {};
      relevantContext = JSON.stringify({ psychic_number_data: pContext, destiny_number_data: dContext }, null, 2);
      
      userPrompt = `Write a comprehensive deep dive report for Psychic Number ${psychic} and Destiny Number ${destiny}.

MUST USE THIS EXACT MARKDOWN STRUCTURE:
# 🌟 Numerology Reading: Psychic ${psychic} & Destiny ${destiny}

### 📊 Numerology Summary
| Detail | Value |
|--------|-------|
| Psychic Number | ${psychic} |
| Destiny Number | ${destiny} |

---

## 🔮 Psychic Number ${psychic} Analysis

### ✨ Core Vibration
> [One powerful sentence describing the essence of the Psychic Number]

### 💪 Key Strengths
- **[Quality]:** [One sentence explanation]
- **[Quality]:** [One sentence explanation]
- **[Quality]:** [One sentence explanation]

### ⚠️ Areas of Caution
- **[Challenge]:** [One sentence explanation]
- **[Challenge]:** [One sentence explanation]

### ⏱️ Timing & Auspicious Elements
- **Favorable Periods:** [Extract from text]
- **Unfavorable Periods:** [Extract from text]
- **Lucky Colors:** [Extract from text]

---

## 🎯 Destiny Number ${destiny} Analysis

### ✨ Life Purpose & Path
> [One powerful sentence describing the essence of the Destiny Number]

- **[Theme]:** [One sentence explanation]
- **[Theme]:** [One sentence explanation]
- **[Theme]:** [One sentence explanation]

---

## 🤝 Combination Harmony (${psychic} & ${destiny})
> [One powerful sentence summarizing how these two numbers interact and influence their life together]

- **[Synergy]:** [One sentence explanation of how they work well together]
- **[Friction]:** [One sentence explanation of where they conflict]`;
    } else if (section === 'name') {
      const { name, compound, single, dob, psychic, destiny } = parameters;
      relevantContext = JSON.stringify(KNOWLEDGE_BASE?.structured_knowledge?.name_correction_rules || {}, null, 2);
      
      let dobContext = "";
      let dobPromptSection = "";
      
      if (dob && psychic && destiny) {
        dobContext = `
Owner's Date of Birth: ${dob}
Psychic Number: ${psychic}
Destiny Number: ${destiny}
`;
        dobPromptSection = `
---

### ⚖️ Name & Birth Date Compatibility
> [One powerful sentence stating if the name suits the person based on Date of Birth]

- **[Harmony]:** [One sentence about synergy]
- **[Friction]:** [One sentence about opposition if any]
`;
      }
      
      userPrompt = `Write a comprehensive deep dive report for the Chaldean Name "${name}".
Compound Number: ${compound}
Single Name Number: ${single}${dobContext}

MUST USE THIS EXACT MARKDOWN STRUCTURE:
# 🔠 Name Vibration Analysis: ${name}

### 📊 Numerology Summary
| Detail | Value |
|--------|-------|
| Full Name | ${name} |
| Single Number | ${single} |
| Compound Number | ${compound} |

---

## 🔢 Single Name Number (${single})

### ✨ Core Vibration
> [One powerful sentence describing the essence of this single number]

### 💪 Key Strengths
- **[Quality]:** [One sentence explanation]
- **[Quality]:** [One sentence explanation]
- **[Quality]:** [One sentence explanation]

### ⚠️ Points to Watch
- **[Challenge]:** [One sentence explanation]
- **[Challenge]:** [One sentence explanation]

---

## 🌀 Compound Number Meaning (${compound})
> "[One sentence essence of the compound number in quotes]"

- **Karmic Theme:** [Specific theme this compound carries]
- **Hidden Gift:** [What this compound unlocks]
- **Life Pattern:** [What to expect with this compound]
${dobPromptSection}
---

## 💡 Recommendations
- **[Action]:** [Actionable advice 1]
- **[Action]:** [Actionable advice 2]`;
    } else if (section === 'loshu') {
      const { present, missing } = parameters;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const missingContexts = missing.reduce((acc: any, m: number) => {
        if (KNOWLEDGE_BASE?.structured_knowledge?.missing_numbers?.[String(m)]) {
           acc[String(m)] = KNOWLEDGE_BASE.structured_knowledge.missing_numbers[String(m)];
        }
        return acc;
      }, {});
      relevantContext = JSON.stringify({ missing_numbers_rules: missingContexts }, null, 2);
      
      userPrompt = `Write a comprehensive deep dive report for a Lo Shu Grid with the following parameters:
Present Numbers: ${present.join(', ')}
Missing Numbers: ${missing.join(', ')}

MUST USE THIS EXACT MARKDOWN STRUCTURE:
# 🔲 Lo Shu Grid Analysis

## ✨ Active Strengths
- **[Quality]:** [Positive impact of having numbers ${present.join(', ')} present]
- **[Quality]:** [Another positive impact]

---

## 🛠️ Missing Number Remedies
[For each missing number in ${missing.join(', ')}, create a subsection like below]

### Missing Number [X]
> [One powerful sentence about the impact of missing this number]

**Remedies:**
- **[Action]:** [Practical Remedy 1]
- **[Action]:** [Practical Remedy 2]
- **[Aura/Affirmation]:** [Affirmation if any]`;
    } else if (section === 'vehicle') {
      const { regNumber, compound, vibration, ownerLifePath } = parameters;
      // We don't have a specific vehicle knowledge file, so we just pass general context for the vibration number
      relevantContext = JSON.stringify(KNOWLEDGE_BASE?.structured_knowledge?.psychic_numbers?.[String(vibration)] || {}, null, 2);
      
      userPrompt = `Write a comprehensive deep dive report for Vehicle Registration Number: ${regNumber}
Compound Number: ${compound}
Single Vibration Number: ${vibration}
Owner's Life Path Number: ${ownerLifePath}

MUST USE THIS EXACT MARKDOWN STRUCTURE:
# 🚗 Vehicle Vibration Analysis: ${regNumber}

### 📊 Vehicle Summary
| Detail | Value |
|--------|-------|
| Registration | ${regNumber} |
| Compound Number | ${compound} |
| Single Vibration | ${vibration} |
| Owner Life Path | ${ownerLifePath} |

---

## 🔢 Core Vehicle Energy (${vibration})
> [One powerful sentence about the energetic signature of this vehicle]

- **[Quality]:** [One sentence explanation]
- **[Quality]:** [One sentence explanation]

---

## ⚖️ Owner Compatibility
> [One powerful sentence on compatibility between vibration ${vibration} and owner's Life Path ${ownerLifePath}]

- **[Synergy]:** [Benefit 1]
- **[Synergy]:** [Benefit 2]
- **[Caution]:** [Point of caution 1]

---

## 💡 Remedial & Usage Advice
- **[Advice]:** [How best to use this vehicle]
- **[Advice]:** [What to keep inside for positivity]`;
    } else if (section === 'personal_year') {
      const { targetYear, personalYear, universalYear, theme } = parameters;
      relevantContext = JSON.stringify(KNOWLEDGE_BASE?.structured_knowledge?.personal_years || {}, null, 2);
      
      userPrompt = `Write a comprehensive deep dive report for Personal Year ${personalYear}.
Target Year: ${targetYear}
Universal Year: ${universalYear}
Theme: ${theme}

MUST USE THIS EXACT MARKDOWN STRUCTURE:
# 📅 Personal Year Analysis: ${targetYear}

### 📊 Year Summary
| Detail | Value |
|--------|-------|
| Target Year | ${targetYear} |
| Personal Year | ${personalYear} |
| Universal Year | ${universalYear} |
| Theme | ${theme} |

---

## 🌀 Year ${personalYear} Energy: ${theme}
> [One powerful sentence about the core themes and overarching energy]

- **[Energy]:** [One sentence explanation]
- **[Energy]:** [One sentence explanation]

---

## ✨ Opportunities & Favorable Actions
- **[Action]:** [Opportunity 1]
- **[Action]:** [Opportunity 2]
- **[Action]:** [Opportunity 3]

---

## ⚠️ Challenges & Cautions
- **[Caution]:** [Challenge 1]
- **[Caution]:** [Challenge 2]

---

## 💡 Practical Guidance
- **Career/Finance:** [Specific advice]
- **Relationships:** [Specific advice]
- **Health:** [Specific advice]`;
    }

    const systemPrompt = `You are a master Chaldean Numerologist. Use ONLY the following Knowledge Base context to generate your reading. Do not use outside generic numerology knowledge. Do not apologize or mention that you are an AI. If the guide says a formula or data is missing, state it is not found.

CRITICAL FORMATTING RULES — violating these is not allowed:
1. NEVER write plain paragraphs. Every piece of information must be in a bullet point with a bold label.
2. ALWAYS use the exact markdown structure provided.
3. Every section MUST use bullet points with a bold label (e.g., - **[Label]:** [Value]).
4. Maximum 2 sentences per bullet point.
5. Core Insight ALWAYS a blockquote (> Insight)
6. Tables ALWAYS format values properly, never inline in text.

Follow the EXACT markdown structure requested by the user. Use emojis as requested. Ensure the tone is highly professional, mystical, and deeply insightful.

=== RELEVANT KNOWLEDGE ===
${relevantContext}
======================`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 2500
    });

    const report = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Deep Dive API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI deep dive.' },
      { status: 500 }
    );
  }
}
