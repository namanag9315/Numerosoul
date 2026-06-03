import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import { computeProfile } from "@/lib/numerologyEngine"
import { detectIntent } from "@/lib/intentDetector"
import { loadRelevantContent } from "@/lib/topicLoader"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are an expert Chaldean numerologist assistant.

CRITICAL INSTRUCTION: Use the Chaldean Numerology JSON as the source of truth. Do not use generic numerology content or Pythagorean concepts unless explicitly asked for comparison. If the provided JSON knowledge base indicates that a formula, chart, or data point is missing (e.g. through a "known_source_gaps" entry), you MUST state that it is not found in the guide instead of inventing data. Preserve guide-specific wording and meanings.

CRITICAL FORMATTING RULES — violating these is not allowed:

1. NEVER write plain paragraphs. Every piece of information 
   must be in a bullet point with a bold label.
   
   ❌ WRONG:
   "The number 8 is powerful and ambitious, often associated 
   with leadership qualities and authority..."
   
   ✅ CORRECT:
   - **Core Vibration:** Powerful, ambitious energy tied to 
     leadership and authority
   - **Strengths:** Natural organizer, disciplined, 
     achievement-focused
   - **Watch Out For:** Tendency toward materialism and 
     stubbornness

2. ALWAYS use this exact structure for name analysis:

## 🔮 Name Vibration Analysis: {NAME}

---

### 📊 Numerology Summary
| Detail | Value |
|--------|-------|
| Full Name | {name} |
| Single Number | {n} — {meaning} |
| Compound Number | {nn} |
| Ruling Planet | {planet} |

---

### ✨ Core Vibration
> [One powerful sentence describing the essence of this number. 
>  Bold and memorable.]

---

### 💪 Key Strengths
- **[Quality]:** [One sentence explanation]
- **[Quality]:** [One sentence explanation]
- **[Quality]:** [One sentence explanation]
- **[Quality]:** [One sentence explanation]

---

### ⚠️ Points to Watch
- **[Challenge]:** [One sentence explanation]
- **[Challenge]:** [One sentence explanation]
- **[Challenge]:** [One sentence explanation]

---

### 🌀 Compound Number {nn} — Deep Meaning
> "[One sentence essence of the compound number in quotes]"

- **Karmic Theme:** [Specific theme this compound carries]
- **Hidden Gift:** [What this compound unlocks]
- **Life Pattern:** [What to expect with this compound]

---

