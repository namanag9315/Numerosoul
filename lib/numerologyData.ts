/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

let cachedDb: any = null;
function getDb(): any {
  if (cachedDb) return cachedDb;
  try {
    const dbPath = path.join(process.cwd(), 'data', 'extended_numerology_db.json');
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
  const db = getDb();
  if (num === 11 || num === 22 || num === 33) {
    return db?.additional_topics?.master_number?.[String(num)] ?? '';
  }
  return db?.core_numbers?.[String(num)]?.psychic_meaning ?? '';
}

export function getDestinyContent(num: number): string {
  const db = getDb();
  if (num === 11 || num === 22 || num === 33) {
    return db?.additional_topics?.master_number?.[String(num)] ?? '';
  }
  return db?.core_numbers?.[String(num)]?.destiny_meaning ?? '';
}

export function getSoulUrgeContent(num: number): string {
  const db = getDb();
  const base = toBase(num);
  return db?.additional_topics?.soul_urge_number?.[String(base)] ?? '';
}

export function getLuckyColor(num: number): string {
  const db = getDb();
  const base = toBase(num);
  return db?.additional_topics?.lucky_colors?.[String(base)] ?? '';
}

export function getFavorablePeriod(num: number): string {
  const db = getDb();
  const base = toBase(num);
  return db?.additional_topics?.favorable_periods?.[String(base)] ?? '';
}

export function getUnfavorablePeriod(num: number): string {
  const db = getDb();
  const base = toBase(num);
  return db?.additional_topics?.unfavorable_periods?.[String(base)] ?? '';
}

export function getCompatibility(num: number): {
  friends: string;
  neutral: string;
  enemies: string;
} {
  const db = getDb();
  const base = toBase(num);
  const compat = db?.tables?.combinations_and_compatibility?.number_relationship_chart?.[String(base)];
  return {
    friends: compat?.friends ?? '',
    neutral: compat?.neutral ?? '',
    enemies: compat?.enemies ?? '',
  };
}

export function getRulingPlanet(num: number): string {
  const db = getDb();
  if (num === 11 || num === 22 || num === 33) {
    const base = toBase(num);
    const basePlanet = db?.core_numbers?.[String(base)]?.ruling_planet ?? '';
    return basePlanet ? basePlanet + ' (Master)' : '';
  }
  return db?.core_numbers?.[String(num)]?.ruling_planet ?? '';
}

export function getMissingNumberContent(num: number): string {
  const db = getDb();
  return db?.missing_numbers?.[String(num)] ?? '';
}

export function getCareerGuidance(): string {
  const db = getDb();
  return db?.additional_topics?.career_guidance?.numerology ?? '';
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
