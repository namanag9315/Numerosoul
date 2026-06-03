export interface PlaneData {
  name: string;
  numbers: number[];
  type: 'row' | 'column' | 'diagonal';
  completeReading: string;
  incompleteReading: string;
  partialReadings: Record<string, string>; // key = present numbers joined e.g. "4,9"
}

export const PLANES: PlaneData[] = [
  {
    name: 'Mental Plane',
    numbers: [4, 9, 2],
    type: 'row',
    completeReading: 'Far-sighted, genius-level intellect, excellent memory, full of logic and deep analysis. This person has extraordinary mental capacity and the ability to think several steps ahead of others.',
    incompleteReading: 'Memory lapses and impulsive decision-making are possible. Analytical thinking has gaps. The person may overthink without reaching conclusions or act without adequate analysis.',
    partialReadings: {
      '4,9': 'Strong imagination and intelligence but decisions can be rushed. The 2 is missing — emotional input in decision-making is weak.',
      '9,2': 'Excellent intuition and emotional intelligence. The 4 is missing — long-term planning and patience with detail need development.',
      '4,2': 'Good planner and emotionally aware. The 9 is missing — lacks the drive to see the full picture and may struggle with ambition.',
    }
  },
  {
    name: 'Emotional Plane',
    numbers: [3, 5, 7],
    type: 'row',
    completeReading: 'Takes decisions from the heart. Calm from inside. Good feelings for others. Religious, spiritual, strong intuitions, excellent healing ability. Deep empathy and the capacity for genuine unconditional love.',
    incompleteReading: 'Loneliness is a risk even when surrounded by people. Cannot fully appreciate others or recognise their value. Lack of motivation and a tendency to feel disconnected from meaning and purpose.',
    partialReadings: {
      '3,5': 'Communicative and adaptable but spiritually disconnected. The 7 is missing — depth, introspection, and faith need cultivation.',
      '5,7': 'Spiritually oriented and adaptable. The 3 is missing — self-expression and confidence in communication need work.',
      '3,7': 'Creative and spiritually aware. The 5 is missing — balance and stability in the emotional centre are lacking.',
    }
  },
  {
    name: 'Practical Plane',
    numbers: [8, 1, 6],
    type: 'row',
    completeReading: 'Strong life purpose and direction. Moves toward targets decisively. Excellent in business and commerce. Always interested in generating income and creating material security. Highly action-oriented.',
    incompleteReading: 'Highly impractical behaviour and chronic dreaming about overnight riches without effort. Unable to execute plans. Difficulty converting ideas into tangible results.',
    partialReadings: {
      '8,1': 'Ambitious and independently driven. The 6 is missing — responsibility to others and community awareness need development.',
      '1,6': 'Purpose-driven and caring. The 8 is missing — financial discipline and business acumen need strengthening.',
      '8,6': 'Responsible and materially focused. The 1 is missing — self-belief and personal initiative are weak.',
    }
  },
  {
    name: 'Thought Power Plane',
    numbers: [4, 3, 8],
    type: 'column',
    completeReading: 'Full of excellent ideas with the ability to implement them through proper planning. Good visionary. Well-suited for politics, sales, and any field requiring persuasion and long-range strategy.',
    incompleteReading: 'Lots of confusion and scattered thinking. Lacks logical flow and the ability to sequence thoughts properly. No belief in planning ahead. Wants everything immediately without process.',
    partialReadings: {
      '4,3': 'Good planner and communicator. The 8 is missing — material ambition and the drive for achievement need strengthening.',
      '3,8': 'Ambitious communicator. The 4 is missing — discipline and methodical approach to plans are weak.',
      '4,8': 'Disciplined and materially focused. The 3 is missing — creative expression and communication in planning are lacking.',
    }
  },
  {
    name: 'Will Power Plane',
    numbers: [9, 5, 1],
    type: 'column',
    completeReading: 'Very strong determination. Highly diligent and consistently moves toward goals. Never-give-up attitude regardless of obstacles. Highly flexible and adjusting in any situation. This person finishes what they start.',
    incompleteReading: 'Lack of willpower and inability to sustain effort over time. Gives up easily when results do not come fast. No clear direction and difficulty staying committed to any single path.',
    partialReadings: {
      '9,5': 'Courageous and adaptable but lacks self-belief. The 1 is missing — personal leadership and confidence in identity need development.',
      '5,1': 'Independent and versatile. The 9 is missing — completion energy and universal compassion are weak areas.',
      '9,1': 'Powerful and courageous. The 5 is missing — adaptability and communication in pursuit of goals need attention.',
    }
  },
  {
    name: 'Action Plane',
    numbers: [2, 7, 6],
    type: 'column',
    completeReading: 'Always in action mode. Gets things done attitude. Excellent at sports and any physical pursuit. Always doing something constructive. Ready to take calculated risks. Turns intention into physical reality.',
    incompleteReading: 'Misses opportunities through hesitation. Not ready to take risks even when circumstances are clearly favourable. Indecisive and inactive. Has ideas but cannot translate them into action.',
    partialReadings: {
      '2,7': 'Emotionally perceptive and spiritual. The 6 is missing — responsible action and commitment to others need strengthening.',
      '7,6': 'Spiritual and responsible. The 2 is missing — emotional sensitivity and diplomatic skill in action are weak.',
      '2,6': 'Caring and emotionally engaged. The 7 is missing — spiritual depth and the ability to act on inner knowing are lacking.',
    }
  },
  {
    name: 'Golden Yog',
    numbers: [4, 5, 6],
    type: 'diagonal',
    completeReading: 'THE MOST POWERFUL INDICATOR IN THE ENTIRE GRID. At any point in life this person will reach great heights. They are kind, genuinely respect others feelings, popular with everyone they meet, have a wonderful reputation, and are considered a true gentleman or gentlewoman who loves to help others. Success is not a question of if but only when.',
    incompleteReading: 'Self-doubt and negative thinking about personal success. Whimsical and moody nature. Life purpose feels unclear or blocked. The person may repeatedly stop themselves just before reaching their goals.',
    partialReadings: {
      '4,5': 'Disciplined communicator. The 6 is missing — loving responsibility and harmonious relationships need cultivation for the Yog to activate.',
      '5,6': 'Adaptable and caring. The 4 is missing — disciplined planning and organised effort are the missing key.',
      '4,6': 'Responsible and structured. The 5 is missing — flexibility and communication are needed to complete this powerful diagonal.',
    }
  },
  {
    name: 'Silver Yog',
    numbers: [2, 5, 8],
    type: 'diagonal',
    completeReading: 'Extremely strong willpower. Can accomplish any work they set their mind to. Accumulates significant property, land, and material assets over a lifetime. Immense patience — able to wait for the right moment better than almost anyone.',
    incompleteReading: 'Many disappointments and experiences of being cheated by trusted people. Failures in areas that should have been easy. The patience and persistence needed for material accumulation are consistently undermined.',
    partialReadings: {
      '2,5': 'Emotionally intelligent and adaptable. The 8 is missing — material discipline and ambition for financial security need development.',
      '5,8': 'Ambitious and communicative. The 2 is missing — emotional sensitivity and diplomatic patience are the missing foundation.',
      '2,8': 'Patient and materially focused. The 5 is missing — versatility and communication in pursuit of goals need attention.',
    }
  }
];

