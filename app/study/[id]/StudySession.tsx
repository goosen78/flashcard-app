'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/lib/selection';
import { getNextCard, submitReview } from '@/lib/actions';

export function StudySession({ deckId, deckName }: { deckId: string; deckName: string }) {
  const [card, setCard] = useState<Card | null | undefined>(undefined);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    loadNextCard();
  }, []);

  const loadNextCard = async () => {
    const nextCard = await getNextCard(deckId);
    setCard(nextCard);
    setShowAnswer(false);
    setStartTime(Date.now());
  };

  const handleRate = async (quality: number) => {
    if (!card || isSubmitting) return;

    setIsSubmitting(true);
    const latencyMs = Date.now() - startTime;

    const result = await submitReview(card.id, quality, latencyMs);

    if (result.success) {
      setReviewedCount((c) => c + 1);
      setCard(result.nextCard);
      setShowAnswer(false);
      setStartTime(Date.now());
    }

    setIsSubmitting(false);
  };

  // Loading state
  if (card === undefined) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // No more cards
  if (card === null) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Great job! 🎉</h2>
        <p className="text-gray-600 mb-2">You've completed all cards for today.</p>
        <p className="text-gray-600 mb-8">
          You reviewed <strong>{reviewedCount}</strong> card{reviewedCount !== 1 ? 's' : ''}.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to Decks
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Decks
        </Link>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{deckName}</span>
          {reviewedCount > 0 && (
            <span className="ml-4">{reviewedCount} reviewed</span>
          )}
        </div>
      </div>

      <div className="card min-h-[400px] flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {card.type}
              </span>
              {card.due_at ? (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                  Review
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                  New
                </span>
              )}
            </div>
            <div className="text-xl mb-6">
              <div className="font-medium text-gray-900 whitespace-pre-wrap">
                {card.prompt}
              </div>
            </div>
          </div>

          {showAnswer && (
            <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-lg whitespace-pre-wrap">
                {card.answer}
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full btn btn-primary text-lg py-3"
            >
              Show Answer
            </button>
          ) : (
            <div>
              <div className="text-sm text-gray-600 mb-3 text-center">
                How well did you know this?
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleRate(0)}
                  disabled={isSubmitting}
                  className="btn bg-red-600 text-white hover:bg-red-700 py-3"
                >
                  <div className="font-bold">Again</div>
                  <div className="text-xs">&lt;1m</div>
                </button>
                <button
                  onClick={() => handleRate(3)}
                  disabled={isSubmitting}
                  className="btn bg-yellow-600 text-white hover:bg-yellow-700 py-3"
                >
                  <div className="font-bold">Hard</div>
                  <div className="text-xs">&lt;10m</div>
                </button>
                <button
                  onClick={() => handleRate(4)}
                  disabled={isSubmitting}
                  className="btn bg-green-600 text-white hover:bg-green-700 py-3"
                >
                  <div className="font-bold">Good</div>
                  <div className="text-xs">
                    {card.due_at
                      ? `${card.interval_days}d`
                      : '1d'}
                  </div>
                </button>
              </div>
              <button
                onClick={() => handleRate(5)}
                disabled={isSubmitting}
                className="w-full mt-2 btn bg-blue-600 text-white hover:bg-blue-700 py-3"
              >
                <div className="font-bold">Easy</div>
                <div className="text-xs">
                  {card.due_at
                    ? `${Math.round(card.interval_days * card.e_factor)}d`
                    : '6d'}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Keyboard shortcuts: Space to reveal, 1-4 to rate</p>
      </div>
    </div>
  );
}
