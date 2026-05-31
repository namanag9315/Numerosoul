import fs from "fs"
import path from "path"

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

export function loadRelevantContent(
  intent: string,
  profile: { personalYear: number; personalYearFor: (y: number) => number; psychicNumber: number; missingNumbers: number[]; lifePath: number },
  targetYear?: number
): string {
  const db = getKnowledgeBase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections: any[] = [];

  switch (intent) {
    case "personal_year": {
      const yr = targetYear
        ? profile.personalYearFor(targetYear)
        : profile.personalYear
      sections.push({ personal_year_context: db?.additional_topics?.personal_year, target_year_number: yr });
      break
    }

    case "psychic_number":
      sections.push({ psychic_data: db?.core_numbers?.[String(profile.psychicNumber)] });
      break

    case "missing_numbers":
      profile.missingNumbers.forEach(num => {
        sections.push({ [`missing_${num}`]: db?.missing_numbers?.[String(num)] });
      });
      break

    case "marriage_timing":
    case "compatibility":
      sections.push({ compatibility_chart: db?.additional_topics?.marriage_compatibility_chart });
      sections.push({ psychic_data: db?.core_numbers?.[String(profile.psychicNumber)] });
      break

    case "colors_remedies":
      sections.push({ lucky_colors: db?.additional_topics?.lucky_colors });
      break

    case "name_correction":
      sections.push({ name_correction_rules: db?.additional_topics?.name_correction_rules });
      break

    case "master_numbers":
      sections.push({ master_number: db?.additional_topics?.master_number });
      break

    case "career_finance":
      sections.push({ career_guidance: db?.additional_topics?.career_guidance });
      sections.push({ psychic_data: db?.core_numbers?.[String(profile.psychicNumber)] });
      break

    case "lo_shu_grid":
      profile.missingNumbers.forEach(num => {
        sections.push({ [`missing_${num}`]: db?.missing_numbers?.[String(num)] });
      });
      break

    default:
      sections.push({ personal_year_context: db?.additional_topics?.personal_year });
      sections.push({ psychic_data: db?.core_numbers?.[String(profile.psychicNumber)] });
  }

  return JSON.stringify(sections, null, 2);
}
