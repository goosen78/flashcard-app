/**
 * Card Selection Logic
 * 
 * Implements deterministic card selection for study sessions:
 * 1. Select due cards (due_at <= now) ordered by due_at ASC
 * 2. If no due cards, select new cards (due_at IS NULL)
 * 3. Respect deck limits: new_cards_per_day and review_limit_per_day
 */

import { getDb } from '@/db';
import { floorToDay } from './sm2';

export interface Card {
  id: string;
  deck_id: string;
  type: 'basic' | 'mcq' | 'cloze' | 'code';
  prompt: string;
  answer: string;
  source: 'manual' | 'generated';
  e_factor: number;
  interval_days: number;
  repetition: number;
  due_at: string | null;
  suspended: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string | null;
  new_cards_per_day: number;
  review_limit_per_day: number;
  release_state: 'draft' | 'released';
  created_at: string;
}

/**
 * Select the next card to study from a deck
 * 
 * Priority:
 * 1. Due cards (earliest first)
 * 2. New cards (never studied)
 * 
 * Respects daily limits based on reviews already done today
 */
export function selectNextCard(deckId: string, now: Date | string = new Date()): Card | null {
  const db = getDb();
  const currentDate = typeof now === 'string' ? new Date(now) : now;
  const todayStart = floorToDay(currentDate);
  
  // Get deck configuration
  const deck = db.prepare('SELECT * FROM decks WHERE id = ?').get(deckId) as Deck | undefined;
  
  if (!deck) {
    return null;
  }
  
  // Count reviews done today
  const reviewsToday = db.prepare(`
    SELECT COUNT(*) as count
    FROM reviews r
    JOIN cards c ON r.card_id = c.id
    WHERE c.deck_id = ?
      AND r.reviewed_at >= ?
  `).get(deckId, todayStart) as { count: number };
  
  // Check if we've hit the daily review limit
  if (reviewsToday.count >= deck.review_limit_per_day) {
    return null;
  }
  
  // Try to get a due card first
  const dueCard = db.prepare(`
    SELECT * FROM cards
    WHERE deck_id = ?
      AND suspended = 0
      AND due_at IS NOT NULL
      AND due_at <= ?
    ORDER BY due_at ASC
    LIMIT 1
  `).get(deckId, currentDate.toISOString()) as Card | undefined;
  
  if (dueCard) {
    return mapDbCard(dueCard);
  }
  
  // No due cards, try to get a new card
  // Count new cards studied today
  const newCardsToday = db.prepare(`
    SELECT COUNT(*) as count
    FROM reviews r
    JOIN cards c ON r.card_id = c.id
    WHERE c.deck_id = ?
      AND r.reviewed_at >= ?
      AND r.id IN (
        SELECT MIN(id)
        FROM reviews
        WHERE card_id = c.id
      )
  `).get(deckId, todayStart) as { count: number };
  
  // Check if we've hit the daily new cards limit
  if (newCardsToday.count >= deck.new_cards_per_day) {
    return null;
  }
  
  // Get a new card
  const newCard = db.prepare(`
    SELECT * FROM cards
    WHERE deck_id = ?
      AND suspended = 0
      AND due_at IS NULL
    ORDER BY created_at ASC
    LIMIT 1
  `).get(deckId) as Card | undefined;
  
  return newCard ? mapDbCard(newCard) : null;
}

/**
 * Get all decks
 */
export function getAllDecks(): Deck[] {
  const db = getDb();
  const decks = db.prepare('SELECT * FROM decks ORDER BY created_at DESC').all() as Deck[];
  return decks;
}

/**
 * Get a single deck by ID
 */
export function getDeck(deckId: string): Deck | null {
  const db = getDb();
  const deck = db.prepare('SELECT * FROM decks WHERE id = ?').get(deckId) as Deck | undefined;
  return deck || null;
}

/**
 * Get deck statistics
 */
export function getDeckStats(deckId: string, now: Date | string = new Date()): {
  total: number;
  new: number;
  due: number;
  learning: number;
} {
  const db = getDb();
  const currentDate = typeof now === 'string' ? new Date(now) : now;
  
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN due_at IS NULL THEN 1 ELSE 0 END) as new,
      SUM(CASE WHEN due_at IS NOT NULL AND due_at <= ? THEN 1 ELSE 0 END) as due,
      SUM(CASE WHEN due_at IS NOT NULL AND due_at > ? THEN 1 ELSE 0 END) as learning
    FROM cards
    WHERE deck_id = ? AND suspended = 0
  `).get(currentDate.toISOString(), currentDate.toISOString(), deckId) as {
    total: number;
    new: number;
    due: number;
    learning: number;
  };
  
  return stats;
}

/**
 * Get all cards for a deck (for management UI)
 */
export function getCardsForDeck(deckId: string): Card[] {
  const db = getDb();
  const cards = db.prepare(`
    SELECT * FROM cards
    WHERE deck_id = ?
    ORDER BY created_at DESC
  `).all(deckId) as Card[];
  
  return cards.map(mapDbCard);
}

/**
 * Map database card to typed Card (handles boolean conversion)
 */
function mapDbCard(dbCard: any): Card {
  return {
    ...dbCard,
    suspended: Boolean(dbCard.suspended),
  };
}
