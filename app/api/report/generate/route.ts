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
import { calculateLoShuGrid } from '@/lib/numerology';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a Chaldean numerology report generator for NumeraSoul. Your job is to produce accurate, personalized, professional reports strictly grounded in the provided knowledge base (KB). You never invent interpretations, titles, scores, or data that do not exist in the KB. Every claim in the report must be traceable to a specific KB field.

CRITICAL RULES:
1. NO MARKDOWN. Use plain text only (no **, *, ##, etc.). Use newlines for spacing.
2. DO NOT hallucinate. Do not reference Pythagorean numerology.
3. Every insight must reference the specific numbers from the knowledge base.
4. If a KB field is empty or missing, write: "[This information is not available in the current knowledge base for Number N.]" Never fill gaps with invented content.
5. Do not use hedging language like "may," "might," "could" when the KB states something directly.
6. The Personal Note section is the ONLY section where the numerologist's own voice and interpretation beyond the KB is permitted.
7. Return exactly valid JSON matching the structure below.

STEP 1 — CALCULATE ALL NUMBERS FIRST
Perform these calculations silently in the "_calculations" field of the JSON output:
- Psychic: day of birth only → reduce to single digit or preserve 11/22/33
- Destiny: reduce month + day + year each to single digit, then add and reduce
- Soul Urge: sum of Chaldean values of VOWELS only (A=1, E=5, I=1, O=7, U=6) → reduce (preserve 11/22/33)
- Personality: sum of Chaldean values of CONSONANTS only → reduce to single digit
- Name Number: sum of ALL letters → reduce to single digit (preserve 11/22/33)
- Maturity Number: Destiny (single digit) + Name Number (single digit) → reduce
- Success Number: Psychic (reduced to single digit if master) + Destiny → reduce

Chaldean alphabet table: A=1, B=2, C=3, D=4, E=5, F=8, G=3, H=5, I=1, J=1, K=2, L=3, M=4, N=5, O=7, P=8, Q=1, R=2, S=3, T=4, U=6, V=6, W=6, X=5, Y=1, Z=7. Calculate without spaces. Always state the reduction steps, e.g. "32 → 3+2 = 5."

STEP 2 — KB LOOKUP RULES
Rule 1: Psychic - If 11, 22, 33, use master_numbers AND psychic_numbers[reduced_digit] for planetary base.
Rule 2: Destiny - Use FULL meaning array from KB (do not summarize Rahu/Ketu/Saturn details).
Rule 3: Soul Urge - You MUST explicitly state the Soul Urge Number in the text.
Rule 4: Name Number - State whether favorable/neutral/unfavorable based on name_correction_rules.
Rule 5: Lucky Colors - Merge from both psychic and destiny. Attribute each color to its source.
Rule 6: Number Compatibility - Use relationship chart for Psychic (reduced).
Rule 7: Timing - Merge favorable and unfavorable from both numbers, attribute to source.
Rule 8: Combination - Check anti-number pairs (needs remedies), opposite numbers (neutral remedies), mutual/one-way enemies (planetary friction).
Rule 9: Titles - ONLY use titles from KB. Destiny numbers have no title.
Rule 10: Lucky Days - Do NOT include lucky days.
Rule 11: Domain Scores - Describe qualitatively. No numerical scores.
Rule 12: Career Guidance - List 8-12 careers from Destiny KB. Note that it is based on Destiny Number.
Rule 13: NO Markdown.

OUTPUT FORMAT — return exactly this JSON structure:
{
  "_calculations": "string (show all reduction steps from STEP 1 here)",
  "psychicNumber": number,
  "destinyNumber": number,
  "psychicArchetype": "string (from KB title, e.g. Master of Intuitiveness)",
  "destinyArchetype": "string (Use only 'Destiny Number N')",
  "psychicPlanet": "string",
  "destinyPlanet": "string",
  "soulUrgeNumber": number,
  "personalityNumber": number,
  "nameNumber": number,
  "maturityNumber": number,
  "combinationNature": "string (Harmonious / Neutral / Challenging (Anti-Number) / Challenging (Planetary friction) / Opposite)",
  "combinationReading": "string (If challenging, planetary explanation. If anti-number, remedies from KB.)",
  "corePersonality": "string (KB traits from psychic/master. Include 'dreamers not doers' for 11)",
  "soulUrgeMeaning": "string (Explicitly state Soul Urge Number: N. Then KB traits)",
  "lifePathMeaning": "string (FULL KB content from destiny meaning. DO NOT paraphrase away planetary specifics)",
  "naturalGifts": [
    {"title": "string", "description": "string (cite which number each gift comes from)"}
  ],
  "challengesAndGrowth": [
    {"challenge": "string", "remedy": "string (include overthinking/anxiety for 11)"}
  ],
  "psychicDestinyTension": "string (ONLY if enemies or anti-number. Explain Moon-Rahu dynamic etc. Include remedies if anti-number. Otherwise leave empty)",
  "healthFocus": "string (KB health notes specific to psychic number)",
  "careerGuidance": "string (8-12 careers from destiny_number. Note based on Destiny Number)",
  "timingAndPeriods": {
    "favorable": ["string (attributed by source)"],
    "unfavorable": ["string (attributed by source)"]
  },
  "luckyElements": {
    "colors": ["string (merged from psychic+destiny, attributed)"],
    "compatibleNumbers": [number],
    "friends": "string",
    "neutral": "string",
    "enemies": "string"
  },
  "nameAssessment": "string (Name Number: N - quality verdict)",
  "recommendedNameSeries": [number],
  "domainDescriptions": {
    "health": "string (Qualitative description based on KB, no numbers)",
    "relationships": "string (Qualitative description based on KB, no numbers)",
    "career": "string (Qualitative description based on KB, no numbers)"
  },
  "loShuMissingRemedies": [
    { "number": number, "impact": "string", "remedy": "string" }
  ],
  "generalLifeGuidance": "string (Synthesis of key themes from KB)",
  "umaPersonalInsight": "string (Personal Note section)"
}`;

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
  const loShuResult = calculateLoShuGrid(clientData.dob);
  const missingNums = loShuResult.missing;
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

For Natural Gifts: Extract gifts from BOTH the Psychic ${psychicNum} guide content AND the Destiny ${destinyNum} guide content. 

For Missing Numbers: Group them by plane and provide specific remedies from the guide content.

CRITICAL INSTRUCTION: Ensure ALL text output has NO MARKDOWN. Use plain text and newlines for formatting.

Return valid JSON matching the specified output format.`;
}

