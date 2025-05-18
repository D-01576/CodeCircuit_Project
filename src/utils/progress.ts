import { Card } from './sm2';

export interface ProgressStats {
  totalCards: number;
  dueCards: number;
  masteredCards: number;
  learningCards: number;
  newCards: number;
  streak: number;
  accuracy: number;
  lastReviewDate: Date | null;
}

export interface DailyProgress {
  date: Date;
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
}

export const calculateProgressStats = (cards: Card[]): ProgressStats => {
  const now = new Date();
  const stats: ProgressStats = {
    totalCards: cards.length,
    dueCards: 0,
    masteredCards: 0,
    learningCards: 0,
    newCards: 0,
    streak: 0,
    accuracy: 0,
    lastReviewDate: null,
  };

  let totalReviews = 0;
  let correctReviews = 0;
  let currentStreak = 0;
  let lastReviewDate: Date | null = null;

  cards.forEach(card => {
    // Count card types
    if (card.repetitions >= 5) {
      stats.masteredCards++;
    } else if (card.repetitions > 0) {
      stats.learningCards++;
    } else {
      stats.newCards++;
    }

    // Check if card is due
    if (card.nextReview && new Date(card.nextReview) <= now) {
      stats.dueCards++;
    }

    // Calculate accuracy and streak
    if (card.reviewStats) {
      totalReviews += card.reviewStats.total;
      correctReviews += card.reviewStats.correct;

      // Update streak
      if (card.reviewStats.lastReviewDate) {
        const reviewDate = new Date(card.reviewStats.lastReviewDate);
        if (!lastReviewDate || reviewDate > lastReviewDate) {
          lastReviewDate = reviewDate;
        }

        if (card.reviewStats.lastResult === 'correct') {
          currentStreak++;
        } else {
          currentStreak = 0;
        }
      }
    }
  });

  stats.streak = currentStreak;
  stats.accuracy = totalReviews > 0 ? (correctReviews / totalReviews) * 100 : 0;
  stats.lastReviewDate = lastReviewDate;

  return stats;
};

export const calculateDailyProgress = (cards: Card[]): DailyProgress[] => {
  const progressMap = new Map<string, DailyProgress>();
  const now = new Date();

  cards.forEach(card => {
    if (card.reviewStats?.history) {
      card.reviewStats.history.forEach(review => {
        const reviewDate = new Date(review.date);
        const dateKey = reviewDate.toISOString().split('T')[0];

        if (!progressMap.has(dateKey)) {
          progressMap.set(dateKey, {
            date: reviewDate,
            cardsReviewed: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            streak: 0,
          });
        }

        const progress = progressMap.get(dateKey)!;
        progress.cardsReviewed++;
        if (review.result === 'correct') {
          progress.correctAnswers++;
        } else {
          progress.incorrectAnswers++;
        }
      });
    }
  });

  // Calculate streaks
  const sortedDates = Array.from(progressMap.keys()).sort();
  let currentStreak = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    const progress = progressMap.get(date)!;
    
    if (progress.correctAnswers > 0) {
      currentStreak++;
    } else {
      currentStreak = 0;
    }
    
    progress.streak = currentStreak;
  }

  return Array.from(progressMap.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getProgressPercentage = (stats: ProgressStats): number => {
  if (stats.totalCards === 0) return 0;
  return (stats.masteredCards / stats.totalCards) * 100;
};

export const getNextReviewTime = (card: Card): string => {
  if (!card.nextReview) return 'Not scheduled';
  
  const now = new Date();
  const nextReview = new Date(card.nextReview);
  const diff = nextReview.getTime() - now.getTime();
  
  if (diff <= 0) return 'Due now';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `Due in ${days} day${days > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `Due in ${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `Due in ${minutes} minute${minutes > 1 ? 's' : ''}`;
}; 