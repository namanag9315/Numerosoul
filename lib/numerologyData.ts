/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

let cachedDb: any = null;
export function getKnowledgeBase(): any {
  if (cachedDb) return cachedDb;
  try {
    const dbPath = path.join(process.cwd(), 'data', 'chaldean_numerology_knowledge_base.json');
    cachedDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (err) {
    console.error('Failed to load numerology DB', err);
    cachedDb = {};
  }
  return cachedDb;
}

function toBase(num: number): number {
  return num === 11 ? 2 : num === 22 ? 4 : num === 33 ? 6 : num;
}

export function getPsychicContent(num: number): string {
  const db = getKnowledgeBase();
  if (num === 11 || num === 22 || num === 33) {
    const meaning = db?.structured_knowledge?.master_numbers?.numbers?.[String(num)]?.meaning;
    return Array.isArray(meaning) ? meaning.join(' ') : meaning ?? '';
  }
  const content = db?.structured_knowledge?.psychic_numbers?.[String(num)]?.core_interpretation;
  return Array.isArray(content) ? content.join(' ') : content ?? '';
}

export function getDestinyContent(num: number): string {
  const db = getKnowledgeBase();
  if (num === 11 || num === 22 || num === 33) {
    const meaning = db?.structured_knowledge?.master_numbers?.numbers?.[String(num)]?.meaning;
    return Array.isArray(meaning) ? meaning.join(' ') : meaning ?? '';
  }
  const content = db?.structured_knowledge?.destiny_numbers?.[String(num)]?.core_interpretation;
  return Array.isArray(content) ? content.join(' ') : content ?? '';
}

export function getSoulUrgeContent(num: number): string {
  const db = getKnowledgeBase();
  const base = toBase(num);
  const meaning = db?.structured_knowledge?.soul_urge_numbers?.[String(base)]?.meaning;
  return Array.isArray(meaning) ? meaning.join(' ') : meaning ?? '';
}

export function getLuckyColor(num: number): string {
  const db = getKnowledgeBase();
  const base = toBase(num);
  const colors = db?.structured_knowledge?.psychic_numbers?.[String(base)]?.lucky_colors;
  return Array.isArray(colors) ? colors.join(', ') : colors ?? '';
}

export function getFavorablePeriod(num: number): string {
  const db = getKnowledgeBase();
  const base = toBase(num);
  const periods = db?.structured_knowledge?.psychic_numbers?.[String(base)]?.favorable_periods;
  return Array.isArray(periods) ? periods.join(', ') : periods ?? '';
}

export function getUnfavorablePeriod(num: number): string {
  const db = getKnowledgeBase();
  const base = toBase(num);
  const periods = db?.structured_knowledge?.psychic_numbers?.[String(base)]?.unfavorable_periods;
  return Array.isArray(periods) ? periods.join(', ') : periods ?? '';
}

export function getCompatibility(num: number): {
  friends: string;
  neutral: string;
  enemies: string;
} {
  const db = getKnowledgeBase();
  const base = toBase(num);
  const chartArray = db?.structured_knowledge?.number_relationship_chart || [];
  const compat = chartArray.find((c: any) => c.number === String(base));
  
  return {
    friends: Array.isArray(compat?.friends) ? compat.friends.join(', ') : compat?.friends ?? '',
    neutral: Array.isArray(compat?.neutral) ? compat.neutral.join(', ') : compat?.neutral ?? '',
    enemies: Array.isArray(compat?.enemies) ? compat.enemies.join(', ') : compat?.enemies ?? '',
  };
}

export function getRulingPlanet(num: number): string {
  const db = getKnowledgeBase();
  if (num === 11 || num === 22 || num === 33) {
    const base = toBase(num);
    const basePlanet = db?.structured_knowledge?.psychic_numbers?.[String(base)]?.ruling_planet ?? '';
    return basePlanet ? basePlanet + ' (Master)' : '';
  }
  return db?.structured_knowledge?.psychic_numbers?.[String(num)]?.ruling_planet ?? '';
}

export function getMissingNumberContent(num: number): string {
  const db = getKnowledgeBase();
  const meaning = db?.structured_knowledge?.missing_numbers?.[String(num)]?.meaning;
  return Array.isArray(meaning) ? meaning.join(' ') : meaning ?? '';
}

export function getCareerGuidance(): string {
  const db = getKnowledgeBase();
  const note = db?.structured_knowledge?.career_guidance?.basis_note ?? '';
  return note;
}

export function buildFullKnowledgeContext(
  psychicNum: number,
  destinyNum: number,
  soulUrgeNum: number
): string {
  return `
=== PSYCHIC NUMBER ${psychicNum} — FROM GUIDE ===
${getPsychicContent(psychicNum)}

=== DESTINY NUMBER ${destinyNum} — FROM GUIDE ===
${getDestinyContent(destinyNum)}

=== SOUL URGE NUMBER ${soulUrgeNum} — FROM GUIDE ===
${getSoulUrgeContent(soulUrgeNum)}

=== LUCKY COLORS — FROM GUIDE ===
Primary (Psychic ${psychicNum}): ${getLuckyColor(psychicNum)}
Secondary (Destiny ${destinyNum}): ${getLuckyColor(destinyNum)}

=== COMPATIBLE NUMBERS (Psychic ${psychicNum}) — FROM GUIDE ===
Friends: ${getCompatibility(psychicNum).friends}
Neutral: ${getCompatibility(psychicNum).neutral}
Enemies (caution): ${getCompatibility(psychicNum).enemies}

=== FAVORABLE PERIODS — FROM GUIDE ===
For Psychic ${psychicNum}: ${getFavorablePeriod(psychicNum)}
For Destiny ${destinyNum}: ${getFavorablePeriod(destinyNum)}

=== UNFAVORABLE PERIODS — FROM GUIDE ===
For Psychic ${psychicNum}: ${getUnfavorablePeriod(psychicNum)}
For Destiny ${destinyNum}: ${getUnfavorablePeriod(destinyNum)}
  `.trim();
}
