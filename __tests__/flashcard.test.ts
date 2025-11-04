/**
 * Tests for Core Flashcard Functions
 * 
 * Comprehensive test coverage for all pure functions
 */

import {
  createCard,
  updateCardBox,
  getCardsForReview,
  shuffleCards,
  createDeck,
  addCardToDeck,
  updateCardInDeck,
  removeCardFromDeck,
  getDeckStats,
  createStudySession,
  updateStudySession,
  getSessionAccuracy,
} from '../lib/flashcard';
import { Card, ReviewResult } from '../lib/types';

describe('createCard', () => {
  it('should create a card with correct properties', () => {
    const card = createCard('1', 'Question', 'Answer');
    expect(card).toEqual({
      id: '1',
      front: 'Question',
      back: 'Answer',
      box: 0,
    });
  });

  it('should start cards in box 0', () => {
    const card = createCard('test', 'Front', 'Back');
    expect(card.box).toBe(0);
  });
});

describe('updateCardBox', () => {
  it('should move card to next box on correct answer', () => {
    const card = createCard('1', 'Q', 'A');
    const updated = updateCardBox(card, 'correct');
    expect(updated.box).toBe(1);
  });

  it('should move card back to box 0 on incorrect answer', () => {
    const card = { ...createCard('1', 'Q', 'A'), box: 3 };
    const updated = updateCardBox(card, 'incorrect');
    expect(updated.box).toBe(0);
  });

  it('should cap box number at 4', () => {
    const card = { ...createCard('1', 'Q', 'A'), box: 4 };
    const updated = updateCardBox(card, 'correct');
    expect(updated.box).toBe(4);
  });

  it('should not mutate the original card', () => {
    const card = createCard('1', 'Q', 'A');
    const originalBox = card.box;
    updateCardBox(card, 'correct');
    expect(card.box).toBe(originalBox);
  });

  it('should progress through all boxes correctly', () => {
    let card = createCard('1', 'Q', 'A');
    expect(card.box).toBe(0);
    
    card = updateCardBox(card, 'correct');
    expect(card.box).toBe(1);
    
    card = updateCardBox(card, 'correct');
    expect(card.box).toBe(2);
    
    card = updateCardBox(card, 'correct');
    expect(card.box).toBe(3);
    
    card = updateCardBox(card, 'correct');
    expect(card.box).toBe(4);
    
    card = updateCardBox(card, 'correct');
    expect(card.box).toBe(4); // Should stay at 4
  });
});

describe('getCardsForReview', () => {
  const cards: Card[] = [
    { id: '1', front: 'Q1', back: 'A1', box: 0 },
    { id: '2', front: 'Q2', back: 'A2', box: 1 },
    { id: '3', front: 'Q3', back: 'A3', box: 2 },
    { id: '4', front: 'Q4', back: 'A4', box: 0 },
  ];

  it('should return cards from specified boxes', () => {
    const reviewCards = getCardsForReview(cards, [0]);
    expect(reviewCards).toHaveLength(2);
    expect(reviewCards.every(c => c.box === 0)).toBe(true);
  });

  it('should handle multiple box numbers', () => {
    const reviewCards = getCardsForReview(cards, [0, 1]);
    expect(reviewCards).toHaveLength(3);
  });

  it('should return empty array when no cards match', () => {
    const reviewCards = getCardsForReview(cards, [4]);
    expect(reviewCards).toHaveLength(0);
  });

  it('should return all cards when all boxes specified', () => {
    const reviewCards = getCardsForReview(cards, [0, 1, 2, 3, 4]);
    expect(reviewCards).toHaveLength(4);
  });
});

