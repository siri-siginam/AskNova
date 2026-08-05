import { FAQItem, MatchResult, CategoryName } from '../types';

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while',
  'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
  'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'tell', 'please', 'know'
]);

function normalizeWord(word: string): string {
  let w = word.toLowerCase().trim();
  if (w.endsWith('ies') && w.length > 4) w = w.slice(0, -3) + 'y';
  else if (w.endsWith('es') && w.length > 3) w = w.slice(0, -2);
  else if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) w = w.slice(0, -1);
  else if (w.endsWith('ing') && w.length > 4) w = w.slice(0, -3);
  else if (w.endsWith('ed') && w.length > 4) w = w.slice(0, -2);
  return w;
}

export function preprocessText(text: string): string[] {
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const tokens = cleanText.split(/\s+/).filter(t => t.length > 1);
  return tokens.map(normalizeWord).filter(t => !STOP_WORDS.has(t));
}

export function extractRawTokens(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 1);
}

export class NLPMatchingEngine {
  private faqs: FAQItem[] = [];

  constructor(faqs: FAQItem[]) {
    this.updateDataset(faqs);
  }

  public updateDataset(faqs: FAQItem[]) {
    this.faqs = faqs;
  }

  public findBestMatch(userQuery: string): MatchResult {
    const normalizedQuery = userQuery.trim().toLowerCase();

const exactFaq = this.faqs.find(faq =>
  faq.question.trim().toLowerCase() === normalizedQuery ||
  (faq.canonicalQuestions || []).some(
    q => q.trim().toLowerCase() === normalizedQuery
  )
);

if (exactFaq) {
  return {
    matchedFaq: exactFaq,
    confidenceScore: 1,
    isAiFallback: false,
    alternativeMatches: []
  };
}
    const queryTokens = preprocessText(userQuery);
    const rawQueryTokens = extractRawTokens(userQuery);

    if (queryTokens.length === 0 && rawQueryTokens.length === 0) {
      return {
        matchedFaq: null,
        confidenceScore: 0,
        isAiFallback: true,
        alternativeMatches: []
      };
    }

    const scoredFaqs: Array<{ faq: FAQItem; score: number }> = [];

    for (const faq of this.faqs) {
      const qTokens = preprocessText(faq.question);
      const subCatTokens = preprocessText(faq.subcategory);
      const catTokens = preprocessText(faq.category);
      const tagTokens = faq.tags.flatMap(t => preprocessText(t));
      const canonicalTokens = (faq.canonicalQuestions || []).flatMap(c => preprocessText(c));
      const answerTokens = preprocessText(faq.answer);

      // Jaccard token overlap
      let tokenOverlapScore = 0;
      let matchedTokenCount = 0;

      for (const qToken of queryTokens) {
        if (qTokens.includes(qToken)) {
          matchedTokenCount += 3;
        } else if (canonicalTokens.includes(qToken)) {
          matchedTokenCount += 3;
        } else if (tagTokens.includes(qToken)) {
          matchedTokenCount += 2.5;
        } else if (subCatTokens.includes(qToken) || catTokens.includes(qToken)) {
          matchedTokenCount += 2;
        } else if (answerTokens.includes(qToken)) {
          matchedTokenCount += 1;
        }
      }

      if (queryTokens.length > 0) {
        tokenOverlapScore = matchedTokenCount / (queryTokens.length * 3);
      }

      // Exact raw string inclusions
      const lowerQuery = userQuery.toLowerCase().trim();
      const lowerQuestion = faq.question.toLowerCase().trim();
      let phraseScore = 0;

      if (lowerQuestion.includes(lowerQuery) || lowerQuery.includes(lowerQuestion)) {
        phraseScore += 0.8;
      }

      // Tag exact match boost
      for (const tag of faq.tags) {
        const lowerTag = tag.toLowerCase().trim();
        if (lowerQuery.includes(lowerTag)) {
          phraseScore += 0.3;
        }
      }

      const totalScore = Math.min(1.0, tokenOverlapScore * 0.65 + phraseScore * 0.35);

      if (totalScore > 0.05) {
        scoredFaqs.push({ faq, score: totalScore });
      }
    }

    // Sort by score descending
    scoredFaqs.sort((a, b) => b.score - a.score);

    if (scoredFaqs.length === 0) {
      return {
        matchedFaq: null,
        confidenceScore: 0,
        isAiFallback: true,
        alternativeMatches: [],
        queryCategoryGuess: this.guessCategory(rawQueryTokens)
      };
    }

    const topMatch = scoredFaqs[0];
    const HIGH_CONFIDENCE_THRESHOLD = 0.75;

    const alternatives = scoredFaqs.slice(1, 4);

    if (topMatch.score >= HIGH_CONFIDENCE_THRESHOLD) {
      return {
        matchedFaq: topMatch.faq,
        confidenceScore: Math.round(topMatch.score * 100) / 100,
        isAiFallback: false,
        alternativeMatches: alternatives
      };
    }

    // Medium or Low confidence: flag for AI synthesis + alternatives
    return {
      matchedFaq: topMatch.score >= 0.18 ? topMatch.faq : null,
      confidenceScore: Math.round(topMatch.score * 100) / 100,
      isAiFallback: true,
      alternativeMatches: scoredFaqs.slice(0, 3),
      queryCategoryGuess: this.guessCategory(rawQueryTokens)
    };
  }