export interface PlaneAnalysis {
  name: string;
  numbers: number[];
  type: 'row' | 'column' | 'diagonal';
  presentNumbers: number[];
  missingNumbers: number[];
  isComplete: boolean;
  reading: string;
  isGoldenYog: boolean;
  isSilverYog: boolean;
}

export function analysePlanes(loshuCounts: Record<number, number>): PlaneAnalysis[] {
  return PLANES.map(plane => {
    const presentNums = plane.numbers.filter(n => loshuCounts[n] > 0);
    const missingNums = plane.numbers.filter(n => loshuCounts[n] === 0);
    const isComplete = missingNums.length === 0;

    let reading = '';
    if (isComplete) {
      reading = plane.completeReading;
    } else if (presentNums.length === 0) {
      reading = plane.incompleteReading;
    } else {
      const partialKey = presentNums.join(',');
      reading = plane.partialReadings[partialKey] || plane.incompleteReading;
    }

    return {
      name: plane.name,
      numbers: plane.numbers,
      type: plane.type,
      presentNumbers: presentNums,
      missingNumbers: missingNums,
      isComplete,
      reading,
      isGoldenYog: plane.name === 'Golden Yog' && isComplete,
      isSilverYog: plane.name === 'Silver Yog' && isComplete,
    };
  });
}
