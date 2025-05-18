export interface ReviewHistory {
  date: string;
  result: 'correct' | 'incorrect';
  quality: number;
}

export interface ReviewStats {
  total: number;
  correct: number;
  lastReviewDate: string | null;
  lastResult: 'correct' | 'incorrect' | null;
  history: ReviewHistory[];
}

export interface Card {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
  audioUrl?: string;
  createdAt: string;
  nextReview: string | null;
  easeFactor: number;
  interval: number;
  repetitions: number;
  reviewStats?: ReviewStats;
}

export const calculateNextReview = (card: Card, quality: number): Card => {
  const { easeFactor, interval, repetitions } = card;
  
  // Update ease factor
  const newEaseFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  
  // Update interval and repetitions
  let newInterval: number;
  let newRepetitions: number;
  
  if (quality >= 3) {
    if (repetitions === 0) {
      newInterval = 1;
      newRepetitions = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
      newRepetitions = 2;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
      newRepetitions = repetitions + 1;
    }
  } else {
    newInterval = 1;
    newRepetitions = 0;
  }
  
  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);
  
  return {
    ...card,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview: nextReview.toISOString(),
  };
}; 