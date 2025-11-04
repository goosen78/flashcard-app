/**
 * Pure Functions for Flashcard Logic
 * 
 * All functions are pure (no side effects) and easily testable.
 * Based on the Leitner system for spaced repetition.
 */

import { Card, ReviewResult, Deck, StudySession } from './types';

/**
 * Creates a new card with default values
 */
export function createCard(id: string, front: string, back: string): Card {
  return {
    id,
    front,
    back,
    box: 0, // Start in box 0 (new cards)
  };
}

/**
 * Updates a card's box based on review result
 * Correct answer: move to next box (max 4)
 * Incorrect answer: move back to box 0
 * 
 * This implements the Leitner spaced repetition algorithm.
 */
export function updateCardBox(card: Card, result: ReviewResult): Card {
  const newBox = result === 'correct' 
    ? Math.min(card.box + 1, 4) // Move forward, cap at 4
    : 0; // Move back to start
  
  return {
    ...card,
    box: newBox,
  };
}

/**
 * Filters cards that need review based on their box number
 * Lower box numbers = review more frequently
 * 
 * @param cards - All cards in the deck
 * @param boxesToReview - Array of box numbers to include in review
 * @returns Cards that should be reviewed
 */
export function getCardsForReview(cards: Card[], boxesToReview: number[]): Card[] {
  return cards.filter(card => boxesToReview.includes(card.box));
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * Returns a new array, does not mutate the original
 */
export function shuffleCards<T>(cards: T[]): T[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Creates a new deck with given name and cards
 */
export function createDeck(name: string, cards: Card[]): Deck {
  return {
    name,
    cards,
  };
}

/**
 * Adds a card to a deck
 * Returns a new deck, does not mutate the original
 */
export function addCardToDeck(deck: Deck, card: Card): Deck {
  return {
    ...deck,
    cards: [...deck.cards, card],
  };
}

/**
 * Updates a specific card in a deck
 * Returns a new deck, does not mutate the original
 */
export function updateCardInDeck(deck: Deck, updatedCard: Card): Deck {
  return {
    ...deck,
    cards: deck.cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ),
  };
}

/**
 * Removes a card from a deck
 * Returns a new deck, does not mutate the original
 */
export function removeCardFromDeck(deck: Deck, cardId: string): Deck {
  return {
    ...deck,
    cards: deck.cards.filter(card => card.id !== cardId),
  };
}

/**
 * Gets statistics about a deck
 */
export function getDeckStats(deck: Deck) {
  const boxCounts = [0, 1, 2, 3, 4].map(box => 
    deck.cards.filter(card => card.box === box).length
  );
  
  return {
    totalCards: deck.cards.length,
    newCards: boxCounts[0],
    learning: boxCounts[1],
    reviewing: boxCounts[2] + boxCounts[3],
    mastered: boxCounts[4],
    boxCounts,
  };
}

/**
 * Creates an initial study session
 */
export function createStudySession(): StudySession {
  return {
    cardsReviewed: 0,
    cardsCorrect: 0,
    cardsIncorrect: 0,
  };
}

/**
 * Updates study session with a review result
 * Returns a new session, does not mutate the original
 */
export function updateStudySession(
  session: StudySession,
  result: ReviewResult
): StudySession {
  return {
    cardsReviewed: session.cardsReviewed + 1,
    cardsCorrect: session.cardsCorrect + (result === 'correct' ? 1 : 0),
    cardsIncorrect: session.cardsIncorrect + (result === 'incorrect' ? 1 : 0),
  };
}

/**
 * Calculates accuracy percentage for a study session
 */
export function getSessionAccuracy(session: StudySession): number {
  if (session.cardsReviewed === 0) return 0;
  return Math.round((session.cardsCorrect / session.cardsReviewed) * 100);
}
