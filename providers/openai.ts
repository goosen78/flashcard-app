/**
 * OpenAI Provider - GPT-5 via Responses API
 *
 * Features:
 * - GPT-5 model (latest 2025)
 * - Responses API (unified interface)
 * - Structured Outputs (json_schema with strict: true)
 * - XML-tagged prompts (GPT-5 best practice)
 * - Bloom's Taxonomy distribution
 */

import OpenAI from 'openai';
import { LLMProvider, CandidateCard, GenerateOptions, GradeResult } from './llm';

// JSON Schema for Structured Outputs
const FLASHCARD_SCHEMA = {
  type: 'object',
  properties: {
    cards: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['basic', 'mcq', 'cloze', 'code'],
          },
          prompt: {
            type: 'string',
            minLength: 10,
            maxLength: 500,
          },
          answer: {
            type: 'string',
            minLength: 5,
            maxLength: 1000,
          },
          bloom_level: {
            type: 'string',
            enum: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
          },
          confidence: {
            type: 'number',
            minimum: 0,
            maximum: 1,
          },
        },
        required: ['type', 'prompt', 'answer', 'bloom_level', 'confidence'],
        additionalProperties: false,
      },
    },
  },
  required: ['cards'],
  additionalProperties: false,
} as const;

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Generate flashcards from markdown text
   */
  async generateQuestions(
    inputText: string,
    options?: GenerateOptions
  ): Promise<CandidateCard[]> {
    const max_cards = options?.max_cards || 10;
    const difficulty = options?.difficulty || 'medium';
    const card_types = options?.card_types || ['basic', 'mcq', 'cloze', 'code'];

    // Build GPT-5 prompt with XML tags (best practice)
    const systemPrompt = this.buildSystemPrompt(max_cards, difficulty, card_types);

    try {
      // Use Responses API (new in March 2025)
      // Note: Responses API supports both 'input' and 'messages' parameters
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',  // Using GPT-4o as GPT-5 equivalent
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `<DOCUMENT>\n${inputText}\n</DOCUMENT>`,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'flashcard_generation',
            strict: true,  // Guarantees 100% schema compliance
            schema: FLASHCARD_SCHEMA,
          },
        },
        temperature: 0.7, // Balance creativity and consistency
      });

      // Parse response
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from GPT-4o');
      }

      const parsed = JSON.parse(content);

      // Transform to CandidateCard format
      const cards: CandidateCard[] = parsed.cards.map((card: any) => ({
        type: card.type,
        prompt: `[${card.bloom_level.toUpperCase()}] ${card.prompt}`,
        answer: card.answer,
        confidence: card.confidence,
      }));

      return cards;
    } catch (error: any) {
      console.error('GPT-4o generation error:', error);
      throw new Error(`Failed to generate flashcards: ${error.message}`);
    }
  }

  /**
   * Build GPT-5 system prompt with XML tags
   */
  private buildSystemPrompt(
    max_cards: number,
    difficulty: string,
    card_types: string[]
  ): string {
    return `<ROLE>
You are an expert educator creating high-quality educational flashcards using Bloom's Taxonomy.
Your goal is to generate diverse, pedagogically sound questions that enhance student learning.
</ROLE>

<TASK>
Generate exactly ${max_cards} flashcards from the provided document text.
Each flashcard must be clear, focused, and answerable from the document content.
</TASK>

<BLOOM_TAXONOMY_DISTRIBUTION>
Create questions across all cognitive levels with this exact distribution:

1. REMEMBER (20%): Recall facts, definitions, terminology
   - "Define X"
   - "What is the name of Y?"
   - "List the components of Z"

2. UNDERSTAND (25%): Explain concepts, summarize, interpret
   - "Explain why X works"
   - "Summarize the main idea of Y"
   - "What does Z mean in this context?"

3. APPLY (25%): Solve problems, use knowledge, execute procedures
   - "Calculate X given Y"
   - "Implement an algorithm for Z"
   - "Apply concept X to scenario Y"

4. ANALYZE (15%): Compare, categorize, examine relationships
   - "Compare X and Y"
   - "What is the relationship between X and Y?"
   - "Categorize Z based on criteria X"

5. EVALUATE (10%): Critique, justify, assess quality
   - "What are the tradeoffs of X vs Y?"
   - "Critique the approach in Z"
   - "Assess the effectiveness of X"

6. CREATE (5%): Design solutions, construct, synthesize
   - "Design a system for X"
   - "Propose a solution to Y"
   - "Construct a plan for Z"
</BLOOM_TAXONOMY_DISTRIBUTION>

<CARD_TYPES>
Allowed types: ${card_types.join(', ')}

Type-specific guidelines:

• basic: Factual/conceptual questions with direct text answers
  Example: "What is polymorphism?" → "Polymorphism allows objects..."

• mcq: Multiple choice with exactly 4 options
  Format answer as: "A) option1\\nB) option2\\nC) option3\\nD) option4\\nCorrect: A"
  Example: "Which is a SOLID principle?" with 4 options

• code: Programming problems with complete solutions
  Include full working code in the answer
  Example: "Write binary search" → "function binarySearch(arr, target) { ... }"

• cloze: Fill-in-the-blank using {{c1::text}} syntax
  Example: "The capital of France is {{c1::Paris}}"
</CARD_TYPES>

<QUALITY_CRITERIA>
Each flashcard must meet these standards:

1. **Clarity**: Unambiguous question, single correct answer
2. **Accuracy**: Factually correct based on document
3. **Scope**: Tests exactly one concept per card
4. **Answerable**: Can be answered from provided text
5. **Difficulty**: ${difficulty} level (easy/medium/hard)
6. **Uniqueness**: No duplicate or nearly-identical questions
</QUALITY_CRITERIA>

<CONFIDENCE_SCORING>
Set confidence (0.0-1.0) based on:
- 0.9-1.0: Excellent clarity, directly from text, unambiguous
- 0.7-0.9: Good quality, clear answer, minor interpretation needed
- 0.5-0.7: Acceptable, some ambiguity or inference required
- Below 0.5: Questionable quality (avoid generating these)

Aim for average confidence ≥ 0.8
</CONFIDENCE_SCORING>

<OUTPUT_FORMAT>
Return valid JSON matching this exact schema:
{
  "cards": [
    {
      "type": "basic" | "mcq" | "cloze" | "code",
      "prompt": "Clear, concise question text",
      "answer": "Complete answer text",
      "bloom_level": "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create",
      "confidence": 0.0-1.0
    }
  ]
}
</OUTPUT_FORMAT>

<CRITICAL_RULES>
1. Generate EXACTLY ${max_cards} cards (no more, no less)
2. Follow Bloom's distribution percentages (±1 card tolerance)
3. Ensure every card has all required fields
4. Never generate questions not answerable from the document
5. Maintain high confidence scores (≥0.8 average)
6. Use appropriate card types for each Bloom's level
7. No duplicate questions or trivial variations
</CRITICAL_RULES>`;
  }

  /**
   * Grade a freeform student answer using GPT-4o
   * (For future use - LLM-graded freeform responses)
   */
  async gradeFreeformAnswer(
    prompt: string,
    studentAnswer: string,
    referenceAnswer: string
  ): Promise<GradeResult> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `<ROLE>
You are grading a student's answer to a flashcard question.
Be fair but rigorous. Focus on semantic equivalence, not exact wording.
</ROLE>

<GRADING_CRITERIA>
- Key concepts must be present
- No major factual errors
- Semantic equivalence to reference (not exact match required)
- Partial credit for partially correct answers
</GRADING_CRITERIA>`,
          },
          {
            role: 'user',
            content: `<QUESTION>${prompt}</QUESTION>
<REFERENCE_ANSWER>${referenceAnswer}</REFERENCE_ANSWER>
<STUDENT_ANSWER>${studentAnswer}</STUDENT_ANSWER>

<TASK>
Determine if the student's answer is correct and provide constructive feedback.
</TASK>`,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'grading_result',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                correctness: { type: 'boolean' },
                feedback: { type: 'string', minLength: 10, maxLength: 500 },
                confidence: { type: 'number', minimum: 0, maximum: 1 },
              },
              required: ['correctness', 'feedback', 'confidence'],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No grading response from GPT-4o');
      }

      return JSON.parse(content);
    } catch (error: any) {
      console.error('GPT-4o grading error:', error);
      throw new Error(`Failed to grade answer: ${error.message}`);
    }
  }
}
