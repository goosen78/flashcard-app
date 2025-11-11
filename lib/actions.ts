'use server';

/**
 * Server Actions for Flashcard Operations
 * 
 * All state mutations happen through these server actions:
 * - createDeck, updateDeck, deleteDeck
 * - createCard, updateCard, deleteCard
 * - submitReview (atomic: insert review + update card scheduling)
 */

import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { getDb, transaction } from '@/db';
import { sm2Update } from '@/lib/sm2';
import { selectNextCard, Card, Deck } from '@/lib/selection';
import { DocumentProcessor, validateDocumentInput, DocumentInput } from '@/lib/document-processor';
import { OpenAIProvider } from '@/providers/openai';
import { validateCard, enforceStyle, CandidateCard } from '@/providers/llm';

// ============= DECK ACTIONS =============

export async function createDeck(name: string, description?: string) {
  try {
    const id = uuidv4();
    const db = getDb();
    
    db.prepare(`
      INSERT INTO decks (id, name, description)
      VALUES (?, ?, ?)
    `).run(id, name, description || null);
    
    revalidatePath('/');
    return { success: true, id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDeck(
  id: string,
  updates: {
    name?: string;
    description?: string;
    new_cards_per_day?: number;
    review_limit_per_day?: number;
    release_state?: 'draft' | 'released';
  }
) {
  try {
    const db = getDb();
    const sets: string[] = [];
    const values: any[] = [];
    
    if (updates.name !== undefined) {
      sets.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      sets.push('description = ?');
      values.push(updates.description);
    }
    if (updates.new_cards_per_day !== undefined) {
      sets.push('new_cards_per_day = ?');
      values.push(updates.new_cards_per_day);
    }
    if (updates.review_limit_per_day !== undefined) {
      sets.push('review_limit_per_day = ?');
      values.push(updates.review_limit_per_day);
    }
    if (updates.release_state !== undefined) {
      sets.push('release_state = ?');
      values.push(updates.release_state);
    }
    
    if (sets.length === 0) {
      return { success: true };
    }
    
    values.push(id);
    
    db.prepare(`
      UPDATE decks
      SET ${sets.join(', ')}
      WHERE id = ?
    `).run(...values);
    
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDeck(id: string) {
  try {
    const db = getDb();
    db.prepare('DELETE FROM decks WHERE id = ?').run(id);
    
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============= CARD ACTIONS =============

export async function createCard(
  deckId: string,
  card: {
    type?: 'basic' | 'mcq' | 'cloze' | 'code';
    prompt: string;
    answer: string;
    source?: 'manual' | 'generated';
  }
) {
  try {
    const id = uuidv4();
    const db = getDb();
    
    db.prepare(`
      INSERT INTO cards (id, deck_id, type, prompt, answer, source)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id,
      deckId,
      card.type || 'basic',
      card.prompt,
      card.answer,
      card.source || 'manual'
    );
    
    revalidatePath(`/decks/${deckId}`);
    return { success: true, id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCard(
  id: string,
  updates: {
    prompt?: string;
    answer?: string;
    suspended?: boolean;
  }
) {
  try {
    const db = getDb();
    const sets: string[] = [];
    const values: any[] = [];
    
    if (updates.prompt !== undefined) {
      sets.push('prompt = ?');
      values.push(updates.prompt);
    }
    if (updates.answer !== undefined) {
      sets.push('answer = ?');
      values.push(updates.answer);
    }
    if (updates.suspended !== undefined) {
      sets.push('suspended = ?');
      values.push(updates.suspended ? 1 : 0);
    }
    
    // Always bump version and updated_at on content changes
    if (updates.prompt !== undefined || updates.answer !== undefined) {
      sets.push('version = version + 1');
      sets.push('updated_at = datetime("now")');
    }
    
    if (sets.length === 0) {
      return { success: true };
    }
    
    values.push(id);
    
    db.prepare(`
      UPDATE cards
      SET ${sets.join(', ')}
      WHERE id = ?
    `).run(...values);
    
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCard(id: string) {
  try {
    const db = getDb();
    db.prepare('DELETE FROM cards WHERE id = ?').run(id);
    
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============= STUDY ACTIONS =============

/**
 * Get the next card to study
 */
export async function getNextCard(deckId: string): Promise<Card | null> {
  return selectNextCard(deckId);
}

/**
 * Submit a review and update card scheduling
 * 
 * This is atomic: inserts review record and updates card state in a transaction
 */
export async function submitReview(
  cardId: string,
  quality: number,
  latencyMs?: number,
  userAnswer?: string
): Promise<{ success: boolean; error?: string; nextCard?: Card | null }> {
  try {
    if (quality < 0 || quality > 5) {
      return { success: false, error: 'Quality must be between 0 and 5' };
    }

    const result = transaction((db) => {
      // Get current card state
      const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId) as any;

      if (!card) {
        throw new Error('Card not found');
      }

      // Insert review record
      const reviewId = uuidv4();
      db.prepare(`
        INSERT INTO reviews (id, card_id, quality, latency_ms, user_answer)
        VALUES (?, ?, ?, ?, ?)
      `).run(reviewId, cardId, quality, latencyMs || null, userAnswer || null);

      // Update card scheduling using SM-2
      const currentState = {
        e_factor: card.e_factor,
        interval_days: card.interval_days,
        repetition: card.repetition,
      };

      const newState = sm2Update(currentState, quality);

      db.prepare(`
        UPDATE cards
        SET e_factor = ?,
            interval_days = ?,
            repetition = ?,
            due_at = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `).run(
        newState.e_factor,
        newState.interval_days,
        newState.repetition,
        newState.due_at,
        cardId
      );

      // Get next card
      const nextCard = selectNextCard(card.deck_id);

      return nextCard;
    });

    revalidatePath('/');
    return { success: true, nextCard: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============= DOCUMENT GENERATION ACTIONS =============

/**
 * Generate flashcards from uploaded document, URL, or text
 *
 * Server Action called from GenerateCardsForm component
 */
export async function generateCardsFromDocument(
  formData: FormData
): Promise<{
  success: boolean;
  cards?: CandidateCard[];
  error?: string;
  metadata?: {
    source: 'pdf' | 'url' | 'text';
    length: number;
    truncated: boolean;
  };
}> {
  try {
    // Parse input type from form
    const inputType = formData.get('inputType') as 'file' | 'url' | 'text';
    let documentInput: DocumentInput;

    // Build DocumentInput based on type
    switch (inputType) {
      case 'file': {
        const file = formData.get('file') as File;
        if (!file || file.size === 0) {
          return { success: false, error: 'No file provided' };
        }
        documentInput = { type: 'file', file };
        break;
      }

      case 'url': {
        const url = formData.get('url') as string;
        if (!url || url.trim().length === 0) {
          return { success: false, error: 'No URL provided' };
        }
        documentInput = { type: 'url', url: url.trim() };
        break;
      }

      case 'text': {
        const text = formData.get('text') as string;
        if (!text || text.trim().length === 0) {
          return { success: false, error: 'No text provided' };
        }
        documentInput = { type: 'text', text: text.trim() };
        break;
      }

      default:
        return { success: false, error: 'Invalid input type' };
    }

    // Validate input before processing
    const validation = validateDocumentInput(documentInput);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: 'OPENAI_API_KEY not configured. Please add it to your .env file.',
      };
    }

    // Process document to markdown
    const processor = new DocumentProcessor();
    const processed = await processor.process(documentInput);

    // Generate cards with GPT-4o
    const provider = new OpenAIProvider(apiKey);
    const max_cards = parseInt(formData.get('max_cards') as string) || 10;
    const difficulty = (formData.get('difficulty') as 'easy' | 'medium' | 'hard') || 'medium';

    const rawCards = await provider.generateQuestions(processed.markdown, {
      max_cards,
      difficulty,
    });

    // Validate and clean generated cards
    const validCards = rawCards
      .map(enforceStyle)  // Clean whitespace, formatting
      .filter((card) => {
        const validation = validateCard(card);
        if (!validation.valid) {
          console.warn('Invalid card filtered out:', validation.errors);
        }
        return validation.valid;
      });

    // Check if we got any valid cards
    if (validCards.length === 0) {
      return {
        success: false,
        error: 'No valid cards generated. Try different content or check document quality.',
      };
    }

    // Success!
    return {
      success: true,
      cards: validCards,
      metadata: processed.metadata,
    };
  } catch (error: any) {
    console.error('Card generation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate cards. Please try again.',
    };
  }
}
