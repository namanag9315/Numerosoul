export const CHALDEAN: Record<string, number> = {
  A:1,I:1,J:1,Q:1,Y:1,B:2,K:2,R:2,C:3,G:3,L:3,S:3,
  D:4,M:4,T:4,H:5,E:5,N:5,X:5,U:6,V:6,W:6,O:7,Z:7,F:8,P:8
};

export const PLANET_COLORS: Record<number, string> = {
  1:'#D97706',2:'#94A3B8',3:'#CA8A04',4:'#7C3AED',
  5:'#16A34A',6:'#BE185D',7:'#6B7280',8:'#1D4ED8',9:'#B91C1C'
};

export const PLANET_NAMES: Record<number, string> = {
  1:'Sun',2:'Moon',3:'Jupiter',4:'Rahu',5:'Mercury',
  6:'Venus',7:'Ketu',8:'Saturn',9:'Mars'
};

// Reduce to single digit preserving master numbers 11, 22, 33
export function reduce(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  if (n <= 9) return n;
  return reduce(String(n).split('').reduce((a, d) => a + parseInt(d), 0));
}

export function calcName(name: string): { compound: number; reduced: number; letterValues: {letter:string; value:number}[] } {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  const letterValues = clean.split('').map(c => ({ letter: c, value: CHALDEAN[c] || 0 }));
  const compound = letterValues.reduce((a, lv) => a + lv.value, 0);
  return { compound, reduced: reduce(compound), letterValues };
}

// Series classification
export function getSeriesVerdict(reduced: number): 'excellent'|'good'|'neutral'|'avoid' {
  if ([5, 1, 3].includes(reduced)) return 'excellent';
  if ([6, 9].includes(reduced)) return 'good';
  if ([2].includes(reduced)) return 'neutral';
  if ([4, 7, 8].includes(reduced)) return 'avoid';
  return 'neutral';
}

// Check 3 vs 6 opposition
export function hasOpposition(nameReduced: number, psychic: number, destiny: number): boolean {
  const prominent36 = [psychic % 9 || 9, destiny % 9 || 9];
  return (prominent36.includes(3) && nameReduced === 6) ||
         (prominent36.includes(6) && nameReduced === 3);
}

export interface NameSuggestion {
  name: string;
  compound: number;
  reduced: number;
  planet: string;
  planetColor: string;
  verdict: 'excellent' | 'good' | 'neutral' | 'avoid';
  improvement: string;
  priority: number;
}

// SUGGESTION ENGINE
// Generates spelling variations that shift the name number into recommended series
export function generateNameSuggestions(
  fullName: string,
  psychicNumber: number,
  destinyNumber: number,
  recommendedSeries: number[]  // from DOB combination e.g. [1,3,5,9]
): NameSuggestion[] {
  const suggestions: NameSuggestion[] = [];
  const original = calcName(fullName);
  const names = fullName.split(' ');

  // Modification strategies — each produces a different compound total
  const modifications: ((name: string) => string[])[] = [
    // Strategy 1: Double the last consonant
    (n) => {
      const chars = n.split('');
      const vowels = new Set(['A','E','I','O','U']);
      for (let i = chars.length - 1; i >= 0; i--) {
        if (!vowels.has(chars[i].toUpperCase())) {
          const doubled = [...chars];
          doubled.splice(i + 1, 0, chars[i]);
          return [doubled.join('')];
        }
      }
      return [];
    },
    // Strategy 2: Double the last vowel
    (n) => {
      const chars = n.split('');
      const vowels = new Set(['A','E','I','O','U']);
      for (let i = chars.length - 1; i >= 0; i--) {
        if (vowels.has(chars[i].toUpperCase())) {
          const doubled = [...chars];
          doubled.splice(i + 1, 0, chars[i]);
          return [doubled.join('')];
        }
      }
      return [];
    },
    // Strategy 3: Add silent 'h' after vowels
    (n) => {
      const vowels = new Set(['a','e','i','o','u','A','E','I','O','U']);
      const results: string[] = [];
      for (let i = 0; i < n.length; i++) {
        if (vowels.has(n[i]) && i < n.length - 1) {
          results.push(n.slice(0, i + 1) + 'h' + n.slice(i + 1));
        }
      }
      return results.slice(0, 2);
    },
    // Strategy 4: Replace last letter with phonetic equivalent
    (n) => {
      const equivalents: Record<string,string[]> = {
        'i':['ie','ee','y'],'y':['i','ie'],'k':['c'],'c':['k'],
        's':['sh'],'sh':['s'],'j':['g'],'ph':['f'],'f':['ph']
      };
      const lower = n.toLowerCase();
      const results: string[] = [];
      for (const [from, tos] of Object.entries(equivalents)) {
        if (lower.endsWith(from)) {
          tos.forEach(to => {
            const orig = n.slice(0, -from.length);
            const replacement = to.charAt(0).toUpperCase() + to.slice(1).toLowerCase();
            results.push(orig + replacement);
          });
        }
      }
      return results;
    },
    // Strategy 5: Extend spelling (aa, ee variants)
    (n) => {
      const vowels: Record<string, string> = { 'a':'aa','e':'ee','i':'ii' };
      const results: string[] = [];
      for (let i = 1; i < n.length - 1; i++) {
        const lower = n[i].toLowerCase();
        if (vowels[lower]) {
          results.push(n.slice(0, i) + vowels[lower] + n.slice(i + 1));
        }
      }
      return results.slice(0, 2);
    }
  ];

  // Apply all strategies to each part of the full name
  const variants = new Set<string>();
  names.forEach((namePart, partIndex) => {
    modifications.forEach(strategy => {
      const modifiedParts = strategy(namePart);
      modifiedParts.forEach(mod => {
        const newFullName = names.map((n, i) => i === partIndex ? mod : n).join(' ');
        variants.add(newFullName);
      });
    });
  });

  // Score each variant
  variants.forEach(variant => {
    if (variant === fullName) return;
    const calc = calcName(variant);
    const verdict = getSeriesVerdict(calc.reduced);
    const inRecommended = recommendedSeries.includes(calc.reduced);
    const opposition = hasOpposition(calc.reduced, psychicNumber, destinyNumber);

    if (inRecommended && !opposition) {
      suggestions.push({
        name: variant,
        compound: calc.compound,
        reduced: calc.reduced,
        planet: PLANET_NAMES[calc.reduced] || '',
        planetColor: PLANET_COLORS[calc.reduced] || '#C9973A',
        verdict,
        improvement: calc.reduced !== original.reduced
          ? `Shifts from ${PLANET_NAMES[original.reduced]} (${original.reduced}) to ${PLANET_NAMES[calc.reduced]} (${calc.reduced})`
          : 'Same number, better compound',
        priority: verdict === 'excellent' ? 1 : 2
      });
    }
  });

  // Sort by verdict priority then by how close to original the spelling is
  return suggestions
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6); // Return top 6 suggestions maximum
}
