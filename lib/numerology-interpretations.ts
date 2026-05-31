export interface DOBCombination {
  nature: string;
  summary: string;
  bestNameSeries: string;
}

export interface CompoundNameMeaning {
  series: string;
  verdict: string;
  summary: string;
  famousExamples: string;
}

export const PLANETS: Record<number, string> = {
  1: "Sun",
  2: "Moon",
  3: "Jupiter",
  4: "Rahu",
  5: "Mercury",
  6: "Venus",
  7: "Ketu",
  8: "Saturn",
  9: "Mars",
};

export const DOB_COMBINATIONS: Record<string, DOBCombination> = {
  "1-1": { nature: "Strong", summary: "Success and confidence, but ego, health neglect, relationship challenges possible", bestNameSeries: "1,3,5,6,9" },
  "1-2": { nature: "Favourable", summary: "Professional success, mood swings, needs emotional management", bestNameSeries: "1,3,5,6" },
  "1-3": { nature: "Positive", summary: "Success and natural ability to advise others, keep ego in check", bestNameSeries: "1,3,5,9" },
  "1-4": { nature: "Strong", summary: "Determination, name and fame, heightened ego — moves forward without hesitation", bestNameSeries: "1,3,5,6" },
  "1-5": { nature: "Favourable", summary: "Balanced approach to life, excellent communication, overall success", bestNameSeries: "1,3,5,6,9" },
  "1-6": { nature: "Strong", summary: "Material gains and professional success, may prioritise wealth over relationships, marital challenges", bestNameSeries: "1,5,6,9" },
  "1-7": { nature: "Challenging", summary: "Risk of being deceived by loved ones, be cautious who you trust", bestNameSeries: "1,3,5,6" },
  "1-8": { nature: "Struggling", summary: "Success comes after significant hardship. Avoid wearing black clothing", bestNameSeries: "3,5,6" },
  "1-9": { nature: "Very Powerful", summary: "Rise from zero to hero, others may criticise behind the scenes", bestNameSeries: "1,3,5,6,9" },
  
  "2-1": { nature: "Good", summary: "Moody person. Slow but steady success, initial struggles at journey start", bestNameSeries: "1,3,5,6" },
  "2-2": { nature: "Good", summary: "Needs emotional support, gentle, sensitive, prefers solitude over crowds", bestNameSeries: "1,3,5,6" },
  "2-3": { nature: "Positive", summary: "Control anger, advance slowly and thoughtfully to achieve success", bestNameSeries: "1,3,5" },
  "2-4": { nature: "Harmonious", summary: "Inclined to help others, steer clear of controversies and scandals", bestNameSeries: "1,3,5,6" },
  "2-5": { nature: "Promising", summary: "Success if mind stays calm, take care of digestive health", bestNameSeries: "1,3,5,6" },
  "2-6": { nature: "Difficult", summary: "Emotional stress, interpersonal conflicts, marriage challenges, subject to gossip", bestNameSeries: "1,5,6,9" },
  "2-7": { nature: "Favourable", summary: "Numbers harmonise well — good fortune, material success, promising family life", bestNameSeries: "1,3,5,6" },
  "2-8": { nature: "Mixed", summary: "Ambition supported but turbulence in personal relationships, possible second marriage", bestNameSeries: "3,5,6" },
  "2-9": { nature: "Success", summary: "Money, name, fame, and social connections all indicated", bestNameSeries: "1,3,5,6" },

  "3-1": { nature: "Favourable", summary: "Numbers harmonise well — good fortune, material success, promising family life", bestNameSeries: "1,3,5,9" },
  "3-2": { nature: "Mixed", summary: "Success and ambition, turbulence in personal relationships, possible second marriage", bestNameSeries: "1,3,5" },
  "3-3": { nature: "Success", summary: "Money, name, fame, and social connections", bestNameSeries: "1,3,5,9" },
  "3-4": { nature: "Success", summary: "Money, name, fame, and social connections", bestNameSeries: "1,3,5" },
  "3-5": { nature: "Favourable", summary: "Ups and downs but ultimately success is achieved", bestNameSeries: "1,3,5,9" },
  "3-6": { nature: "Favourable", summary: "Speak wisely, keep ego in check, control words — key for success", bestNameSeries: "1,5,9" },
  "3-7": { nature: "Knowledge + Ego", summary: "Strong knowledge but ego hinders success, bluntness, faulty reasoning", bestNameSeries: "1,3,5" },
  "3-8": { nature: "Favourable", summary: "Strong communication skills, may come across as blunt", bestNameSeries: "3,5" },
  "3-9": { nature: "Moderate", summary: "Struggles in life, possible love marriage with challenges", bestNameSeries: "1,3,5,9" },

  "4-1": { nature: "Favourable", summary: "Strong inclination toward research, excellence in spiritual/religious pursuits, challenges in personal life", bestNameSeries: "1,3,5,6" },
  "4-2": { nature: "Average", summary: "Struggles and fluctuations, success needs consistent effort in right direction", bestNameSeries: "1,3,5,6" },
  "4-3": { nature: "Moderate", summary: "Knowledge and inner strength, control aggression, inclined toward social service", bestNameSeries: "1,3,5" },
  "4-4": { nature: "Moderate", summary: "Knowledge and inner strength, control aggression, inclined toward social service", bestNameSeries: "1,3,5,6" },
  "4-5": { nature: "Favourable", summary: "Significant success, strong political potential, regular health check-ups advised", bestNameSeries: "1,3,5,6" },
  "4-6": { nature: "Fair", summary: "Struggle, delayed success, and fluctuations throughout", bestNameSeries: "1,5,6" },
  "4-7": { nature: "Fair", summary: "Delayed success, advisable to keep ego in check", bestNameSeries: "1,3,6" },
  "4-8": { nature: "Mixed", summary: "Ego and lack of clarity obstruct progress", bestNameSeries: "3,5,6" },
  "4-9": { nature: "Decent", summary: "Good communication skills and potential for business success", bestNameSeries: "1,3,5,6" },

  "5-1": { nature: "Strong", summary: "Overall life success, marital issues may arise", bestNameSeries: "1,3,5,6,9" },
  "5-2": { nature: "Promising", summary: "Success comes slowly, decisions taken with care, maintain focus", bestNameSeries: "1,3,5,6" },
  "5-3": { nature: "Good", summary: "Gradual progress, success in communication or media-related professions", bestNameSeries: "1,3,5,9" },
  "5-4": { nature: "Okay", summary: "Revolutionary spirit, strong communication, tendency to challenge rules", bestNameSeries: "1,3,5,6" },
  "5-5": { nature: "Okay", summary: "Gradual success, strong communication skills", bestNameSeries: "1,3,5,6,9" },
  "5-6": { nature: "Excellent", summary: "Proper decisions lead to success, especially in media and film", bestNameSeries: "1,5,6,9" },
  "5-7": { nature: "Average", summary: "Linking with religion leads to better growth", bestNameSeries: "1,3,5,6" },
  "5-8": { nature: "Okay", summary: "Slow success, balance, ongoing struggle", bestNameSeries: "3,5,6" },
  "5-9": { nature: "Fair", summary: "Courage, esteem, and respect from others", bestNameSeries: "1,3,5,6,9" },

  "6-1": { nature: "Okay", summary: "Slow success, balance, ongoing struggle", bestNameSeries: "1,5,6,9" },
  "6-2": { nature: "Good", summary: "Professional and personal growth, possible indecisiveness in some cases", bestNameSeries: "1,5,6" },
  "6-3": { nature: "Average", summary: "No coordination in life, struggle, marriage issues, delayed childbirth", bestNameSeries: "1,5,9" },
  "6-4": { nature: "Promising", summary: "Success through perseverance, need humility and care in relationships", bestNameSeries: "1,5,6" },
  "6-5": { nature: "Excellent", summary: "Strong business acumen, high potential for success", bestNameSeries: "1,5,6,9" },
  "6-6": { nature: "Fair", summary: "Strong sense of ego, well-suited for political roles", bestNameSeries: "1,5,6,9" },
  "6-7": { nature: "Good", summary: "Following dharma leads to success, relationships must be nurtured", bestNameSeries: "1,5,6" },
  "6-8": { nature: "Good", summary: "Gradual progress, stay focused and keep moving in right direction", bestNameSeries: "5,6" },
  "6-9": { nature: "Favourable", summary: "Overall favourable, life's ups and downs, potential issues in marriage", bestNameSeries: "1,5,6,9" },

  "7-1": { nature: "Average", summary: "Calm mind essential, stay rooted in dharma, avoid controversies", bestNameSeries: "1,3,5,6" },
  "7-2": { nature: "Promising", summary: "High potential for success, maintaining harmony in married life is important", bestNameSeries: "1,3,5,6" },
  "7-3": { nature: "Good", summary: "Ideal for researchers, doctors, and engineers — special attention needed in married life", bestNameSeries: "1,3,5" },
  "7-4": { nature: "Challenging", summary: "Struggles and mental unrest expected, patience and focus are key", bestNameSeries: "1,3,5,6" },
  "7-5": { nature: "Good", summary: "Brings success, challenges may arise in married life", bestNameSeries: "1,3,5,6" },
  "7-6": { nature: "Highly Favourable", summary: "Potential to rise from nothing to greatness", bestNameSeries: "1,5,6" },
  "7-7": { nature: "Average", summary: "Potential for spiritual growth, challenges in marriage likely", bestNameSeries: "1,3,5,6" },
  "7-8": { nature: "Promising", summary: "Success through perseverance, favourable for film and luxury industries", bestNameSeries: "3,5,6" },
  "7-9": { nature: "Strong", summary: "Success if balance maintained, well-suited for finance and business", bestNameSeries: "1,3,5,6" },

  "8-1": { nature: "Below Average", summary: "Struggles, challenges in marriage", bestNameSeries: "3,5,6" },
  "8-2": { nature: "Decent", summary: "Overconfidence causes poor decisions, staying grounded in faith helps", bestNameSeries: "3,5,6" },
  "8-3": { nature: "Difficult", summary: "May bring difficulties and disturbed state of mind, need calm and focus", bestNameSeries: "3,5" },
  "8-4": { nature: "Difficult", summary: "Setbacks and missed chances, persistence and resilience required", bestNameSeries: "3,5,6" },
  "8-5": { nature: "Favourable", summary: "Good for business and trade, success comes through communication and adaptability", bestNameSeries: "1,3,5,6" },
  "8-6": { nature: "Good", summary: "Material success and comforts, but relationships require patience and care", bestNameSeries: "5,6" },
  "8-7": { nature: "Average", summary: "Potential for spiritual growth, challenges in marriage", bestNameSeries: "3,5,6" },
  "8-8": { nature: "Challenging", summary: "Struggles, potential difficulties in marriage", bestNameSeries: "3,5,6" },
  "8-9": { nature: "Challenging", summary: "Ego clashes, marital difficulties, possibility of surgery", bestNameSeries: "3,5,6" },

  "9-1": { nature: "Strong", summary: "Promising success, channel energy wisely, stay aligned with right path", bestNameSeries: "1,3,5,6,9" },
  "9-2": { nature: "Average", summary: "Avoid arguments, address marital concerns with care", bestNameSeries: "1,3,5,6,9" },
  "9-3": { nature: "Strong", summary: "Managing anger and ego paves way for definite success", bestNameSeries: "1,3,5,9" },
  "9-4": { nature: "Okay", summary: "Steady potential, success by staying calm and working in right direction", bestNameSeries: "1,3,5,6" },
  "9-5": { nature: "Excellent", summary: "Potential for remarkable success, steady patient effort yields great results", bestNameSeries: "1,3,5,6,9" },
  "9-6": { nature: "Good", summary: "Strong professional success potential, avoid arguments, uphold integrity, mindful of marriage", bestNameSeries: "1,5,6,9" },
  "9-7": { nature: "Average", summary: "Well-suited for spiritual pursuits, social service, religious activities", bestNameSeries: "1,3,5,6,9" },
  "9-8": { nature: "Challenging", summary: "Ongoing struggles, behaviour misunderstood by others", bestNameSeries: "3,5,6" },
  "9-9": { nature: "Average", summary: "Strong energy, suitable for doctor/surgeon/army/police, manage anger", bestNameSeries: "1,3,5,6,9" },
};