function reduceNumber(n: number): number {
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

    // Enforce correct planets from CHALDEAN_RULING_PLANETS (authoritative, not JSON which has errors e.g. 4=Sun instead of Rahu)
    const { CHALDEAN_RULING_PLANETS } = await import('@/lib/numerologyEngine');
    const exactPsychicPlanet = CHALDEAN_RULING_PLANETS[psychicNumber];
    if (exactPsychicPlanet) {
      reportData.psychicPlanet = exactPsychicPlanet;
    }
    const exactDestinyPlanet = CHALDEAN_RULING_PLANETS[destinyNumber];
    if (exactDestinyPlanet) {
      reportData.destinyPlanet = exactDestinyPlanet;
    }

    // Remove lucky days enforcement from here as it is excluded in new rules
    if (!reportData.luckyElements) reportData.luckyElements = {};

    // Enforce compatibility from JSON
    const compatData = getCompatibility(psychicNumber);
    reportData.luckyElements.friends = compatData.friends;
    reportData.luckyElements.neutral = compatData.neutral;
    reportData.luckyElements.enemies = compatData.enemies;

    // Attach deterministic Lo Shu Grid
    reportData.loShuGrid = calculateLoShuGrid(clientDob);

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const compactEmpty = (obj: any): any => {
      if (typeof obj === 'string') return obj.trim();
      if (Array.isArray(obj)) {
        return obj
          .map(compactEmpty)
          .filter((item) => {
            if (typeof item === 'string') return item.trim().length > 0;
            if (Array.isArray(item)) return item.length > 0;
            if (item && typeof item === 'object') return Object.keys(item).length > 0;
            return item !== null && item !== undefined;
          });
      }
      if (obj && typeof obj === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = {};
        for (const [k, v] of Object.entries(obj)) {
          result[k] = compactEmpty(v);
        }
        return result;
      }
      return obj;
    };

    reportData = compactEmpty(sanitize(reportData));

    const hasReportText = (value: unknown) =>
      typeof value === 'string' && value.trim().length > 0;
    const extractNumbers = (value: string) =>
      (value.match(/\d+/g) || []).map((n) => Number(n)).filter((n) => n >= 1 && n <= 9);
    const includesNumber = (value: string, n: number) => extractNumbers(value).includes(n);

    const friendNumbers = extractNumbers(compatData.friends);
    const nameQuality = includesNumber(compatData.friends, nameNumber)
      ? 'favorable'
      : includesNumber(compatData.neutral, nameNumber)
        ? 'neutral'
        : includesNumber(compatData.enemies, nameNumber)
          ? 'challenging and should be reviewed with remedies'
          : 'requires personal review';

    reportData.clientName = clientName.trim();
    reportData.clientDob = clientDob.trim();
    reportData.serviceName = serviceName || 'Numerology Consultation';
    reportData.serviceSpecificInsight = {
      ...(reportData.serviceSpecificInsight || {}),
      serviceType: serviceName || 'Numerology Consultation',
    };
    reportData.psychicNumber = psychicNumber;
    reportData.destinyNumber = destinyNumber;
    reportData.nameNumber = nameNumber;
    reportData.soulUrgeNumber = soulUrgeNumber;

    if (!hasReportText(reportData.psychicArchetype)) {
      reportData.psychicArchetype = `Psychic Number ${psychicNumber}`;
    }
    if (!hasReportText(reportData.destinyArchetype)) {
      reportData.destinyArchetype = `Destiny Number ${destinyNumber}`;
    }
    if (!hasReportText(reportData.nameAssessment)) {
      reportData.nameAssessment = `Name Number: ${nameNumber} - This is ${nameQuality} for this chart based on the number compatibility table.`;
    }
    if (!Array.isArray(reportData.recommendedNameSeries) || reportData.recommendedNameSeries.length === 0) {
      reportData.recommendedNameSeries = friendNumbers.length > 0
        ? friendNumbers.slice(0, 5)
        : [psychicNumber, destinyNumber, nameNumber];
    }

    return NextResponse.json({ reportData });
  } catch (error) {
    console.error('Report API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report.' },
      { status: 500 }
    );
  }
}
