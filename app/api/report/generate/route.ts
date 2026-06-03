import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

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
  "corePersonality": "string (2-3 paragraphs, specific to Psychic number)",
  "soulUrgeMeaning": "string (bullet points from guide)",
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
    "content": "string (Use service_specific_topics data if provided, else use general data)"
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedDb: any = null;
function getKnowledgeBase() {
  if (cachedDb) return cachedDb;
  try {
    const dbPath = path.join(process.cwd(), 'data', 'extended_numerology_db.json');
    cachedDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    console.error("Failed to load knowledge base", err);
    cachedDb = {};
  }
  return cachedDb;
}

function getCompatibleNumbers(psychicNum: number, _destinyNum: number): { friends: string; neutral: string; enemies: string } {
  const db = getKnowledgeBase();
  const compat = db.number_compatibility || {};
  const base = String(psychicNum === 11 ? 2 : psychicNum === 22 ? 4 : psychicNum === 33 ? 6 : psychicNum);
  return {
    friends: compat[base]?.friends ?? "",
    neutral: compat[base]?.neutral ?? "",
    enemies: compat[base]?.enemies ?? ""
  };
}

function getNumberKnowledge(psychicNum: number, destinyNum: number): string {
  const db = getKnowledgeBase();
  const coreDb = db.core_numbers || {};
  const masterNums = db.master_number || {};
  
  let psychicContent = "";
  let destinyContent = "";
  
  if (psychicNum === 11 || psychicNum === 22 || psychicNum === 33) {
    psychicContent = masterNums[String(psychicNum)] ?? "";
  } else {
    psychicContent = coreDb[String(psychicNum)]?.psychic_meaning ?? "";
  }
  
  if (destinyNum === 11 || destinyNum === 22 || destinyNum === 33) {
    destinyContent = masterNums[String(destinyNum)] ?? "";
  } else {
    destinyContent = coreDb[String(destinyNum)]?.destiny_meaning ?? "";
  }
  
  const luckyColors = db.lucky_colors || {};
  const unfavorable = db.unfavorable_periods || {};
  const favorable = db.favorable_periods || {};
  
  const psychicBase = psychicNum === 11 ? 2 : psychicNum === 22 ? 4 : psychicNum === 33 ? 6 : psychicNum;
  const destinyBase = destinyNum === 11 ? 2 : destinyNum === 22 ? 4 : destinyNum === 33 ? 6 : destinyNum;
  
  return `
PSYCHIC NUMBER ${psychicNum} KNOWLEDGE (from guide):
${psychicContent}

DESTINY NUMBER ${destinyNum} KNOWLEDGE (from guide):
${destinyContent}

LUCKY COLORS (from guide):
- Primary lucky color (Psychic ${psychicNum}): ${luckyColors[String(psychicBase)] ?? ""}
- Secondary lucky color (Destiny ${destinyNum}): ${luckyColors[String(destinyBase)] ?? ""}

UNFAVORABLE PERIODS (from guide):
- For Psychic ${psychicNum}: ${unfavorable[String(psychicBase)] ?? ""}
- For Destiny ${destinyNum}: ${unfavorable[String(destinyBase)] ?? ""}

FAVORABLE PERIODS (from guide):
- For Psychic ${psychicNum}: ${favorable[String(psychicBase)] ?? ""}
- For Destiny ${destinyNum}: ${favorable[String(destinyBase)] ?? ""}
  `;
}

