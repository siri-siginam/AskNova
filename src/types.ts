export type CategoryName =
  | 'Geography'
  | 'Education'
  | 'Programming & Coding'
  | 'Universities & Schools'
  | 'Technology'
  | 'Products & Shopping'
  | 'Health & Fitness'
  | 'Banking & Finance'
  | 'Stock Market & Investments'
  | 'Astrology'
  | 'Agriculture'
  | 'Government Services'
  | 'Transportation'
  | 'Tourism'
  | 'Food'
  | 'History'
  | 'Culture'
  | 'Sports'
  | 'Business'
  | 'Science'
  | 'General Knowledge';

export interface FAQItem {
  id: string;
  category: CategoryName;
  subcategory: string;
  question: string;
  answer: string;
  tags: string[];
  canonicalQuestions?: string[];
}

export interface MatchResult {
  matchedFaq: FAQItem | null;
  confidenceScore: number; // 0 to 1
  isAiFallback: boolean;
  alternativeMatches: Array<{
    faq: FAQItem;
    score: number;
  }>;
  aiGroundedAnswer?: string;
  queryCategoryGuess?: CategoryName;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  matchResult?: MatchResult;
  feedback?: 'helpful' | 'unhelpful' | null;
  isTyping?: boolean;
}

export interface FAQStats {
  totalFaqs: number;
  categoryCounts: Record<string, number>;
  totalQueriesAnswered: number;
  helpfulCount: number;
  unhelpfulCount: number;
}

export interface CreateFAQDTO {
  category: CategoryName;
  subcategory: string;
  question: string;
  answer: string;
  tags: string[];
}