### 🪐 Planetary Influence
- **Ruling Planet:** {planet}
- **Planet Energy:** [How this planet's energy shapes the person]
- **Best Aligned With:** [Compatible numbers/planets]

---

### 🎯 Practical Guidance
- **Career:** [Specific career advice for this number]
- **Relationships:** [Relationship advice]
- **Finances:** [Financial guidance]
- **Spiritual:** [Spiritual development tip]

---

### ✏️ Name Correction Suggestion
*(Only include if the current name vibration needs improvement)*
- **Current Vibration:** {n} — {assessment}
- **Suggested Spelling:** {NewSpelling}
- **New Single Number:** {new_n}
- **Why Better:** [One sentence reason]

---

*Answered by: 🤖 Groq AI*

3. For NON-name questions, use the same bullet structure:
   Every section = bullets with **Bold Label:** prefix
   Never more than 2 sentences per bullet
   Never more than 5 bullets per section

4. Numbers in tables ALWAYS — never inline in text:
   ❌ "Your life path is 7 and expression is 3"
   ✅ Table with Life Path | 7 and Expression | 3

5. Core Insight ALWAYS a blockquote:
   ❌ "This is a powerful number."
   ✅ > This is a powerful number.

6. Maximum 500 words. Precision over length.`

export async function POST(req: Request) {
  try {
    const { message, clientName, clientDOB } = await req.json()

    // Step 1: Detect intent (before anything else)
    const { intent, targetYear } = detectIntent(message ?? "")

    // Step 2: Handle greetings without any PDF search
    if (intent === "greeting" || intent === "small_talk") {
      const isGreeting = intent === "greeting"
      
      const answer = clientName && clientDOB
        ? buildGreeting(clientName, clientDOB, isGreeting)
        : `## 👋 Hello${isGreeting ? "!" : " — glad to help!"}

To get started, please enter the client's **name** and **date of birth** 
in the fields above, then ask me anything.

**You can ask about:**
- 📅 Year forecasts — *"How will 2027 be?"*
- 🔢 Missing numbers — *"What are the missing number remedies?"*
- 💑 Compatibility — *"Who is this person compatible with?"*
- ✏️ Name correction — *"Suggest a better name spelling"*
- 🎨 Colors & stones — *"What colors suit this client?"*`

      return NextResponse.json({
        answer,
        source: "local-guide-engine",
        computedNumbers: clientName && clientDOB
          ? computeProfile(clientName, clientDOB) 
          : null
      })
    }

    // Step 3: Compute numerology profile
    if (!clientName || !clientDOB) {
      return NextResponse.json({
        answer: "## ⚠️ Missing Client Details\n\nPlease enter the client's **name** and **date of birth** in the fields above before asking a question.",
        source: "local-guide-engine",
        computedNumbers: null
      })
    }

    const profile = computeProfile(clientName, clientDOB, targetYear)

    // Step 4: Load ONLY the relevant knowledge section(s)
    const knowledgeContent = loadRelevantContent(intent, profile, targetYear)

    // Step 5: Build prompt
    let userPrompt = `
CLIENT INFORMATION:
- Name: ${clientName}
- Date of Birth: ${clientDOB}
- Life Path: ${profile.lifePath} (${profile.archetypes.lifePath})
- Psychic Number: ${profile.psychicNumber} (${profile.archetypes.psychic})
- Expression: ${profile.expression}
- Soul Urge: ${profile.soulUrge}
- Personality: ${profile.personality}
- Maturity: ${profile.maturityNumber}
- Current Personal Year: ${profile.personalYear}
${targetYear ? `- Personal Year for ${targetYear}: ${profile.personalYearFor(targetYear)}` : ""}
- Missing Numbers: ${profile.missingNumbers.length 
    ? profile.missingNumbers.join(", ") 
    : "None"}

REFERENCE MATERIAL (use this to inform your answer — do not quote it directly):
${knowledgeContent || "Use your general numerology knowledge for this topic."}

QUESTION: ${message}

Answer following the exact markdown format in the system prompt.
Use the client's actual computed numbers above in the Client Snapshot table.`

    const isNameQuestion = 
      intent === "name_correction" || 
      /\bname\b|\bvibration\b|\bspell/i.test(message)

    if (isNameQuestion) {
      userPrompt += `\n\nNAME ANALYSIS INSTRUCTIONS:
- Analyze the name: ${clientName}
- Calculate Single Number using Chaldean values
- Calculate Compound Number (before reduction)
- Identify the ruling planet for the single number
- Use the EXACT name analysis template from the system prompt
- NEVER write a paragraph about the number — only bullets and tables
- Each strength/challenge = exactly ONE bullet with bold label`
    }

    // Step 6: Call Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userPrompt }
      ],
      max_tokens: 1024,
      temperature: 0.7
    })

    const answer = completion.choices[0]?.message?.content 
      ?? "I couldn't generate a response. Please try again."

    return NextResponse.json({
      answer,
      source: "groq",
      computedNumbers: {
        lifePath:      profile.lifePath,
        expression:    profile.expression,
        soulUrge:      profile.soulUrge,
        personality:   profile.personality,
        personalYear:  profile.personalYear,
        missingNumbers: profile.missingNumbers,
        psychicNumber: profile.psychicNumber
      }
    })

  } catch (error) {
    console.error("❌ /api/chat error:", error)
    return NextResponse.json({
      answer: "## ⚠️ Something Went Wrong\n\nPlease try again in a moment.",
      source: "error",
      computedNumbers: null
    }, { status: 200 })
  }
}

function buildGreeting(name: string, dob: string, isGreeting: boolean): string {
  try {
    const profile = computeProfile(name, dob)
    const firstName = name.split(" ")[0]
    return `## 👋 ${isGreeting ? `Hello!` : `You're welcome!`}

${isGreeting ? `I have **${firstName}'s** numerology profile ready.` : "Feel free to ask anything else."}

### 📊 Quick Snapshot
| Detail | Value |
|--------|-------|
| Life Path | ${profile.lifePath} — ${profile.archetypes.lifePath} |
| Psychic Number | ${profile.psychicNumber} — ${profile.archetypes.psychic} |
| Expression | ${profile.expression} |
| Soul Urge | ${profile.soulUrge} |
| Personal Year | ${profile.personalYear} |
| Missing Numbers | ${profile.missingNumbers.join(", ") || "None"} |

**Ask me anything:**
- *"How will 2027 be for this client?"*
- *"What are remedies for missing numbers?"*
- *"Suggest a corrected name spelling"*`
  } catch {
    return `## 👋 Hello!\n\nClient profile loaded. What would you like to explore?`
  }
}
