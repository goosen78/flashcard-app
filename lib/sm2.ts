/**
 * SM-2 Spaced Repetition Algorithm
 * 
 * Implements the SuperMemo 2 algorithm with clear invariants:
 * - E-factor (ease) stays within [1.3, ∞)
 * - Interval increases for quality >= 3
 * - Cards reset to interval 1 for quality < 3
 * - Due dates are always floored to day boundaries (UTC)
 */

export interface CardState {
  e_factor: number;
  interval_days: number;
  repetition: number;
}

export interface UpdatedCardState extends CardState {
  due_at: string; // ISO date string, floored to day boundary
}

/**
 * Updates card scheduling state based on review quality
 * 
 * @param cardState - Current scheduling state
 * @param quality - Quality rating from 0 (complete fail) to 5 (perfect)
 * @param now - Current timestamp (ISO string or Date)
 * @returns Updated card state with new due date
 * 
 * Invariants:
 * - quality must be in [0, 5]
 * - e_factor will be >= 1.3
 * - interval_days will be >= 1 after first review
 * - For quality >= 3: interval increases (monotonic with stable E)
 * - For quality < 3: reset to beginning (repetition=0, interval=1)
 */
export function sm2Update(
  cardState: CardState,
  quality: number,
  now: Date | string = new Date()
): UpdatedCardState {
  // Validate input
  if (quality < 0 || quality > 5) {
    throw new Error(`Quality must be in [0, 5], got ${quality}`);
  }

  const currentDate = typeof now === 'string' ? new Date(now) : now;
  
  let { e_factor, interval_days, repetition } = cardState;
  
  // Update E-factor
  // Formula: E' = E + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  // Simplifies to: E' = E - 0.8 + 0.28*q - 0.02*q^2
  e_factor = e_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Enforce minimum E-factor
  if (e_factor < 1.3) {
    e_factor = 1.3;
  }
  
  // Update repetition and interval based on quality
  if (quality < 3) {
    // Failed: reset to beginning
    repetition = 0;
    interval_days = 1;
  } else {
    // Passed: advance
    repetition = repetition + 1;
    
    if (repetition === 1) {
      interval_days = 1;
    } else if (repetition === 2) {
      interval_days = 6;
    } else {
      // Subsequent intervals: multiply by E-factor
      interval_days = Math.round(interval_days * e_factor);
    }
  }
  
  // Calculate due date (floor to day boundary in UTC)
  const dueDate = new Date(currentDate);
  dueDate.setUTCDate(dueDate.getUTCDate() + interval_days);
  const due_at = floorToDay(dueDate);
  
  return {
    e_factor,
    interval_days,
    repetition,
    due_at,
  };
}

/**
 * Floor a date to the start of its day in UTC
 * This ensures consistent due date comparisons
 */
export function floorToDay(date: Date): string {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

/**
 * Check if a card is due for review
 */
export function isDue(dueAt: string | null, now: Date | string = new Date()): boolean {
  if (!dueAt) {
    // Never scheduled (new card)
    return false;
  }
  
  const currentDate = typeof now === 'string' ? new Date(now) : now;
  const dueDate = new Date(dueAt);
  
  return currentDate >= dueDate;
}

/**
 * Get the initial scheduling state for a new card
 */
export function getInitialCardState(): CardState {
  return {
    e_factor: 2.5,
    interval_days: 0,
    repetition: 0,
  };
}