export const CHALDEAN_COMPOUND_MEANINGS: Record<number, CompoundNameMeaning> = {
  1: { series: "Sun", verdict: "⚠️ Avoid", summary: "Initial life good, middle age crisis, lonely end", famousExamples: "—" },
  2: { series: "Moon", verdict: "⚠️ Avoid", summary: "Highly emotional, impractical", famousExamples: "—" },
  3: { series: "Jupiter", verdict: "✅ Good", summary: "Very positive, brave, spiritual, respected, high wisdom, good family", famousExamples: "AAA (American Automobile Association)" },
  4: { series: "Rahu", verdict: "❌ Bad", summary: "Talented but all talent goes in vain, constantly bullied, each rise followed by bigger fall", famousExamples: "KIA" },
  5: { series: "Mercury", verdict: "✅ Good", summary: "Resilience, flexibility, academic success, balanced overall life", famousExamples: "Twitter→X Corp, H Company" },
  6: { series: "Venus", verdict: "✅ Good", summary: "Love, good family, slow and steady progress, amiable atmosphere", famousExamples: "Alia Bhatt, ABC Company" },
  7: { series: "Ketu", verdict: "⚠️ Avoid", summary: "Knowledgeable and successful but uncertainties, personal life spoiled", famousExamples: "IBM, BYD, 3M (ok for companies)" },
  8: { series: "Saturn", verdict: "❌ Avoid", summary: "Financial success but destroys personal life, pure Saturn suffering", famousExamples: "Jiah Khan (personal name)" },
  9: { series: "Mars", verdict: "✅ Good", summary: "Initial struggle, later great power, highly determined", famousExamples: "Atal Bihari Vajpayee, AT&T, ICICI" },
  10: { series: "Sun", verdict: "✅ Good", summary: "Dignified, popular, confident, patient, lot of finance. \"Wheel of Fortune\"", famousExamples: "Arijit Singh, TATA (Motors), BP" },
  11: { series: "Moon", verdict: "⚠️ Specific", summary: "Emotional sufferings from near ones, only for specific DOBs with prominent 7", famousExamples: "Sania Mirza, Saina Nehwal" },
  12: { series: "Jupiter", verdict: "⚠️ Avoid", summary: "Power of speech and wisdom but great sacrifice indicated", famousExamples: "BMW, AUDI, SAP (companies ok)" },
  13: { series: "Rahu", verdict: "❌ Bad", summary: "Hardship, health issues, relationship issues, powerful enemies, unexpected sorrowful events", famousExamples: "Divya Bharti (personal), HP, NIKE" },
  14: { series: "Sun", verdict: "⚠️ Special", summary: "Very good for commercial ventures, worldly success, but relationship issues, prone to accidents", famousExamples: "Virat Kohli, BASF, Baidu" },
  15: { series: "Venus", verdict: "✅ Excellent", summary: "Magnetic personality, multiple income sources, creative fields, material success", famousExamples: "Hardik Pandya, Kapil Sharma, UBER, DELL" },
  16: { series: "Moon", verdict: "❌ Avoid", summary: "Great beginning then sudden halt, relationship issues. Good for COMPANIES only", famousExamples: "Sony, Tesla, Barclays" },
  17: { series: "Saturn", verdict: "❌ Avoid", summary: "Immense hardship, constant work, failures convert to permanent prosperity eventually, spiritual", famousExamples: "Salman Khan, Rahul Dravid, EON" },
  18: { series: "Moon", verdict: "❌ Bad", summary: "Dangerous enemies, temperamental, angry, diseases, decay, instability", famousExamples: "Sachin Tendulkar (spiritual path saved him)" },
  19: { series: "Sun", verdict: "✅ Best", summary: "One of best in 1-series. Highly fortunate, regular progress, health, good life partner, luck favours", famousExamples: "Ajit Agarkar, Citibank, ICICI Bank" },
  20: { series: "Moon", verdict: "⚠️ Fine", summary: "Spiritual, reform and liberation, worldly famous but selfish motives = dangerous", famousExamples: "—" },
  21: { series: "Jupiter", verdict: "✅ Good", summary: "Highly determined, steady progress to top, wisdom, victories, honour, success, fame", famousExamples: "Sabyasachi, Walmart, Canon" },
  22: { series: "Rahu", verdict: "❌ Bad", summary: "4-series, hardship, secret enemies, gambling and alcohol tendency, unforeseen circumstances", famousExamples: "—" },
  23: { series: "Mercury", verdict: "✅ Excellent", summary: "Very fortunate, luckiest in 5-series. Successful plans, respect, favours from high positions, recognised talent", famousExamples: "Ratan Tata, Kiran Bedi, Boeing, Toshiba" },
  24: { series: "Venus", verdict: "✅ Very Good", summary: "Favours from high rank & opposite gender, highest positions, good for police/defence/military, creative", famousExamples: "PV Sindhu, Toyota, Wipro, Android" },
  25: { series: "Moon", verdict: "⚠️ Avoid", summary: "Success after 2/3rd of life, peaceful, graceful but not material. Good for companies", famousExamples: "Bill Gates, Aishwarya Rai, Nestle, Apple" },
  26: { series: "Saturn", verdict: "❌ Bad", summary: "Legal trouble, losses in partnership, fortunate but everything can suddenly be lost", famousExamples: "—" },
  27: { series: "Ketu", verdict: "✅ Good", summary: "Spiritual, humanitarian, blessed with wealth, intelligence, power, high ranks. Good for defence/army", famousExamples: "Bob Marley, Karan Johar" },
  28: { series: "Sun", verdict: "⚠️ Special", summary: "Great heights then sudden loss of everything. Excellent for companies. Only if prominent 1 or 4 in DOB", famousExamples: "Akshay Kumar, Katrina Kaif, Google" },
  29: { series: "Moon", verdict: "❌ Avoid", summary: "Legal issues, let down by family and friends, trouble and mental agony, roller coaster life", famousExamples: "Shah Rukh Khan (name now split)" },
  30: { series: "Jupiter", verdict: "✅ Good", summary: "Wisdom, good mind control, mental planes over material, but can use mind to earn well", famousExamples: "Salman Khan, Sanjay Dutt, Metlife" },
  31: { series: "Rahu", verdict: "❌ Avoid", summary: "4-series, Rahu ill-effects remain, though career peaks achieved. Highly unexpected events", famousExamples: "Tom Hanks, Ramalinga Raju, Pfizer" },
  32: { series: "Mercury", verdict: "✅ Excellent", summary: "Powerful in Mercury series. Follow own counsel, genius, unique ideas, youthful forever, communication", famousExamples: "Virat Kohli, Anil Kumble, Vikram Sarabhai" },
  33: { series: "Venus", verdict: "✅ Excellent", summary: "Luxury, security, happiness, passes legacies, eminent in society, ever-lasting wealth, divine grace", famousExamples: "Indira Gandhi, Walt Disney, Unilever" },
  34: { series: "Ketu", verdict: "⚠️ Specific", summary: "7-series, good if DOB favourable, enormous wealth, but family life troubled", famousExamples: "Yuvraj Singh, McDonald's" },
  35: { series: "Saturn", verdict: "❌ Avoid", summary: "Achieves wealth but loses all. Unexpected losses and accidents. Very controversial", famousExamples: "Facebook (now Meta), Twitter Inc (now X Corp)" },
  36: { series: "Mars", verdict: "✅ Good", summary: "Rise in status, live in mansions, travel and success. Family life may suffer", famousExamples: "Dhanraj Pillay, Carrefour" },
  37: { series: "Sun", verdict: "✅ Powerful", summary: "One of most powerful in Sun series. Ordinary family to prominent positions, love success, luxury life", famousExamples: "Bill Clinton, Julia Roberts, AstraZeneca" },
  38: { series: "Moon", verdict: "⚠️ Warning", summary: "Fast business growth, help from influential people, fame and success, BUT hidden dangers and cheating. Best in 2-series", famousExamples: "Amitabh Bachchan, David Beckham, Armani" },
  39: { series: "Jupiter", verdict: "✅ Good", summary: "Sincere, hardworking, works for welfare, fortunate, good for large business", famousExamples: "Mukesh Ambani, Anand Mahindra, Microsoft" },
  40: { series: "Rahu", verdict: "❌ Bad", summary: "Good friends, jewellery and wealth accumulated but all is lost. Life becomes fruitless", famousExamples: "Harshad Mehta, Lata Mangeshkar" },
  41: { series: "Mercury", verdict: "✅ Very Good", summary: "Charming achiever, keen on development, worldly famous, steady success. Avoid ego", famousExamples: "Narendra Modi, Dhirubhai Ambani, Angelina Jolie" },
  42: { series: "Venus", verdict: "✅ Very Good", summary: "Rises from poor to prominent positions, thrifty, charismatic, optimistic, dynamic, good planner", famousExamples: "Shah Rukh Khan, Tiger Woods, Nissan, Bank of America" },
  43: { series: "Ketu", verdict: "❌ Avoid", summary: "Revolutionary, frequent new enemies, job changes, powerful imagination but struggle and trials, no personal gains", famousExamples: "Hrithik Roshan, Salman Rushdie" },
  44: { series: "Saturn", verdict: "❌ Avoid", summary: "Lot of money then sudden halt. Legal actions and prisons possible", famousExamples: "Michael Jackson, Morgan Stanley" },
  45: { series: "Mercury", verdict: "✅ Good", summary: "From lower levels to highest positions, good at handling masses, hard working, fame and wealth, cures diseases", famousExamples: "Suniel Shetty, Deutsche Bank" },
  46: { series: "Sun", verdict: "✅ Favourite", summary: "Prudence, intelligence, knowledge, wisdom, rises like rising Sun, worldwide fame, good family life", famousExamples: "Mark Zuckerberg, Albert Einstein, Honda" },
  47: { series: "Moon", verdict: "✅ Good", summary: "Sudden career leap, highly goal-oriented and fortunate in money matters. Advised: no non-veg, eye care", famousExamples: "Jawaharlal Nehru, Priyanka Chopra, Nagarjuna" },
  48: { series: "Jupiter", verdict: "❌ Avoid", summary: "Opposition from society, unfortunate, goes beyond capacity and creates problems for self", famousExamples: "Kareena Kapoor" },
  49: { series: "Rahu", verdict: "⚠️ Mixed", summary: "Highly rich, worldwide known, huge imagination, but unfortunate incidents too", famousExamples: "Abhishek Bachchan, Johnny Depp, P&G" },
  50: { series: "Mercury", verdict: "✅ Good", summary: "Increases lifespan, brilliant in education, good teachers, very lucky after age 50, fearless", famousExamples: "Sachin Tendulkar, Mercedes Benz, GE" },
  51: { series: "Venus", verdict: "✅ Powerful", summary: "Sudden progress, rise from nowhere to everywhere, restless, always working. Need bodyguards at top", famousExamples: "Nelson Mandela, Shankar Mahadevan" },
  52: { series: "Ketu", verdict: "⚠️ Specific", summary: "Revolutionary, worldly famous if 7 in DOB favourable, spiritual path advised, life ends abruptly", famousExamples: "Morgan Freeman" },
  53: { series: "Saturn", verdict: "❌ Avoid", summary: "Saturn series, success and failures alternate, personal relationships always at a toss", famousExamples: "Virender Sehwag, HP" },
  54: { series: "Mars", verdict: "✅ Good", summary: "Step by step success, prestige and prosperity rising, peaceful end. Don't be greedy", famousExamples: "Warren Buffett, Viswanathan Anand" },
  55: { series: "Mercury", verdict: "✅ Very Good", summary: "Victory, willpower, intuitions, knowledge, wisdom, wealth. Warning: discipline is critical — double Mercury", famousExamples: "George Washington, Standard Chartered" },
  56: { series: "Ketu", verdict: "⚠️ Specific", summary: "Good for occult sciences, fortune and fame, breaks all limits, wealth lost at one point", famousExamples: "Sabyasachi Mukherjee" },
  57: { series: "Jupiter", verdict: "❌ Avoid", summary: "Initial success then gradual downfall", famousExamples: "—" },
  58: { series: "Rahu", verdict: "⚠️ Specific", summary: "Outstanding fame, achiever, pious, but inner fears. Only if prominent 1 in DOB", famousExamples: "Ramoji Rao" },
  59: { series: "Mercury", verdict: "✅ Good", summary: "Writers excel, rich, excellent public support, highly fortunate, but nervous issues possible", famousExamples: "Reliance Industries" },
  60: { series: "Venus", verdict: "✅ Very Good", summary: "Peace, prosperity, fine arts, balance, wisdom, good family life, fulfilled life", famousExamples: "Steven Spielberg, Navjot Singh Sidhu" },
  61: { series: "Moon", verdict: "⚠️ Specific", summary: "Name, fame and money but family life problematic. Only good for prominent-2 DOB", famousExamples: "Leonardo DiCaprio" },
  62: { series: "Saturn", verdict: "❌ Avoid", summary: "Saturn, never use for naming. Hidden dangers, relationship issues, enemies", famousExamples: "Jennifer Lopez" },
  63: { series: "Ketu", verdict: "❌ Avoid", summary: "Tends to bring people to wrong path", famousExamples: "—" },
  64: { series: "Sun", verdict: "✅ Very Good", summary: "Extraordinary willpower, intelligence, knowledge, fame, power. Good for prominent 1, 2, 4 DOB", famousExamples: "Deepika Padukone" },
  65: { series: "Moon", verdict: "✅ Good", summary: "Divine grace, spirituality, earns support from people, happy married life, but accidents possible", famousExamples: "Samantha Ruth Prabhu" },
  66: { series: "Jupiter", verdict: "✅ Very Good", summary: "Double Venus makes Jupiter, excellent results. Dynamism, fine arts, support from high ranks, comfortable life", famousExamples: "MS Dhoni, Johnson & Johnson" },
  67: { series: "Rahu", verdict: "❌ Avoid", summary: "Only for artists. Doesn't work for selfish people. 4-series ill effects remain", famousExamples: "—" },
  68: { series: "Mercury", verdict: "❌ Avoid (in 5 series)", summary: "Brings everything down suddenly — never use", famousExamples: "Goldman Sachs" },
  69: { series: "Venus", verdict: "✅ Good", summary: "Topmost position in any business, majestic, prosperous, lavish, charming speech, good friends", famousExamples: "Royal Bank of Scotland" },
  70: { series: "Moon", verdict: "❌ Avoid", summary: "Disappointments, failures, extreme emotions. Good for companies", famousExamples: "National Australia Bank" },
  71: { series: "Saturn", verdict: "❌ Avoid", summary: "Prosperity with initial struggles, intelligent counsellors, but lacks confidence and clarity", famousExamples: "—" },
  72: { series: "Mars", verdict: "✅ One of Best", summary: "Initial struggles then life filled with comforts, joy, wealth passed to generations, powerful for businessmen", famousExamples: "PV Sindhu, Taiwan Semiconductor" },
  73: { series: "Sun", verdict: "✅ Good", summary: "Growth, wealth, fame, power, life comforts, support from higher ranks, honest, good family life", famousExamples: "Mitsubishi UFJ" },
  74: { series: "Rahu", verdict: "❌ Poor", summary: "Religious people, have less money, suits only priests and hermits", famousExamples: "United Health Group" },
  75: { series: "Jupiter", verdict: "✅ Good", summary: "Fame, good friends, wealth, intelligence, passion, brilliance, calmness, writing skills", famousExamples: "—" },
  76: { series: "Moon", verdict: "❌ Avoid", summary: "Loses all money at one point, risks, emotional challenges", famousExamples: "—" },
  77: { series: "Ketu", verdict: "✅ Good", summary: "Self-confidence, hard work, support, profits, fame, honour, travel. Can be given when DOB unknown", famousExamples: "Arnold Schwarzenegger, Glencore" },
  78: { series: "Venus", verdict: "✅ Brilliant", summary: "Religious, righteous, generous, humanitarian, wonders in occult sciences, respected forever, very wealthy but not materialistic", famousExamples: "—" },
  79: { series: "Ketu", verdict: "⚠️ Avoid", summary: "Suffering in initial life then sudden rise, clever, strong willpower. Good for prominent 2. 7-series = family issues", famousExamples: "Infosys Technologies" },
  80: { series: "Saturn", verdict: "❌ Avoid", summary: "Loner, no personal life, grave dangers, anxieties, hardships", famousExamples: "Lloyds Banking Group" },
  81: { series: "Sun", verdict: "✅ Good", summary: "Fortune, wealth, good positions, all-round development. Be careful in decisions, good teachers", famousExamples: "Zurich Insurance Group" },
  82: { series: "Moon", verdict: "⚠️ Debatable", summary: "Debatable — avoid", famousExamples: "—" },
  83: { series: "Moon", verdict: "✅ Good", summary: "High ranks and respect, power and authority, political success", famousExamples: "Sumitomo Mitsui" },
  84: { series: "Rahu", verdict: "❌ Avoid", summary: "Initial struggles, unnecessary enemies, slow reward for efforts. Good for prominent 3 DOB only", famousExamples: "—" },
  85: { series: "Rahu", verdict: "❌ Avoid", summary: "With determination reaches heights, helps others, good in medicine but 4-series ill effects", famousExamples: "—" },
  86: { series: "Mercury", verdict: "✅ Good", summary: "Gradual growth, deserves what they get, favoured by rich, comfortable life", famousExamples: "—" },
  87: { series: "Ketu", verdict: "❌ Bad", summary: "Connected to mystic powers, money earned by devious/illegal means, related to criminals", famousExamples: "—" },
  88: { series: "Saturn", verdict: "⚠️ Spiritual", summary: "Connected to spirituality, generous, compassionate, popular and liked", famousExamples: "—" },
  89: { series: "Saturn", verdict: "❌ Avoid", summary: "Initial problems, wealth and property later, women with this name respected", famousExamples: "—" },
  90: { series: "Mars", verdict: "✅ Good", summary: "Victory to all plans, very wealthy and famous", famousExamples: "—" },
  91: { series: "Sun", verdict: "✅ Good", summary: "Strong determination, profitable travels, marine trade brings wealth, yoga and meditation excellence", famousExamples: "—" },
  92: { series: "Moon", verdict: "✅ Special", summary: "Mental plane power, possible Astral projection abilities, gold, silver, land wealth", famousExamples: "—" },
  93: { series: "Jupiter", verdict: "✅ Good", summary: "Knowledgeable, marvellous achiever, drama and theatre fame, dignified lives, all wishes fulfilled", famousExamples: "—" },
  94: { series: "Rahu", verdict: "⚠️ Avoid", summary: "4-series but humanitarian and reformer, work remembered after death", famousExamples: "—" },
  95: { series: "Mercury", verdict: "✅ Good", summary: "Success in trade, wealth accumulation, disciplined life, honour, good oratory skills", famousExamples: "—" },
  96: { series: "Venus", verdict: "✅ Good", summary: "High education, prosperity, all desires fulfilled, fine arts, fortunate", famousExamples: "—" },
  97: { series: "Ketu", verdict: "✅ Special", summary: "Spirituality, fine arts and scriptures, successful and prosperous in chosen field", famousExamples: "—" },
  98: { series: "Saturn", verdict: "❌ Bad", summary: "Full of worries and desires, intelligent but intelligence wasted, chronic diseases", famousExamples: "—" },
  99: { series: "Mars", verdict: "❌ Bad", summary: "Success with enmity together, devious nature", famousExamples: "—" },
  100: { series: "Sun", verdict: "⚠️ Average", summary: "Comfortable and successful but less opportunities, not major achievements, good for simple living", famousExamples: "—" },
  101: { series: "Sun", verdict: "❌ Bad", summary: "Unfortunate, help from authority but regular obstacles in business and life", famousExamples: "—" },
  102: { series: "Jupiter", verdict: "❌ Bad", summary: "Initial success then struggles with confusion throughout", famousExamples: "—" },
  103: { series: "Rahu", verdict: "⚠️ Okay", summary: "Material success but always facing competition, later years pleasant", famousExamples: "—" },
  104: { series: "Rahu", verdict: "❌ Bad", summary: "Achievements and fame but no material success", famousExamples: "—" },
  105: { series: "Venus", verdict: "✅ Good", summary: "Wealth, fortune, fame", famousExamples: "—" },
  106: { series: "Moon", verdict: "❌ Bad", summary: "Problems throughout, drastic life changes", famousExamples: "—" },
  107: { series: "Ketu", verdict: "❌ Bad", summary: "Name and fame but issues from opposite gender, uncomfortable life", famousExamples: "—" },
  108: { series: "Saturn", verdict: "✅ Fortunate", summary: "Very fortunate — success, high positions, fulfilled desires (sacred number 108)", famousExamples: "—" },
};

