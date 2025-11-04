'use client';

import { Card } from '@/lib/selection';
import { deleteCard } from '@/lib/actions';
import { useState } from 'react';

export function CardList({ cards }: { cards: Card[] }) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No cards yet. Add your first card above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}

function CardItem({ card }: { card: Card }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return;
    }

    setIsDeleting(true);
    await deleteCard(card.id);
    // Page will revalidate automatically
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {card.type}
            </span>
            {card.source === 'generated' && (
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                AI Generated
              </span>
            )}
            {card.suspended && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                Suspended
              </span>
            )}
          </div>
          <div className="text-gray-900 mb-2">
            <strong>Q:</strong> {card.prompt}
          </div>
          {isExpanded && (
            <div className="text-gray-700 mt-2 p-3 bg-gray-50 rounded">
              <strong>A:</strong> {card.answer}
            </div>
          )}
          {card.due_at && (
            <div className="text-xs text-gray-500 mt-2">
              Schedule: {card.repetition} reps, interval {card.interval_days}d, 
              ease {card.e_factor.toFixed(2)}, due {new Date(card.due_at).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-secondary text-sm"
          >
            {isExpanded ? 'Hide' : 'Show'} Answer
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger text-sm"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
