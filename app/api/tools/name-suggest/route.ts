import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import {
  calculateChaldeanNameNumber,
  checkNameCompatibility,
  calculatePsychicNumber,
  calculateDestinyNumber,
} from "@/lib/numerology";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { name, dob } = await req.json();

    if (!name || !dob) {
      return NextResponse.json({ error: "Name and DOB are required." }, { status: 400 });
    }

    const psychic = calculatePsychicNumber(dob);
    const destiny = calculateDestinyNumber(dob);

    const prompt = `You are a numerology assistant. Generate 30 alternate phonetic spellings of the name "${name}" (adding 'A', 'E', 'H', 'Y', 'U', 'I', doubling consonants, etc.). They must still be pronounced similarly to the original name.
Return ONLY a valid JSON array of strings in ALL CAPS. Do not include markdown formatting or any other text. Example format: ["RAHUL", "RAAHUL", "RAHULL", "RHAHUL"]`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.7,
      response_format: { type: "json_object" }, // Wait, if we want an array, json_object expects an object.
    }).catch(() => null); // Fallback below if Groq fails or is not configured

    // If we get an error or Groq isn't configured, fallback to basic generation
    let variations: string[] = [];
    
    if (chatCompletion && chatCompletion.choices[0].message.content) {
      try {
        const content = chatCompletion.choices[0].message.content;
        // The LLM might return {"spellings": ["A", "B"]} or just ["A", "B"] depending on how strictly it follows json_object. Let's try to parse it.
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          variations = parsed;
        } else if (parsed && typeof parsed === "object") {
          // Find the first array value
          const firstArray = Object.values(parsed).find(Array.isArray);
          if (firstArray) variations = firstArray as string[];
        }
      } catch (e) {
        console.error("Failed to parse Groq response:", e);
      }
    }

    // Fallback static variations if API fails
    if (variations.length === 0) {
      const base = name.toUpperCase().replace(/[^A-Z]/g, "");
      variations = [
        base,
        base + "A",
        base + "H",
        base + "E",
        base + "Y",
        base[0] + base, // double first
        base + base[base.length - 1], // double last
        "A" + base,
        base.replace(/[AEIOU]/g, (v) => v + v), // double vowels
      ];
    }

    // Always include the original name
    const uniqueVariations = Array.from(new Set([name.toUpperCase(), ...variations.map(v => v.toUpperCase())]));

    const scoredVariations = uniqueVariations.map((variationName) => {
      const calc = calculateChaldeanNameNumber(variationName);
      const comp = checkNameCompatibility(calc.nameNumber, psychic, destiny);
      
      let score = 0;
      if (comp.rating === "excellent") score = 3;
      if (comp.rating === "good") score = 2;
      if (comp.rating === "neutral") score = 1;
      if (!comp.compatible) score = -1;

      return {
        ...calc,
        compatibility: comp,
        score,
      };
    });

    // Filter to only positive scores and sort by score descending
    const validSuggestions = scoredVariations
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    // Get top 5
    const topSuggestions = validSuggestions.slice(0, 5);

    return NextResponse.json({
      original: scoredVariations[0], // the first one is the original name
      suggestions: topSuggestions,
    });
  } catch (error: unknown) {
    console.error("Name suggest API error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
