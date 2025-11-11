import { describe, it, expect } from 'vitest';
import {
  sm2Update,
  floorToDay,
  isDue,
  getInitialCardState,
  CardState,
} from '../lib/sm2';

describe('SM-2 Scheduling Algorithm', () => {
  describe('getInitialCardState', () => {
    it('should return correct initial state', () => {
      const state = getInitialCardState();
      expect(state.e_factor).toBe(2.5);
      expect(state.interval_days).toBe(0);
      expect(state.repetition).toBe(0);
    });
  });

  describe('floorToDay', () => {
    it('should floor date to start of day in UTC', () => {
      const date = new Date('2024-01-15T14:30:00.000Z');
      const floored = floorToDay(date);
      expect(floored).toBe('2024-01-15T00:00:00.000Z');
    });

    it('should handle dates already at start of day', () => {
      const date = new Date('2024-01-15T00:00:00.000Z');
      const floored = floorToDay(date);
      expect(floored).toBe('2024-01-15T00:00:00.000Z');
    });
  });

  describe('isDue', () => {
    it('should return false for new cards (null due_at)', () => {
      expect(isDue(null)).toBe(false);
    });

    it('should return true when due date is in the past', () => {
      const pastDate = new Date('2024-01-01T00:00:00.000Z');
      const now = new Date('2024-01-15T00:00:00.000Z');
      expect(isDue(pastDate.toISOString(), now)).toBe(true);
    });

    it('should return false when due date is in the future', () => {
      const futureDate = new Date('2024-12-31T00:00:00.000Z');
      const now = new Date('2024-01-15T00:00:00.000Z');
      expect(isDue(futureDate.toISOString(), now)).toBe(false);
    });

    it('should return true when due date equals current date', () => {
      const date = new Date('2024-01-15T00:00:00.000Z');
      expect(isDue(date.toISOString(), date)).toBe(true);
    });
  });

  describe('sm2Update', () => {
    const now = new Date('2024-01-15T12:00:00.000Z');
    const initialState: CardState = getInitialCardState();

    describe('quality validation', () => {
      it('should throw error for quality < 0', () => {
        expect(() => sm2Update(initialState, -1, now)).toThrow();
      });

      it('should throw error for quality > 5', () => {
        expect(() => sm2Update(initialState, 6, now)).toThrow();
      });

      it('should accept quality 0-5', () => {
        for (let q = 0; q <= 5; q++) {
          expect(() => sm2Update(initialState, q, now)).not.toThrow();
        }
      });
    });

    describe('first review (repetition 0 -> 1)', () => {
      it('should set interval to 1 day for quality >= 3', () => {
        const result = sm2Update(initialState, 3, now);
        expect(result.interval_days).toBe(1);
        expect(result.repetition).toBe(1);
      });

      it('should set interval to 1 day even for quality 5', () => {
        const result = sm2Update(initialState, 5, now);
        expect(result.interval_days).toBe(1);
        expect(result.repetition).toBe(1);
      });

      it('should reset to interval 1 for quality < 3', () => {
        const result = sm2Update(initialState, 2, now);
        expect(result.interval_days).toBe(1);
        expect(result.repetition).toBe(0);
      });

      it('should set correct due date (today + interval)', () => {
        const result = sm2Update(initialState, 4, now);
        const expectedDue = new Date('2024-01-16T00:00:00.000Z');
        expect(result.due_at).toBe(expectedDue.toISOString());
      });
    });

    describe('second review (repetition 1 -> 2)', () => {
      const stateAfterFirst: CardState = {
        e_factor: 2.5,
        interval_days: 1,
        repetition: 1,
      };

      it('should set interval to 6 days for quality >= 3', () => {
        const result = sm2Update(stateAfterFirst, 4, now);
        expect(result.interval_days).toBe(6);
        expect(result.repetition).toBe(2);
      });

      it('should reset for quality < 3', () => {
        const result = sm2Update(stateAfterFirst, 2, now);
        expect(result.interval_days).toBe(1);
        expect(result.repetition).toBe(0);
      });
    });

    describe('subsequent reviews (repetition >= 2)', () => {
      const stateAfterSecond: CardState = {
        e_factor: 2.5,
        interval_days: 6,
        repetition: 2,
      };

      it('should multiply interval by e_factor for quality >= 3', () => {
        const result = sm2Update(stateAfterSecond, 4, now);
        // interval = round(6 * 2.5) = 15
        expect(result.interval_days).toBe(15);
        expect(result.repetition).toBe(3);
      });

      it('should increase interval progressively', () => {
        let state = stateAfterSecond;
        const intervals: number[] = [];

        for (let i = 0; i < 5; i++) {
          state = {
            ...sm2Update(state, 4, now),
          };
          intervals.push(state.interval_days);
        }

        // Check monotonic increase
        for (let i = 1; i < intervals.length; i++) {
          expect(intervals[i]).toBeGreaterThanOrEqual(intervals[i - 1]);
        }
      });

      it('should reset for quality < 3', () => {
        const result = sm2Update(stateAfterSecond, 1, now);
        expect(result.interval_days).toBe(1);
        expect(result.repetition).toBe(0);
      });
    });

    describe('E-factor updates', () => {
      it('should decrease E-factor for low quality', () => {
        const result = sm2Update(initialState, 0, now);
        expect(result.e_factor).toBeLessThan(initialState.e_factor);
      });

      it('should increase E-factor for high quality', () => {
        const result = sm2Update(initialState, 5, now);
        expect(result.e_factor).toBeGreaterThan(initialState.e_factor);
      });

      it('should keep E-factor roughly stable for quality 4', () => {
        const result = sm2Update(initialState, 4, now);
        expect(Math.abs(result.e_factor - initialState.e_factor)).toBeLessThan(0.1);
      });

      it('should enforce minimum E-factor of 1.3', () => {
        let state: CardState = { ...initialState, e_factor: 1.4 };
        
        // Multiple low-quality reviews
        for (let i = 0; i < 10; i++) {
          state = { ...sm2Update(state, 0, now) };
        }

        expect(state.e_factor).toBeGreaterThanOrEqual(1.3);
      });

      it('should never have E-factor below 1.3', () => {
        const testCases = [
          { e_factor: 1.3, quality: 0 },
          { e_factor: 1.5, quality: 0 },
          { e_factor: 2.0, quality: 1 },
        ];

        testCases.forEach(({ e_factor, quality }) => {
          const state: CardState = { ...initialState, e_factor };
          const result = sm2Update(state, quality, now);
          expect(result.e_factor).toBeGreaterThanOrEqual(1.3);
        });
      });
    });

    describe('invariants', () => {
      it('should always produce interval >= 1 after review', () => {
        const qualities = [0, 1, 2, 3, 4, 5];
        qualities.forEach((q) => {
          const result = sm2Update(initialState, q, now);
          expect(result.interval_days).toBeGreaterThanOrEqual(1);
        });
      });

      it('should always have valid e_factor', () => {
        const qualities = [0, 1, 2, 3, 4, 5];
        qualities.forEach((q) => {
          const result = sm2Update(initialState, q, now);
          expect(result.e_factor).toBeGreaterThanOrEqual(1.3);
          expect(result.e_factor).toBeLessThan(100); // Sanity check
        });
      });

      it('should floor due_at to day boundary', () => {
        const result = sm2Update(initialState, 4, now);
        const dueDate = new Date(result.due_at);
        expect(dueDate.getUTCHours()).toBe(0);
        expect(dueDate.getUTCMinutes()).toBe(0);
        expect(dueDate.getUTCSeconds()).toBe(0);
        expect(dueDate.getUTCMilliseconds()).toBe(0);
      });
    });

    describe('property-based: stability over sequences', () => {
      it('should handle alternating good/bad reviews', () => {
        let state = initialState;
        const qualities = [5, 0, 5, 0, 5, 0];

        qualities.forEach((q) => {
          state = { ...sm2Update(state, q, now) };
          expect(state.e_factor).toBeGreaterThanOrEqual(1.3);
          expect(state.interval_days).toBeGreaterThanOrEqual(1);
          expect(state.repetition).toBeGreaterThanOrEqual(0);
        });
      });

      it('should handle perfect sequence', () => {
        let state = initialState;
        const intervals: number[] = [];

        for (let i = 0; i < 10; i++) {
          state = { ...sm2Update(state, 5, now) };
          intervals.push(state.interval_days);
        }

        // With perfect ratings, intervals should generally increase
        expect(intervals[intervals.length - 1]).toBeGreaterThan(intervals[0]);
      });

      it('should handle failure sequence', () => {
        let state = initialState;

        for (let i = 0; i < 10; i++) {
          state = { ...sm2Update(state, 0, now) };
        }

        // Should still be in valid state
        expect(state.e_factor).toBe(1.3); // At minimum
        expect(state.interval_days).toBe(1);
        expect(state.repetition).toBe(0); // Reset every time
      });
    });
  });
});