  private guessCategory(rawTokens: string[]): CategoryName | undefined {
    const categoryKeywords: Record<CategoryName, string[]> = {
      'Geography': ['capital', 'river', 'mountain', 'country', 'desert', 'ocean', 'france', 'japan', 'everest', 'paris', 'tokyo'],
      'Education': ['exam', 'jee', 'neet', 'gre', 'sat', 'study', 'pomodoro', 'school', 'marks', 'college'],
      'Programming & Coding': ['code', 'python', 'javascript', 'react', 'git', 'github', 'const', 'let', 'var', 'stack', 'queue', 'html', 'css'],
      'Universities & Schools': ['gpa', 'ivy league', 'harvard', 'yale', 'university', 'tuition', 'degree'],
      'Technology': ['ai', 'machine learning', 'cloud', 'aws', 'phishing', 'cybersecurity', 'software'],
      'Products & Shopping': ['warranty', 'guarantee', 'price', 'shopping', 'amazon', 'discount', 'refund'],
      'Health & Fitness': ['bmi', 'sleep', 'exercise', 'aerobic', 'anaerobic', 'weight', 'calories', 'health', 'diet'],
      'Banking & Finance': ['credit score', 'cibil', 'upi', 'bank', 'savings', 'checking', 'account', 'loan'],
      'Stock Market & Investments': ['sip', 'mutual fund', 'stocks', 'bonds', 'etf', 'nifty', 'shares', 'investing'],
      'Astrology': ['zodiac', 'horoscope', 'sun sign', 'moon sign', 'aries', 'taurus', 'astrology'],
      'Agriculture': ['irrigation', 'farming', 'crop', 'soil', 'drip', 'agriculture', 'organic'],
      'Government Services': ['passport', 'pan', 'ssn', 'tax', 'license', 'visa', 'government'],
      'Transportation': ['ev', 'charger', 'electric vehicle', 'metro', 'train', 'flight', 'traffic'],
      'Tourism': ['flight', 'travel', 'hotel', 'booking', 'tourism', 'vacation', 'trip'],
      'Food': ['vegan', 'vegetarian', 'food', 'nutrition', 'recipe', 'cooking'],
      'History': ['history', 'war', 'ancient', 'indus valley', 'harappa', 'empire', 'century'],
      'Culture': ['language', 'mandarin', 'festival', 'culture', 'art', 'tradition'],
      'Sports': ['cricket', 'football', 'olympics', 'sports', 'match', 't20'],
      'Business': ['mvp', 'startup', 'business', 'company', 'profit', 'revenue', 'marketing'],
      'Science': ['photosynthesis', 'newton', 'physics', 'biology', 'chemistry', 'gravity', 'atoms'],
      'General Knowledge': ['leap year', 'light bulb', 'edison', 'calendar', 'inventions', 'facts']
    };

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      for (const kw of keywords) {
        if (rawTokens.includes(kw)) {
          return cat as CategoryName;
        }
      }
    }
    return undefined;
  }
}