function calculateMissingNumbers(dob: string): number[] {
  const digits = dob.replace(/\D/g, '').split('').map(d => parseInt(d, 10));
  const missing: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!digits.includes(i)) missing.push(i);
  }
  return missing;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAdditionalTopics(serviceName: string, KNOWLEDGE_BASE: any): Record<string, any> {
  if (!KNOWLEDGE_BASE?.additional_topics) return {};
  const s = serviceName.toLowerCase();
  const keys: string[] = [];
  
  // Name Services
  if (s.includes('name')) {
    keys.push('name_correction_rules', 'name_analysis_grid', 'first_letter_of_name');
  }
  // Career Services
  if (s.includes('career') || s.includes('job') || s.includes('work') || s.includes('business')) {
    keys.push('career_guidance', 'success_number');
  }
  // Relationships & Marriage
  if (s.includes('marriage') || s.includes('relationship') || s.includes('love') || s.includes('partner') || s.includes('compatibility')) {
    keys.push('marriage_year_chart', 'marriage_compatibility_chart');
  }
  // Predictions & Forecasts
  if (s.includes('year') || s.includes('forecast') || s.includes('future') || s.includes('period') || s.includes('prediction')) {
    keys.push('personal_year', 'personal_month', 'personal_day', 'favorable_periods', 'unfavorable_periods');
  }
  // Remedies & Grid Analysis
  if (s.includes('remed') || s.includes('grid') || s.includes('missing') || s.includes('kua') || s.includes('color')) {
    keys.push('missing_plane', 'repeating_numbers', 'anti_number_remedies', 'yantra_remedies', 'kua_number_direction_chart', 'kua_number_directional_remedies', 'angel_numbers', 'lucky_colors');
  }
  // Core Numbers & Life Path Services
  if (s.includes('life path') || s.includes('core') || s.includes('karmic') || s.includes('master') || s.includes('soul') || s.includes('personality')) {
    keys.push('master_number', 'soul_urge_number', 'personality_number', 'maturity_number', 'karmic_debt_number', 'success_number', 'challenge_number');
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  for (const k of keys) {
    if (KNOWLEDGE_BASE.additional_topics[k]) {
      result[k] = KNOWLEDGE_BASE.additional_topics[k];
    }
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSmartPrompt(clientData: any, additionalInstructions = '') {
  const KNOWLEDGE_BASE = getKnowledgeBase();

  const missingNums = calculateMissingNumbers(clientData.dob);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const missingRules = missingNums.reduce((acc: any, num: number) => {
    if (KNOWLEDGE_BASE?.missing_numbers?.[String(num)]) {
      acc[String(num)] = KNOWLEDGE_BASE.missing_numbers[String(num)];
    }
    return acc;
  }, {});

  const additionalTopics = getAdditionalTopics(clientData.service, KNOWLEDGE_BASE);

  const soulUrgeContent = KNOWLEDGE_BASE?.soul_urge_number?.[String(clientData.soulUrgeNumber)] || "";

  return `
CLIENT DETAILS:
- Name: ${clientData.name}
- Psychic Number: ${clientData.psychicNumber} (calculated from day ${clientData.dayOfBirth})
- Destiny Number: ${clientData.destinyNumber} (calculated from full DOB ${clientData.dob})
- Soul Urge Number: ${clientData.soulUrgeNumber} (vowels)
- Missing Numbers (1-9): ${missingNums.join(', ') || 'None'}
- Name Number: ${clientData.nameNumber} (Chaldean)
- Service: ${clientData.service}
- Focus area: ${clientData.focusArea || 'general life guidance'}
${additionalInstructions ? `\nUMA'S SPECIFIC ADDITIONS:\n${additionalInstructions}` : ''}

### AUTHORITATIVE CHALDEAN KNOWLEDGE BASE ###
${getNumberKnowledge(clientData.psychicNumber, clientData.destinyNumber)}

SOUL URGE ${clientData.soulUrgeNumber} KNOWLEDGE:
${soulUrgeContent}

COMPATIBLE NUMBERS:
${JSON.stringify(getCompatibleNumbers(clientData.psychicNumber, clientData.destinyNumber), null, 2)}

ADDITIONAL DATA:
${JSON.stringify({ missing_numbers_rules: missingRules, service_specific_topics: additionalTopics }, null, 2)}
### END OF KNOWLEDGE BASE ###

TASK:
Using ONLY the reference data above as your knowledge source, generate a deeply personalised report for ${clientData.name}. 
Every insight must reference their specific numbers — nothing generic.
Write in Uma Rastogi's warm, wise, personal voice.
The service booked is "${clientData.service}" — make the service section extremely relevant by using the "service_specific_topics" provided. If missing numbers exist, mention remedies for them.
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
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
      day = parseInt(clientDob, 10) || 1; // Fallback
    }
    
    const psychicNumber = reduceNumber(day);
    
    const dobDigits = clientDob.replace(/\D/g, '');
    const dobSum = dobDigits.split('').reduce((a: number, d: string) => a + parseInt(d, 10), 0);
    const destinyNumber = reduceNumber(dobSum);
    
    // Calculate name number (Chaldean)
    const CHALDEAN: Record<string, number> = {
      A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,
      D:4,M:4,T:4,H:5,E:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8
    };
    const nameClean = clientName.toUpperCase().replace(/[^A-Z]/g,'');
    const nameSum = nameClean.split('').reduce((a: number, c: string) => a + (CHALDEAN[c] || 0), 0);
    const nameNumber = reduceNumber(nameSum);

    const VOWELS = new Set(["A", "E", "I", "O", "U"]);
    const soulUrgeSum = nameClean.split('').filter((c: string) => VOWELS.has(c)).reduce((a: number, c: string) => a + (CHALDEAN[c] || 0), 0);
    const soulUrgeNumber = reduceNumber(soulUrgeSum);
    
    const enrichedData = {
      name: clientName,
      dob: clientDob,
      service: serviceName || "Numerology Consultation",
      focusArea: "general life guidance",
      dayOfBirth: day,
      psychicNumber,
      destinyNumber,
      nameNumber,
      soulUrgeNumber,
    };

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 3000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildSmartPrompt(enrichedData, customInstructions) }
      ],
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0]?.message?.content || "";
    
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
    
    // Explicitly enforce psychicPlanet and destinyPlanet from CHALDEAN_RULING_PLANETS
    const { CHALDEAN_RULING_PLANETS, LUCKY_DAYS } = await import('@/lib/numerologyEngine');
    const exactPsychicPlanet = CHALDEAN_RULING_PLANETS[psychicNumber];
    if (exactPsychicPlanet) {
      reportData.psychicPlanet = exactPsychicPlanet;
    }
    const exactDestinyPlanet = CHALDEAN_RULING_PLANETS[destinyNumber];
    if (exactDestinyPlanet) {
      reportData.destinyPlanet = exactDestinyPlanet;
    }
    
    if (!reportData.luckyElements.days) reportData.luckyElements.days = [];
    reportData.luckyElements.days.push(LUCKY_DAYS[psychicNumber] || "");
    if (psychicNumber !== destinyNumber) {
      reportData.luckyElements.days.push(LUCKY_DAYS[destinyNumber] || "");
    }
    reportData.luckyElements.days = reportData.luckyElements.days.filter(Boolean);

    return NextResponse.json({ reportData });
  } catch (error) {
    console.error('Report API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report.' },
      { status: 500 }
    );
  }
}
