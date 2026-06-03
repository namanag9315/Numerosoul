import fs from "fs"
import path from "path"

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

export function loadRelevantContent(
  intent: string,
  profile: { personalYear: number; personalYearFor: (y: number) => number; psychicNumber: number; missingNumbers: number[]; lifePath: number },
  targetYear?: number
): string {
  const db = getKnowledgeBase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sections: any[] = [];
  
  // ALWAYS push known source gaps so the bot knows what NOT to hallucinate
  if (db?.known_source_gaps) {
    sections.push({ known_source_gaps: db.known_source_gaps });
  }

  switch (intent) {
    case "personal_year": {
      const yr = targetYear
        ? profile.personalYearFor(targetYear)
        : profile.personalYear
      sections.push({ personal_year_context: db?.structured_knowledge?.personal_years, target_year_number: yr });
      break
    }

    case "psychic_number":
      sections.push({ psychic_data: db?.structured_knowledge?.psychic_numbers?.[String(profile.psychicNumber)] });
      break

    case "missing_numbers":
      profile.missingNumbers.forEach(num => {
        sections.push({ [`missing_${num}`]: db?.structured_knowledge?.missing_numbers?.[String(num)] });
      });
      break

    case "marriage_timing":
    case "compatibility":
      sections.push({ compatibility_chart: db?.structured_knowledge?.marriage_compatibility_chart });
      sections.push({ psychic_data: db?.structured_knowledge?.psychic_numbers?.[String(profile.psychicNumber)] });
      break

    case "colors_remedies":
      // Colors are now tied to the psychic number
      sections.push({ lucky_colors: db?.structured_knowledge?.psychic_numbers?.[String(profile.psychicNumber)]?.lucky_colors });
      break

    case "name_correction":
      sections.push({ name_correction_rules: db?.structured_knowledge?.name_correction_rules });
      break

    case "master_numbers":
      sections.push({ master_number: db?.structured_knowledge?.master_numbers });
      break

    case "career_finance":
      sections.push({ career_guidance: db?.structured_knowledge?.career_guidance });
      sections.push({ psychic_data: db?.structured_knowledge?.psychic_numbers?.[String(profile.psychicNumber)] });
      break

    case "lo_shu_grid":
      profile.missingNumbers.forEach(num => {
        sections.push({ [`missing_${num}`]: db?.structured_knowledge?.missing_numbers?.[String(num)] });
      });
      break

    default:
      sections.push({ personal_year_context: db?.structured_knowledge?.personal_years });
      sections.push({ psychic_data: db?.structured_knowledge?.psychic_numbers?.[String(profile.psychicNumber)] });
  }

  return JSON.stringify(sections, null, 2);
}
