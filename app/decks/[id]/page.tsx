import Link from 'next/link';
import { getDeck, getCardsForDeck, getDeckStats } from '@/lib/selection';
import { notFound } from 'next/navigation';
import { CreateCardForm } from './CreateCardForm';
import { CardList } from './CardList';

export default function DeckPage({ params }: { params: { id: string } }) {
  const deck = getDeck(params.id);

  if (!deck) {
    notFound();
  }

  const cards = getCardsForDeck(params.id);
  const stats = getDeckStats(params.id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Decks
        </Link>
        <h2 className="text-3xl font-bold mb-2">{deck.name}</h2>
        {deck.description && (
          <p className="text-gray-600 mb-4">{deck.description}</p>
        )}
        <div className="flex gap-4 text-sm">
          <span className="font-medium text-blue-600">{stats.due} due</span>
          <span>{stats.new} new</span>
          <span>{stats.learning} learning</span>
          <span className="text-gray-400">({stats.total} total)</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Settings</h3>
        <div className="card">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">New cards per day:</span>
              <span className="ml-2 font-medium">{deck.new_cards_per_day}</span>
            </div>
            <div>
              <span className="text-gray-600">Review limit per day:</span>
              <span className="ml-2 font-medium">{deck.review_limit_per_day}</span>
            </div>
            <div>
              <span className="text-gray-600">Release state:</span>
              <span className="ml-2 font-medium capitalize">{deck.release_state}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Add Card</h3>
        <CreateCardForm deckId={params.id} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Cards ({cards.length})</h3>
        <CardList cards={cards} />
      </div>
    </div>
  );
}