export const LO_SHU_PLANES = {
  mental: {
    name: "Mental / Intellectual Plane",
    numbers: [4, 9, 2],
    full: "Far-sighted, genius, good intellect, excellent memory, full of logic and analysis",
    empty: "Memory loss, impulsiveness, poor analytical thinking",
    partial: "Moderate intellectual ability, some analytical gaps"
  },
  emotional: {
    name: "Emotional / Spiritual Plane",
    numbers: [3, 5, 7],
    full: "Takes decisions from heart, calm from inside, good feelings for others, religious, spiritual, strong intuitions, good healing ability",
    empty: "Loneliness, appears aloof even when surrounded by people, cannot appreciate others, lack of motivation",
    partial: "Selective emotional awareness"
  },
  practical: {
    name: "Practical Plane",
    numbers: [8, 1, 6],
    full: "Strong life purpose, moves toward targets decisively, excellent in business, always interested in earning money",
    empty: "Highly impractical behavior, keeps dreaming about overnight riches, unable to execute plans",
    partial: "Some practicality but inconsistent"
  },
  thought: {
    name: "Thought Power Plane",
    numbers: [4, 3, 8],
    full: "Full of ideas, knows how to implement with proper planning, good visionary, can succeed in politics and sales",
    empty: "Lots of confusion, lacks thought power, missing logic, no belief in long-term planning, wants everything immediately",
    partial: "Moderate planning ability but lacks consistent vision"
  },
  will: {
    name: "Will Power Plane",
    numbers: [9, 5, 1],
    full: "Very stubborn in a good way, highly diligent, consistently moves toward goal, never-give-up attitude, highly adjusting in any situation",
    empty: "Lack of willpower, gives up easily, unable to sustain effort, no clear direction",
    partial: "Inconsistent willpower, starts strong but gets distracted"
  },
  action: {
    name: "Action Plane",
    numbers: [2, 7, 6],
    full: "Always in action mode. \"Let us get this done\" attitude. Good at sports and physical activities, always doing something, ready to take risks",
    empty: "Misses opportunities, not ready to take risks, indecisiveness, inactive",
    partial: "Tends to act but may lack execution focus or wait too long"
  },
  golden: {
    name: "🌟 Golden Yog / Maha Yog",
    numbers: [4, 5, 6],
    full: "At any point in life this person will reach heights. Very kind, respects others' feelings, popular, good reputation, a gentleman who loves to help others — this is the most powerful diagonal",
    empty: "Self-doubt, negative thinking about success, whimsical nature, moody",
    partial: "Incomplete Golden Yog — needs balancing names or Vastu to unlock full potential"
  },
  silver: {
    name: "🌟 Silver Yog",
    numbers: [2, 5, 8],
    full: "Very strong willpower, can do any work, lots of property and land in their name, immense patience",
    empty: "Many disappointments, failures, and cheating experiences",
    partial: "Incomplete Silver Yog — property opportunities or patience may fluctuate"
  }
};

