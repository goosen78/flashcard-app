/**
 * LLM Provider Interface
 * 
 * Minimal interface for LLM-based flashcard generation and grading.
 * Students can implement adapters for OpenAI, Anthropic, or local models.
 */

export interface CandidateCard {
  type: 'basic' | 'mcq' | 'cloze' | 'code';
  prompt: string;
  answer: string;
  confidence?: number; // Optional: model's confidence in quality
}

export interface GenerateOptions {
  max_cards?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  card_types?: Array<'basic' | 'mcq' | 'cloze' | 'code'>;
}

export interface GradeResult {
  correctness: boolean;
  feedback?: string;
  confidence?: number;
}

/**
 * Base interface for LLM providers
 */
export interface LLMProvider {
  /**
   * Generate flashcards from input text
   */
  generateQuestions(
    inputText: string,
    options?: GenerateOptions
  ): Promise<CandidateCard[]>;

  /**
   * Grade a freeform student answer
   */
  gradeFreeformAnswer(
    prompt: string,
    studentAnswer: string,
    referenceAnswer: string
  ): Promise<GradeResult>;
}

/**
 * Stub provider for development and testing
 * Returns synthetic cards without making actual LLM calls
 */
export class StubProvider implements LLMProvider {
  async generateQuestions(
    inputText: string,
    options?: GenerateOptions
  ): Promise<CandidateCard[]> {
    const max_cards = options?.max_cards || 3;
    const cards: CandidateCard[] = [];

    // Generate simple example cards based on input
    const words = inputText.split(/\s+/).filter(w => w.length > 3);
    const numCards = Math.min(max_cards, Math.max(1, Math.floor(words.length / 10)));

    for (let i = 0; i < numCards; i++) {
      cards.push({
        type: 'basic',
        prompt: `What is the meaning of "${words[i * 2] || 'concept'}"?`,
        answer: `[Generated answer for ${words[i * 2] || 'concept'}]`,
        confidence: 0.7,
      });
    }

    return cards;
  }

  async gradeFreeformAnswer(
    prompt: string,
    studentAnswer: string,
    referenceAnswer: string
  ): Promise<GradeResult> {
    // Stub grading: simple keyword matching
    const studentWords = new Set(
      studentAnswer.toLowerCase().split(/\s+/)
    );
    const referenceWords = new Set(
      referenceAnswer.toLowerCase().split(/\s+/)
    );

    let matchCount = 0;
    referenceWords.forEach((word) => {
      if (studentWords.has(word)) {
        matchCount++;
      }
    });

    const overlap = matchCount / referenceWords.size;
    const correctness = overlap > 0.5;

    return {
      correctness,
      feedback: correctness
        ? 'Good answer! Key concepts identified.'
        : 'Consider reviewing the reference answer.',
      confidence: overlap,
    };
  }
}

/**
 * Validate generated card meets quality standards
 */
export function validateCard(card: CandidateCard): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check prompt
  if (!card.prompt || card.prompt.trim().length === 0) {
    errors.push('Prompt is empty');
  }
  if (card.prompt && card.prompt.length > 500) {
    errors.push('Prompt is too long (max 500 characters)');
  }

  // Check answer
  if (!card.answer || card.answer.trim().length === 0) {
    errors.push('Answer is empty');
  }
  if (card.answer && card.answer.length > 1000) {
    errors.push('Answer is too long (max 1000 characters)');
  }

  // Check type
  const validTypes = ['basic', 'mcq', 'cloze', 'code'];
  if (!validTypes.includes(card.type)) {
    errors.push(`Invalid card type: ${card.type}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Style enforcement: clean up generated cards
 */
export function enforceStyle(card: CandidateCard): CandidateCard {
  return {
    ...card,
    prompt: card.prompt.trim(),
    answer: card.answer.trim(),
  };
}
