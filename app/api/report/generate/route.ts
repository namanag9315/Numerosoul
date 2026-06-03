import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import {
  buildFullKnowledgeContext,
  getPsychicContent,
  getDestinyContent,
  getSoulUrgeContent,
  getLuckyColor,
  getFavorablePeriod,
  getUnfavorablePeriod,
  getCompatibility,
  getRulingPlanet,
  getMissingNumberContent,
} from '@/lib/numerologyData';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Uma Rastogi, a certified Chaldean numerologist based in Bhopal, India. You generate deeply personalised, accurate numerology reports.

CRITICAL RULES — follow these without exception:
1. You are a STRICT FORMATTER. You must base the report STRICTLY AND SOLELY on the injected text provided in the user prompt under "### AUTHORITATIVE CHALDEAN KNOWLEDGE BASE ###".
2. DO NOT hallucinate external numerology rules. Do not reference Pythagorean numerology.
3. The Psychic Number (day of birth) = how the person sees themselves.
4. The Destiny Number (all DOB digits summed) = how life unfolds, outer path.
5. Write in Uma's warm, confident, personal voice — not generic AI text.
6. Every insight must reference the specific numbers from the knowledge base.
7. Respond ONLY with valid JSON. No markdown, no preamble, no explanation outside the JSON.

The KNOWLEDGE CONTEXT provided contains exact content from the Chaldean Numerology guide. You MUST use this content as the primary source for all interpretations.

RULES:
1. Lucky colors → use EXACTLY what the guide states for the client's psychic and destiny numbers
2. Ruling planet → use the correct planet from the guide (4 = Rahu, NOT Sun. Sun = 1 only)
3. Psychic descriptions → rewrite from guide content, keeping all specific traits mentioned
4. Unfavorable periods → include the exact months from the guide, formatted as a caution section
5. Favorable periods → include the exact dates/months from the guide, formatted as an opportunity section
6. Master numbers (11, 22, 33) → always use the master_number section content, not the base number
7. Soul urge → always include with content from the soul_urge_number section
8. Do NOT invent traits or periods not in the guide
9. Natural Gifts → extract MINIMUM 4 gifts from BOTH Psychic and Destiny guide content
10. Missing Numbers → for each missing number, write what area of life is affected and the specific remedy from the guide

CRITICAL: Never include these phrases in your response:
- "the guide does not provide"
- "not explicitly stated in the guide"
- "we cannot provide specific insights"
- "service_specific_topics"
- "section is empty"
- "according to the guide"
- "the guide says"
- "not available in guide"
- "not available"
- "Since the X section is empty"
- "we will focus on the general aspects"

If you have the content (which is provided above), USE IT. Never admit inability — you have everything needed.

OUTPUT FORMAT — return exactly this JSON structure:
{
  "clientName": "string",
  "psychicNumber": number,
  "destinyNumber": number,
  "psychicArchetype": "string (e.g. The Communicator)",
  "destinyArchetype": "string (e.g. The Nurturer)",
  "psychicPlanet": "string",
  "destinyPlanet": "string",
  "combinationNature": "string (e.g. Favourable / Challenging / Strong)",
  "executiveSummary": "string (3-4 sentences)",
  "corePersonality": "string (2-3 paragraphs, specific to Psychic number, with 4-5 bold bullet traits)",
  "soulUrgeMeaning": "string (bullet points from guide content)",
  "naturalGifts": [
    {"title": "string", "description": "string"}
  ],
  "lifePathMeaning": "string (2 paragraphs about Destiny number)",
  "challengesAndGrowth": [
    {"challenge": "string", "remedy": "string"}
  ],
  "serviceSpecificInsight": {
    "serviceType": "string",
    "heading": "string",
    "content": "string"
  },
  "healthFocus": "string",
  "luckyElements": {
    "days": ["string"],
    "colors": ["string"],
    "compatibleNumbers": [number],
    "friends": "string",
    "neutral": "string",
    "enemies": "string"
  },
  "timingAndPeriods": {
    "favorable": ["string"],
    "unfavorable": ["string"]
  },
  "combinationReading": "string (How Psychic and Destiny interact)",
  "umaPersonalInsight": "string (Uma's personal note)",
  "nameAssessment": "string",
  "recommendedNameSeries": [number],
  "overallRating": {
    "health": number,
    "relationships": number,
    "career": number
  }
}`;

function calculateMissingNumbers(dob: string): number[] {
  const digits = dob.replace(/\D/g, '').split('').map(d => parseInt(d, 10));
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!digits.includes(i)) missing.push(i);
  }
  return missing;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSmartPrompt(clientData: any, additionalInstructions = '') {
  const psychicNum = clientData.psychicNumber;
  const destinyNum = clientData.destinyNumber;
  const soulUrgeNum = clientData.soulUrgeNumber;
  const psychicBase = psychicNum === 11 ? 2 : psychicNum === 22 ? 4 : psychicNum === 33 ? 6 : psychicNum;
  const destinyBase = destinyNum === 11 ? 2 : destinyNum === 22 ? 4 : destinyNum === 33 ? 6 : destinyNum;

  // Build knowledge context from the JSON data extractor
  const fullKnowledge = buildFullKnowledgeContext(psychicNum, destinyNum, soulUrgeNum);

  // Get specific extracted content for direct injection
  const psychicContent = getPsychicContent(psychicNum);
  const destinyContent = getDestinyContent(destinyNum);
  const soulUrgeContent = getSoulUrgeContent(soulUrgeNum);
  const primaryColor = getLuckyColor(psychicNum);
  const secondaryColor = getLuckyColor(destinyNum);
  const compat = getCompatibility(psychicNum);
  const favPsychic = getFavorablePeriod(psychicNum);
  const favDestiny = getFavorablePeriod(destinyNum);
  const unfavPsychic = getUnfavorablePeriod(psychicNum);
  const unfavDestiny = getUnfavorablePeriod(destinyNum);
  const psychicPlanet = getRulingPlanet(psychicNum);
  const destinyPlanet = getRulingPlanet(destinyNum);

  // Missing numbers with remedies from JSON
  const missingNums = calculateMissingNumbers(clientData.dob);
  const missingContent = missingNums.map(n => {
    const content = getMissingNumberContent(n);
    return `Missing Number ${n}: ${content || 'Focus on developing qualities of this number.'}`;
  }).join('\n');

  return `