export const MISSING_REMEDIES: Record<number, { planet: string; lacking: string; remedies: string[] }> = {
  1: {
    planet: "Sun",
    lacking: "Problem expressing identity. Indecisive, no ego, loves helping others but unfulfilled self",
    remedies: [
      "Drink more water daily.",
      "Place a water fountain in the North direction of home.",
      "Use a Red or Orange handkerchief."
    ]
  },
  2: {
    planet: "Moon",
    lacking: "Emotionally imbalanced, impatient, lacking intuition, not punctual, blames others for own mistakes",
    remedies: [
      "Use a non-pointed mountain image (without water) at South-West direction.",
      "Wear a Clear Quartz (Sphatik) bracelet.",
      "Use a White handkerchief."
    ]
  },
  3: {
    planet: "Jupiter",
    lacking: "Lacks confidence, cannot recognise own potential, not capable of handling situations",
    remedies: [
      "Place a green plant at East direction.",
      "Wear a Rudraksh or Tulsi mala/bracelet.",
      "Use a Yellow handkerchief."
    ]
  },
  4: {
    planet: "Rahu",
    lacking: "Lacks planning, organisation, discipline, and motivation. Cannot take full advantage of knowledge, contacts, or family",
    remedies: [
      "Place a green plant in South-East.",
      "Wear a Rudraksh or Tulsi mala/bracelet.",
      "Use a Light Blue handkerchief."
    ]
  },
  5: {
    planet: "Mercury",
    lacking: "Problems achieving goals, always needs others' help, difficulty adapting to environments, struggles managing money and emotions",
    remedies: [
      "Wear a Clear Quartz (Sphatik) bracelet.",
      "Use a Green handkerchief.",
      "Walk on green grass daily and stay connected to earth element."
    ]
  },
  6: {
    planet: "Venus",
    lacking: "No help from family or people, no family bonding, trouble in family life, lack of luxury and material pleasures, poor love life",
    remedies: [
      "Use a golden dial and golden strap watch.",
      "Use a golden/yellow wind-chime of 6 rods in the North-West direction.",
      "Use a Pink or Cream handkerchief."
    ]
  },
  7: {
    planet: "Ketu",
    lacking: "Lacks spirituality, doesn't care about others' feelings, disorganised, no faith in God",
    remedies: [
      "Use a silver dial, silver strap watch.",
      "Silver wind-chime of 5-6-7 rods in the West direction.",
      "Use a Grey handkerchief."
    ]
  },
  8: {
    planet: "Saturn",
    lacking: "Cannot recognise others, not good at financial matters, leaves jobs incomplete, careless, easily believes others",
    remedies: [
      "Wear a Clear Quartz (Sphatik) bracelet.",
      "Use a Dark Blue handkerchief."
    ]
  },
  9: {
    planet: "Mars",
    lacking: "Does not respect others' feelings, ignores others' needs, not calm, easily distracted, selfish",
    remedies: [
      "Wear a Red Kalawa (thread) from a temple.",
      "Use a Red handkerchief."
    ]
  }
};

