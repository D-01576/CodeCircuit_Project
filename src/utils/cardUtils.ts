import { Card } from './sm2';

export const calculateCardStats = (cards: Card[]) => {
  const now = new Date();
  const dueCards = cards.filter(card => new Date(card.nextReview) <= now).length;
  const masteredCards = cards.filter(card => card.repetitions >= 5).length;
  const learningCards = cards.filter(card => card.repetitions > 0 && card.repetitions < 5).length;
  const newCards = cards.filter(card => card.repetitions === 0).length;

  return {
    total: cards.length,
    due: dueCards,
    mastered: masteredCards,
    learning: learningCards,
    new: newCards,
  };
};

export const calculateStreak = (reviewStats: { date: string; correct: number; total: number }[]) => {
  if (reviewStats.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const sortedStats = [...reviewStats].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date(today);

  for (const stat of sortedStats) {
    const statDate = new Date(stat.date);
    const diffDays = Math.floor((currentDate.getTime() - statDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      if (stat.total > 0) streak++;
      currentDate = new Date(statDate.setDate(statDate.getDate() - 1));
    } else if (diffDays === 1) {
      if (stat.total > 0) streak++;
      currentDate = statDate;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateAccuracy = (reviewStats: { date: string; correct: number; total: number }[]) => {
  if (reviewStats.length === 0) return 0;

  const totalCorrect = reviewStats.reduce((sum, stat) => sum + stat.correct, 0);
  const totalReviews = reviewStats.reduce((sum, stat) => sum + stat.total, 0);

  return totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0;
};

export const getNextReviewTime = (card: Card): string => {
  const nextReview = new Date(card.nextReview);
  const now = new Date();
  const diffMs = nextReview.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  }
};

export const sortCards = (cards: Card[], sortBy: 'due' | 'new' | 'mastered' = 'due') => {
  const now = new Date();
  
  return [...cards].sort((a, b) => {
    switch (sortBy) {
      case 'due':
        return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
      case 'new':
        return a.repetitions - b.repetitions;
      case 'mastered':
        return b.repetitions - a.repetitions;
      default:
        return 0;
    }
  });
};

export const filterCardsByTags = (cards: Card[], tags: string[]) => {
  if (tags.length === 0) return cards;
  return cards.filter(card => 
    tags.every(tag => card.tags?.includes(tag))
  );
};

export const searchCards = (cards: Card[], query: string) => {
  const searchTerm = query.toLowerCase();
  return cards.filter(card => 
    card.question.toLowerCase().includes(searchTerm) ||
    card.answer.toLowerCase().includes(searchTerm) ||
    card.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}; 