describe('shuffleCards', () => {
  it('should return array with same length', () => {
    const cards = [1, 2, 3, 4, 5];
    const shuffled = shuffleCards(cards);
    expect(shuffled).toHaveLength(cards.length);
  });

  it('should contain same elements', () => {
    const cards = [1, 2, 3, 4, 5];
    const shuffled = shuffleCards(cards);
    expect(shuffled.sort()).toEqual(cards.sort());
  });

  it('should not mutate original array', () => {
    const cards = [1, 2, 3, 4, 5];
    const original = [...cards];
    shuffleCards(cards);
    expect(cards).toEqual(original);
  });

  it('should handle empty array', () => {
    const shuffled = shuffleCards([]);
    expect(shuffled).toEqual([]);
  });

  it('should handle single element', () => {
    const shuffled = shuffleCards([1]);
    expect(shuffled).toEqual([1]);
  });
});

describe('createDeck', () => {
  it('should create a deck with name and cards', () => {
    const cards = [createCard('1', 'Q1', 'A1')];
    const deck = createDeck('Test Deck', cards);
    expect(deck.name).toBe('Test Deck');
    expect(deck.cards).toEqual(cards);
  });

  it('should create empty deck', () => {
    const deck = createDeck('Empty', []);
    expect(deck.cards).toHaveLength(0);
  });
});

describe('addCardToDeck', () => {
  it('should add card to deck', () => {
    const deck = createDeck('Test', []);
    const card = createCard('1', 'Q', 'A');
    const updated = addCardToDeck(deck, card);
    expect(updated.cards).toHaveLength(1);
    expect(updated.cards[0]).toEqual(card);
  });

  it('should not mutate original deck', () => {
    const deck = createDeck('Test', []);
    const card = createCard('1', 'Q', 'A');
    addCardToDeck(deck, card);
    expect(deck.cards).toHaveLength(0);
  });

  it('should preserve existing cards', () => {
    const card1 = createCard('1', 'Q1', 'A1');
    const deck = createDeck('Test', [card1]);
    const card2 = createCard('2', 'Q2', 'A2');
    const updated = addCardToDeck(deck, card2);
    expect(updated.cards).toHaveLength(2);
    expect(updated.cards[0]).toEqual(card1);
    expect(updated.cards[1]).toEqual(card2);
  });
});

describe('updateCardInDeck', () => {
  it('should update specific card in deck', () => {
    const card1 = createCard('1', 'Q1', 'A1');
    const card2 = createCard('2', 'Q2', 'A2');
    const deck = createDeck('Test', [card1, card2]);
    
    const updatedCard = { ...card1, box: 3 };
    const updatedDeck = updateCardInDeck(deck, updatedCard);
    
    expect(updatedDeck.cards[0].box).toBe(3);
    expect(updatedDeck.cards[1]).toEqual(card2);
  });

  it('should not mutate original deck', () => {
    const card = createCard('1', 'Q', 'A');
    const deck = createDeck('Test', [card]);
    const updatedCard = { ...card, box: 2 };
    updateCardInDeck(deck, updatedCard);
    expect(deck.cards[0].box).toBe(0);
  });

  it('should handle card not in deck', () => {
    const card1 = createCard('1', 'Q1', 'A1');
    const deck = createDeck('Test', [card1]);
    const card2 = createCard('2', 'Q2', 'A2');
    const updated = updateCardInDeck(deck, card2);
    expect(updated.cards).toHaveLength(1);
    expect(updated.cards[0]).toEqual(card1);
  });
});

describe('removeCardFromDeck', () => {
  it('should remove card from deck', () => {
    const card1 = createCard('1', 'Q1', 'A1');
    const card2 = createCard('2', 'Q2', 'A2');
    const deck = createDeck('Test', [card1, card2]);
    const updated = removeCardFromDeck(deck, '1');
    expect(updated.cards).toHaveLength(1);
    expect(updated.cards[0]).toEqual(card2);
  });

  it('should not mutate original deck', () => {
    const card = createCard('1', 'Q', 'A');
    const deck = createDeck('Test', [card]);
    removeCardFromDeck(deck, '1');
    expect(deck.cards).toHaveLength(1);
  });

  it('should handle non-existent card', () => {
    const card = createCard('1', 'Q', 'A');
    const deck = createDeck('Test', [card]);
    const updated = removeCardFromDeck(deck, '999');
    expect(updated.cards).toHaveLength(1);
  });
});