export interface LifePathCompatibility {
  archetype: string;
  keywords: string[];
  ruling_planet: string;
  compatibility: number[];
  strengths: string[];
  challenges: string[];
  careers: string[];
  luckyColors: string[];
  luckyDays: string[];
}

export interface DestinyCompatibility {
  archetype: string;
  keywords: string[];
  gifts: string[];
  lessons: string[];
  guidance: string;
}

export interface LoShuCompatibility {
  planet: string;
  direction: string;
  element: string;
  color: string;
  bodyPart: string;
}

export interface MissingRemedyCompatibility {
  focus: string;
  practices: string[];
  affirmation: string;
}

export interface PersonalYearCompatibility {
  theme: string;
  focus: string;
  bestMonths: number[];
  challengeMonths: number[];
}

export interface VehicleVibrationCompatibility {
  theme: string;
  bestFor: string[];
  caution: string;
}

export const LIFE_PATH_MEANINGS: Record<number, LifePathCompatibility> = {
  1: { archetype: "The Leader", keywords: ["independence", "ambition", "originality", "courage"], ruling_planet: "Sun", compatibility: [3, 5, 9], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  2: { archetype: "The Peacemaker", keywords: ["diplomacy", "sensitivity", "cooperation", "intuition"], ruling_planet: "Moon", compatibility: [4, 6, 8], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  3: { archetype: "The Communicator", keywords: ["creativity", "expression", "joy", "optimism"], ruling_planet: "Jupiter", compatibility: [1, 6, 9], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  4: { archetype: "The Builder", keywords: ["stability", "discipline", "practicality", "loyalty"], ruling_planet: "Rahu", compatibility: [2, 6, 8], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  5: { archetype: "The Free Spirit", keywords: ["freedom", "adventure", "versatility", "change"], ruling_planet: "Mercury", compatibility: [1, 3, 7], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  6: { archetype: "The Nurturer", keywords: ["responsibility", "love", "service", "harmony"], ruling_planet: "Venus", compatibility: [2, 3, 9], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  7: { archetype: "The Seeker", keywords: ["wisdom", "spirituality", "analysis", "introspection"], ruling_planet: "Ketu", compatibility: [4, 5, 9], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  8: { archetype: "The Powerhouse", keywords: ["ambition", "authority", "material success", "karma"], ruling_planet: "Saturn", compatibility: [2, 4, 6], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  9: { archetype: "The Humanitarian", keywords: ["compassion", "wisdom", "service", "completion"], ruling_planet: "Mars", compatibility: [1, 3, 6], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  11: { archetype: "The Visionary (Master)", keywords: ["intuition", "inspiration", "illumination"], ruling_planet: "Moon/Uranus", compatibility: [2, 4], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  22: { archetype: "The Master Builder", keywords: ["legacy", "scale", "manifestation"], ruling_planet: "Uranus/Saturn", compatibility: [4, 11], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
  33: { archetype: "The Master Teacher", keywords: ["compassion", "healing", "devotion"], ruling_planet: "Jupiter/Venus", compatibility: [6, 22], strengths: [], challenges: [], careers: [], luckyColors: [], luckyDays: [] },
};

export const DESTINY_MEANINGS: Record<number, DestinyCompatibility> = {
  1: { archetype: "The Pioneer Voice", keywords: ["authority"], gifts: [], lessons: [], guidance: "Build a name that lets you lead without isolating yourself." },
  2: { archetype: "The Diplomat Voice", keywords: ["harmony"], gifts: [], lessons: [], guidance: "Use your name energy to create trust and collaboration." },
  3: { archetype: "The Creative Voice", keywords: ["expression"], gifts: [], lessons: [], guidance: "Let your words, art, and presence carry your purpose." },
  4: { archetype: "The Builder Voice", keywords: ["order"], gifts: [], lessons: [], guidance: "Choose practical plans and steady commitments." },
  5: { archetype: "The Messenger Voice", keywords: ["freedom"], gifts: [], lessons: [], guidance: "Use change as a channel, not an escape route." },
  6: { archetype: "The Harmoniser Voice", keywords: ["service"], gifts: [], lessons: [], guidance: "Let care and aesthetics become constructive leadership." },
  7: { archetype: "The Mystic Voice", keywords: ["wisdom"], gifts: [], lessons: [], guidance: "Turn private wisdom into clear, useful guidance." },
  8: { archetype: "The Executive Voice", keywords: ["power"], gifts: [], lessons: [], guidance: "Let material success serve a larger purpose." },
  9: { archetype: "The Humanitarian Voice", keywords: ["service"], gifts: [], lessons: [], guidance: "Make compassion practical and sustainable." },
  11: { archetype: "The Inspired Messenger", keywords: ["vision"], gifts: [], lessons: [], guidance: "Carry inspiration through disciplined expression." },
  22: { archetype: "The Master Architect", keywords: ["legacy"], gifts: [], lessons: [], guidance: "Give your vision a real-world structure." },
  33: { archetype: "The Compassionate Teacher", keywords: ["healing"], gifts: [], lessons: [], guidance: "Serve deeply while keeping your own life nourished." },
};

export const SOUL_URGE_MEANINGS: Record<number, DestinyCompatibility> = DESTINY_MEANINGS;

export const LO_SHU_NUMBER_MEANINGS: Record<number, LoShuCompatibility> = {
  1: { planet: "Sun", direction: "North", element: "Water", color: "Orange", bodyPart: "Heart" },
  2: { planet: "Moon", direction: "Southwest", element: "Earth", color: "White", bodyPart: "Stomach" },
  3: { planet: "Jupiter", direction: "East", element: "Wood", color: "Yellow", bodyPart: "Liver" },
  4: { planet: "Rahu", direction: "Southeast", element: "Wood", color: "Blue", bodyPart: "Nerves" },
  5: { planet: "Mercury", direction: "Centre", element: "Earth", color: "Green", bodyPart: "Skin" },
  6: { planet: "Venus", direction: "Northwest", element: "Metal", color: "Pink", bodyPart: "Throat" },
  7: { planet: "Ketu", direction: "West", element: "Metal", color: "Purple", bodyPart: "Feet" },
  8: { planet: "Saturn", direction: "Northeast", element: "Earth", color: "Dark blue", bodyPart: "Bones" },
  9: { planet: "Mars", direction: "South", element: "Fire", color: "Red", bodyPart: "Blood" },
};

export const MISSING_NUMBER_REMEDIES: Record<number, MissingRemedyCompatibility> = {
  1: { focus: "Self-identity", practices: ["Drink water daily"], affirmation: "I lead my life." },
  2: { focus: "Emotional balance", practices: ["Quartz bracelet"], affirmation: "I trust my sensitivity." },
  3: { focus: "Confidence", practices: ["Green plant at East"], affirmation: "My voice brings joy." },
  4: { focus: "Organisation", practices: ["Green plant in Southeast"], affirmation: "I build steady foundations." },
  5: { focus: "Goal achievement", practices: ["Sphatik bracelet"], affirmation: "I adapt with ease." },
  6: { focus: "Family bonding", practices: ["Golden strap watch"], affirmation: "I create harmony." },
  7: { focus: "Spirituality", practices: ["Silver strap watch"], affirmation: "I trust inner wisdom." },
  8: { focus: "Financial maturity", practices: ["Quartz bracelet"], affirmation: "I use power with patience." },
  9: { focus: "Courage", practices: ["Red Kalawa thread"], affirmation: "I release the past." },
};

export const PERSONAL_YEAR_THEMES: Record<number, PersonalYearCompatibility> = {
  1: { theme: "New Beginnings", focus: "Start fresh, initiate plans, and choose independence.", bestMonths: [1, 3, 5, 10], challengeMonths: [7, 9] },
  2: { theme: "Partnership & Patience", focus: "Cooperate, refine, listen, and strengthen relationships.", bestMonths: [2, 6, 8, 11], challengeMonths: [1, 5] },
  3: { theme: "Expression & Visibility", focus: "Create, communicate, socialise, and share your message.", bestMonths: [3, 6, 9, 12], challengeMonths: [4, 8] },
  4: { theme: "Structure & Discipline", focus: "Build foundations, organise money, and commit to routines.", bestMonths: [1, 4, 8, 10], challengeMonths: [3, 5] },
  5: { theme: "Change & Freedom", focus: "Travel, adapt, experiment, and welcome new opportunities.", bestMonths: [3, 5, 7, 9], challengeMonths: [4, 6] },
  6: { theme: "Love & Responsibility", focus: "Care for home, family, health, and meaningful commitments.", bestMonths: [2, 6, 9, 11], challengeMonths: [5, 8] },
  7: { theme: "Reflection & Wisdom", focus: "Study, heal, research, and listen to inner guidance.", bestMonths: [2, 7, 9, 11], challengeMonths: [1, 5] },
  8: { theme: "Power & Harvest", focus: "Lead, manage resources, make business decisions, and claim results.", bestMonths: [1, 4, 8, 10], challengeMonths: [2, 7] },
  9: { theme: "Completion & Release", focus: "Finish cycles, forgive, declutter, and prepare for renewal.", bestMonths: [3, 6, 9, 12], challengeMonths: [1, 8] },
};

export const VEHICLE_VIBRATION_MEANINGS: Record<number, VehicleVibrationCompatibility> = {
  1: { theme: "Status & Leadership", bestFor: ["business owners"], caution: "Avoid ego-driven speed." },
  2: { theme: "Comfort & Harmony", bestFor: ["family travel"], caution: "Emotionally influenced." },
  3: { theme: "Joy & Movement", bestFor: ["creative work"], caution: "Keep focus." },
  4: { theme: "Stability & Duty", bestFor: ["work vehicles"], caution: "Can feel heavy." },
  5: { theme: "Freedom & Speed", bestFor: ["sales"], caution: "Watch restlessness." },
  6: { theme: "Family & Luxury", bestFor: ["family cars"], caution: "Maintenance matters." },
  7: { theme: "Solitude & Protection", bestFor: ["spiritual travel"], caution: "Isolated." },
  8: { theme: "Power & Karma", bestFor: ["executives"], caution: "Upkeep and mature driving." },
  9: { theme: "Courage & Service", bestFor: ["public service"], caution: "Avoid aggression." },
};
