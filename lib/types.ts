/**
 * Core Flashcard Types
 * 
 * Simple, immutable data structures for flashcard system.
 */

export interface Card {
  id: string;
  front: string;
  back: string;
  box: number; // Leitner box number (0-4): 0 = new, 1-4 = increasing intervals
}

export interface Deck {
  name: string;
  cards: Card[];
}

export type ReviewResult = 'correct' | 'incorrect';

/**
 * Card statistics for tracking progress
 */
export interface CardStats {
  totalReviews: number;
  correctReviews: number;
  lastReviewed: Date | null;
}

export interface StudySession {
  cardsReviewed: number;
  cardsCorrect: number;
  cardsIncorrect: number;
}