describe('getDeckStats', () => {
  it('should calculate correct statistics', () => {
    const cards: Card[] = [
      { id: '1', front: 'Q1', back: 'A1', box: 0 },
      { id: '2', front: 'Q2', back: 'A2', box: 0 },
      { id: '3', front: 'Q3', back: 'A3', box: 1 },
      { id: '4', front: 'Q4', back: 'A4', box: 2 },
      { id: '5', front: 'Q5', back: 'A5', box: 4 },
    ];
    const deck = createDeck('Test', cards);
    const stats = getDeckStats(deck);
    
    expect(stats.totalCards).toBe(5);
    expect(stats.newCards).toBe(2);
    expect(stats.learning).toBe(1);
    expect(stats.reviewing).toBe(1);
    expect(stats.mastered).toBe(1);
    expect(stats.boxCounts).toEqual([2, 1, 1, 0, 1]);
  });

  it('should handle empty deck', () => {
    const deck = createDeck('Empty', []);
    const stats = getDeckStats(deck);
    expect(stats.totalCards).toBe(0);
    expect(stats.boxCounts).toEqual([0, 0, 0, 0, 0]);
  });
});

describe('createStudySession', () => {
  it('should create session with zero values', () => {
    const session = createStudySession();
    expect(session.cardsReviewed).toBe(0);
    expect(session.cardsCorrect).toBe(0);
    expect(session.cardsIncorrect).toBe(0);
  });
});

describe('updateStudySession', () => {
  it('should increment correct count on correct answer', () => {
    const session = createStudySession();
    const updated = updateStudySession(session, 'correct');
    expect(updated.cardsReviewed).toBe(1);
    expect(updated.cardsCorrect).toBe(1);
    expect(updated.cardsIncorrect).toBe(0);
  });

  it('should increment incorrect count on incorrect answer', () => {
    const session = createStudySession();
    const updated = updateStudySession(session, 'incorrect');
    expect(updated.cardsReviewed).toBe(1);
    expect(updated.cardsCorrect).toBe(0);
    expect(updated.cardsIncorrect).toBe(1);
  });

  it('should not mutate original session', () => {
    const session = createStudySession();
    updateStudySession(session, 'correct');
    expect(session.cardsReviewed).toBe(0);
  });

  it('should accumulate multiple reviews', () => {
    let session = createStudySession();
    session = updateStudySession(session, 'correct');
    session = updateStudySession(session, 'correct');
    session = updateStudySession(session, 'incorrect');
    
    expect(session.cardsReviewed).toBe(3);
    expect(session.cardsCorrect).toBe(2);
    expect(session.cardsIncorrect).toBe(1);
  });
});

describe('getSessionAccuracy', () => {
  it('should return 0 for new session', () => {
    const session = createStudySession();
    expect(getSessionAccuracy(session)).toBe(0);
  });

  it('should calculate 100% accuracy', () => {
    let session = createStudySession();
    session = updateStudySession(session, 'correct');
    session = updateStudySession(session, 'correct');
    expect(getSessionAccuracy(session)).toBe(100);
  });

  it('should calculate 0% accuracy', () => {
    let session = createStudySession();
    session = updateStudySession(session, 'incorrect');
    session = updateStudySession(session, 'incorrect');
    expect(getSessionAccuracy(session)).toBe(0);
  });

  it('should calculate 50% accuracy', () => {
    let session = createStudySession();
    session = updateStudySession(session, 'correct');
    session = updateStudySession(session, 'incorrect');
    expect(getSessionAccuracy(session)).toBe(50);
  });

  it('should round accuracy', () => {
    let session = createStudySession();
    session = updateStudySession(session, 'correct');
    session = updateStudySession(session, 'correct');
    session = updateStudySession(session, 'incorrect');
    expect(getSessionAccuracy(session)).toBe(67); // 66.666... rounded
  });
});