CLIENT DETAILS:
- Name: ${clientData.name}
- Psychic Number: ${psychicNum} (Base Number: ${psychicBase}, calculated from day ${clientData.dayOfBirth})
- Destiny Number: ${destinyNum} (Base Number: ${destinyBase}, calculated from full DOB ${clientData.dob})
- Psychic Ruling Planet: ${psychicPlanet}
- Destiny Ruling Planet: ${destinyPlanet}
- Soul Urge Number: ${soulUrgeNum} (vowels)
- Missing Numbers (1-9): ${missingNums.join(', ') || 'None'}
- Name Number: ${clientData.nameNumber} (Chaldean)
- Service: ${clientData.service}
- Focus area: ${clientData.focusArea || 'general life guidance'}
${additionalInstructions ? `\nUMA'S SPECIFIC ADDITIONS:\n${additionalInstructions}` : ''}

### AUTHORITATIVE CHALDEAN KNOWLEDGE BASE ###
${fullKnowledge}

=== GUIDE CONTENT FOR PSYCHIC ${psychicNum} ===
"${psychicContent}"

=== GUIDE CONTENT FOR DESTINY ${destinyNum} ===
"${destinyContent}"

=== GUIDE CONTENT FOR SOUL URGE ${soulUrgeNum} ===
"${soulUrgeContent}"

=== PRIMARY LUCKY COLOR (from guide for number ${psychicNum}) ===
"${primaryColor}"

=== SECONDARY LUCKY COLOR (from guide for number ${destinyNum}) ===
"${secondaryColor}"

=== COMPATIBLE NUMBERS (from guide) ===
- Friends (compatible): ${compat.friends}
- Neutral: ${compat.neutral}
- Caution with: ${compat.enemies}

=== FAVORABLE PERIODS ===
For Psychic ${psychicNum}: "${favPsychic}"
For Destiny ${destinyNum}: "${favDestiny}"

=== UNFAVORABLE PERIODS ===
For Psychic ${psychicNum}: "${unfavPsychic}"
For Destiny ${destinyNum}: "${unfavDestiny}"

=== MISSING NUMBERS WITH REMEDIES FROM GUIDE ===
${missingContent}

### END OF KNOWLEDGE BASE ###

TASK:
Using ONLY the reference data above as your knowledge source, generate a deeply personalised report for ${clientData.name}.

For Natural Gifts: Extract MINIMUM 4-5 gifts from BOTH the Psychic ${psychicNum} guide content AND the Destiny ${destinyNum} guide content provided above. Each gift must have a title and 2-sentence explanation.

For Core Personality: Write 4-5 key traits as **Bold Label:** explanation, extracted from the Psychic guide content.

For Soul Urge: Rewrite the soul urge content as bullet points. Do NOT say "not available".

For Lucky Elements: Use the exact colors, periods, and compatibility data injected above.

For Timing & Periods: Combine both numbers' guidance into clear favorable and unfavorable sections with exact months.

For Missing Numbers: Group them by plane and provide specific remedies from the guide content.

