import { Card } from './sm2';

export interface AnalyticsEvent {
  type: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface AnalyticsData {
  events: AnalyticsEvent[];
  sessionStart: string;
  sessionEnd: string | null;
  totalCardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageResponseTime: number;
  mostDifficultCards: string[];
  mostReviewedCards: string[];
  studyStreak: number;
}

class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];
  private sessionStart: string;
  private sessionEnd: string | null = null;
  private responseTimes: number[] = [];

  private constructor() {
    this.sessionStart = new Date().toISOString();
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  public trackEvent(type: string, data: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      type,
      timestamp: new Date().toISOString(),
      data,
    };
    this.events.push(event);
  }

  public trackCardReview(card: Card, quality: number, responseTime: number) {
    this.responseTimes.push(responseTime);
    this.trackEvent('card_review', {
      cardId: card.id,
      quality,
      responseTime,
      repetitions: card.repetitions,
      easeFactor: card.easeFactor,
    });
  }

  public endSession() {
    this.sessionEnd = new Date().toISOString();
  }

  public getAnalytics(cards: Card[]): AnalyticsData {
    const cardStats = new Map<string, { reviews: number; correct: number }>();
    let totalCardsReviewed = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    this.events.forEach(event => {
      if (event.type === 'card_review') {
        totalCardsReviewed++;
        const cardId = event.data.cardId;
        const quality = event.data.quality;

        if (!cardStats.has(cardId)) {
          cardStats.set(cardId, { reviews: 0, correct: 0 });
        }

        const stats = cardStats.get(cardId)!;
        stats.reviews++;
        if (quality >= 3) {
          stats.correct++;
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    });

    const mostReviewedCards = Array.from(cardStats.entries())
      .sort((a, b) => b[1].reviews - a[1].reviews)
      .slice(0, 5)
      .map(([cardId]) => cardId);

    const mostDifficultCards = Array.from(cardStats.entries())
      .filter(([_, stats]) => stats.reviews >= 3)
      .sort((a, b) => (a[1].correct / a[1].reviews) - (b[1].correct / b[1].reviews))
      .slice(0, 5)
      .map(([cardId]) => cardId);

    const averageResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
      : 0;

    return {
      events: this.events,
      sessionStart: this.sessionStart,
      sessionEnd: this.sessionEnd,
      totalCardsReviewed,
      correctAnswers,
      incorrectAnswers,
      averageResponseTime,
      mostDifficultCards,
      mostReviewedCards,
      studyStreak: this.calculateStudyStreak(),
    };
  }

  private calculateStudyStreak(): number {
    const dates = new Set<string>();
    this.events.forEach(event => {
      const date = event.timestamp.split('T')[0];
      dates.add(date);
    });

    const sortedDates = Array.from(dates).sort();
    let streak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const nextDate = i < sortedDates.length - 1 ? new Date(sortedDates[i + 1]) : null;

      if (nextDate) {
        const diffDays = Math.floor((nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
          streak = Math.max(streak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
    }

    return streak;
  }
}

export const analytics = Analytics.getInstance();

export const trackEvent = (type: string, data: Record<string, any> = {}) => {
  analytics.trackEvent(type, data);
};

export const trackCardReview = (card: Card, quality: number, responseTime: number) => {
  analytics.trackCardReview(card, quality, responseTime);
};

export const endSession = () => {
  analytics.endSession();
};

export const getAnalytics = (cards: Card[]): AnalyticsData => {
  return analytics.getAnalytics(cards);
}; 