Every insight must reference their specific numbers — nothing generic.
Write in Uma Rastogi's warm, wise, personal voice.
Return valid JSON matching the specified output format.`;
}

function reduceNumber(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  if (n <= 9) return n;
  const sum = String(n).split('').reduce((a, d) => a + parseInt(d, 10), 0);
  return reduceNumber(sum);
}

export async function POST(req: Request) {
  try {
    const { clientName, clientDob, serviceName, customInstructions } = await req.json();

    if (!clientName || !clientDob) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate numbers correctly before sending to Groq
    let dobParts = clientDob.split('/');
    if (dobParts.length !== 3) {
      dobParts = clientDob.split('-');
    }

    let day = 1;
    if (dobParts.length === 3) {
      if (dobParts[0].length === 4) {
        // YYYY-MM-DD format
        day = parseInt(dobParts[2], 10);
      } else {
        // DD/MM/YYYY format
        day = parseInt(dobParts[0], 10);
      }
    } else {
      day = parseInt(clientDob, 10) || 1;
    }

    const psychicNumber = reduceNumber(day);

    const dobDigits = clientDob.replace(/\D/g, '');
    const dobSum = dobDigits.split('').reduce((a: number, d: string) => a + parseInt(d, 10), 0);
    const destinyNumber = reduceNumber(dobSum);

    // Calculate name number (Chaldean)
    const CHALDEAN: Record<string, number> = {
      A: 1, I: 1, J: 1, Q: 1, Y: 1, B: 2, K: 2, R: 2, C: 3, G: 3, L: 3, S: 3,
      D: 4, M: 4, T: 4, H: 5, E: 5, N: 5, X: 5, U: 6, V: 6, W: 6, O: 7, Z: 7, F: 8, P: 8,
    };
    const nameClean = clientName.toUpperCase().replace(/[^A-Z]/g, '');
    const nameSum = nameClean.split('').reduce((a: number, c: string) => a + (CHALDEAN[c] || 0), 0);
    const nameNumber = reduceNumber(nameSum);

    const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
    const soulUrgeSum = nameClean
      .split('')
      .filter((c: string) => VOWELS.has(c))
      .reduce((a: number, c: string) => a + (CHALDEAN[c] || 0), 0);
    const soulUrgeNumber = reduceNumber(soulUrgeSum);

    const enrichedData = {
      name: clientName,
      dob: clientDob,
      service: serviceName || 'Numerology Consultation',
      focusArea: 'general life guidance',
      dayOfBirth: day,
      psychicNumber,
      destinyNumber,
      nameNumber,
      soulUrgeNumber,
    };

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildSmartPrompt(enrichedData, customInstructions) },
      ],
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0]?.message?.content || '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let reportData: any;
    try {
      reportData = JSON.parse(rawContent);
    } catch {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        reportData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse report JSON');
      }
    }

    // Enforce correct planets from our data extractor
    const exactPsychicPlanet = getRulingPlanet(psychicNumber);
    if (exactPsychicPlanet) {
      reportData.psychicPlanet = exactPsychicPlanet;
    }
    const exactDestinyPlanet = getRulingPlanet(destinyNumber);
    if (exactDestinyPlanet) {
      reportData.destinyPlanet = exactDestinyPlanet;
    }

    // Enforce lucky days from engine
    const { LUCKY_DAYS } = await import('@/lib/numerologyEngine');
    if (!reportData.luckyElements) reportData.luckyElements = {};
    if (!reportData.luckyElements.days) reportData.luckyElements.days = [];
    reportData.luckyElements.days = [LUCKY_DAYS[psychicNumber] || ''].filter(Boolean);
    if (psychicNumber !== destinyNumber) {
      const destDay = LUCKY_DAYS[destinyNumber] || '';
      if (destDay) reportData.luckyElements.days.push(destDay);
    }

    // Enforce compatibility from JSON
    const compatData = getCompatibility(psychicNumber);
    reportData.luckyElements.friends = compatData.friends;
    reportData.luckyElements.neutral = compatData.neutral;
    reportData.luckyElements.enemies = compatData.enemies;

    // Sanitize output: remove any prompt leak phrases
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitize = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj
          .replace(/Since the [\w\s]+ section is empty[^.]*\./gi, '')
          .replace(/service_specific_topics/gi, '')
          .replace(/the guide does not provide[^.]*\./gi, '')
          .replace(/not explicitly stated in the guide[^.]*\./gi, '')
          .replace(/not available in guide[^.]*\./gi, '')
          .replace(/we cannot provide specific insights[^.]*\./gi, '')
          .replace(/according to the guide,?/gi, '')
          .replace(/the guide says,?/gi, '')
          .trim();
      }
      if (Array.isArray(obj)) return obj.map(sanitize);
      if (obj && typeof obj === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = {};
        for (const [k, v] of Object.entries(obj)) {
          result[k] = sanitize(v);
        }
        return result;
      }
      return obj;
    };

    reportData = sanitize(reportData);

    return NextResponse.json({ reportData });
  } catch (error) {
    console.error('Report API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report.' },
      { status: 500 }
    );
  }
}
